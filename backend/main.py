"""FastAPI backend: serves the SPA + tracks visits + exposes an admin endpoint."""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import logging
import os
import secrets
import sqlite3
import threading
import time
import unicodedata
from collections import deque
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterator
from urllib.parse import urlsplit, urlunsplit

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

log = logging.getLogger("groger-site")

DB_PATH = Path(os.environ.get("DB_PATH", "/data/site.db"))
STATIC_DIR = Path(os.environ.get("STATIC_DIR", "/app/static"))
ADMIN_USER = os.environ.get("ADMIN_USER", "")
ADMIN_PASS = os.environ.get("ADMIN_PASS", "")
# Without a configured salt, use a random one per process: hashes stay unlinkable to IPs.
VISITOR_SALT = os.environ.get("VISITOR_SALT") or secrets.token_hex(16)
RETENTION_DAYS = int(os.environ.get("RETENTION_DAYS", "365"))

# Private surprise: the photo lives on the volume and the passphrase and message are Fly
# secrets, so nothing personal is in the image or in the public repository.
SURPRISE_PHOTO = Path(os.environ.get("SURPRISE_PHOTO", "/data/surpresa.jpg"))
SURPRISE_PASSPHRASE = os.environ.get("SURPRISE_PASSPHRASE", "")
SURPRISE_MESSAGE = os.environ.get("SURPRISE_MESSAGE", "")

MAX_BODY_BYTES = 16 * 1024
MIN_ADMIN_PASS_LEN = 12
WEAK_ADMIN_PASSWORDS = {"changeme", "admin", "password", "troca", "troca123"}

# Security headers sent with every response. The CSP only allows this origin: no inline
# scripts, no third-party fonts or scripts, no framing.
CONTENT_SECURITY_POLICY = "; ".join(
    [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
    ]
)
SECURITY_HEADERS = {
    "content-security-policy": CONTENT_SECURITY_POLICY,
    "strict-transport-security": "max-age=31536000; includeSubDomains",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
    "cross-origin-opener-policy": "same-origin",
    "cross-origin-resource-policy": "same-origin",
}

# ensure db directory exists
DB_PATH.parent.mkdir(parents=True, exist_ok=True)


@contextmanager
def db() -> Iterator[sqlite3.Connection]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def prune_old_rows(now: datetime | None = None) -> None:
    """Drop visits and events older than RETENTION_DAYS (keep only what the admin needs)."""
    cutoff = ((now or datetime.now(timezone.utc)) - timedelta(days=RETENTION_DAYS)).isoformat(timespec="seconds")
    with db() as conn:
        conn.execute("DELETE FROM pageviews WHERE at < ?", (cutoff,))
        conn.execute("DELETE FROM events WHERE at < ?", (cutoff,))


def init_db() -> None:
    with db() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS pageviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                at TEXT NOT NULL,
                path TEXT NOT NULL,
                referrer TEXT,
                user_agent TEXT,
                country TEXT,
                visitor_hash TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_pageviews_at ON pageviews(at);
            CREATE INDEX IF NOT EXISTS idx_pageviews_path ON pageviews(path);
            CREATE INDEX IF NOT EXISTS idx_pageviews_visitor ON pageviews(visitor_hash);

            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                at TEXT NOT NULL,
                name TEXT NOT NULL,
                meta TEXT,
                visitor_hash TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_events_at ON events(at);
            CREATE INDEX IF NOT EXISTS idx_events_name ON events(name);
            """
        )
    prune_old_rows()


init_db()

if not (ADMIN_USER and ADMIN_PASS):
    log.warning("ADMIN_USER/ADMIN_PASS not set: the admin endpoint is disabled")


class RateLimiter:
    """Sliding-window counter per key, in memory (the site runs on a single machine)."""

    def __init__(self, limit: int, window_seconds: float, max_keys: int = 10_000) -> None:
        self.limit = limit
        self.window = window_seconds
        self.max_keys = max_keys
        self._hits: dict[str, deque[float]] = {}
        self._lock = threading.Lock()

    def _recent(self, key: str, now: float) -> deque[float]:
        q = self._hits.setdefault(key, deque())
        while q and q[0] <= now - self.window:
            q.popleft()
        return q

    def blocked(self, key: str, now: float | None = None) -> bool:
        now = time.monotonic() if now is None else now
        with self._lock:
            return len(self._recent(key, now)) >= self.limit

    def add(self, key: str, now: float | None = None) -> None:
        now = time.monotonic() if now is None else now
        with self._lock:
            if len(self._hits) >= self.max_keys and key not in self._hits:
                self._hits.clear()  # crude, but keeps memory bounded under a flood of keys
            self._recent(key, now).append(now)

    def allow(self, key: str, now: float | None = None) -> bool:
        """Count a hit and say whether it is within the limit."""
        now = time.monotonic() if now is None else now
        with self._lock:
            if len(self._hits) >= self.max_keys and key not in self._hits:
                self._hits.clear()
            q = self._recent(key, now)
            if len(q) >= self.limit:
                return False
            q.append(now)
            return True


tracking_limiter = RateLimiter(limit=60, window_seconds=60)
admin_failures = RateLimiter(limit=10, window_seconds=15 * 60)
surprise_failures = RateLimiter(limit=8, window_seconds=15 * 60)


class BodySizeLimit:
    """Reject /api/* requests whose body is larger than `max_bytes` (with or without Content-Length)."""

    def __init__(self, app: Any, max_bytes: int) -> None:
        self.app = app
        self.max_bytes = max_bytes

    async def __call__(self, scope: dict, receive: Any, send: Any) -> None:
        if scope["type"] != "http" or not scope["path"].startswith("/api/"):
            await self.app(scope, receive, send)
            return

        declared = dict(scope["headers"]).get(b"content-length")
        if declared is not None:
            try:
                too_big = int(declared) > self.max_bytes
            except ValueError:
                too_big = True
            if too_big:
                await self._reject(send)
                return

        chunks: list[bytes] = []
        size = 0
        while True:
            message = await receive()
            if message["type"] == "http.disconnect":
                return
            body = message.get("body", b"")
            size += len(body)
            if size > self.max_bytes:
                await self._reject(send)
                return
            chunks.append(body)
            if not message.get("more_body", False):
                break

        replayed = False

        async def replay() -> dict:
            nonlocal replayed
            if not replayed:
                replayed = True
                return {"type": "http.request", "body": b"".join(chunks), "more_body": False}
            return await receive()

        await self.app(scope, replay, send)

    @staticmethod
    async def _reject(send: Any) -> None:
        body = b'{"detail":"payload too large"}'
        await send(
            {
                "type": "http.response.start",
                "status": 413,
                "headers": [(b"content-type", b"application/json"), (b"content-length", str(len(body)).encode())],
            }
        )
        await send({"type": "http.response.body", "body": body})


class SecurityHeaders:
    """Add security headers to every response; admin API responses are never cached."""

    def __init__(self, app: Any) -> None:
        self.app = app
        self.headers = [(k.encode(), v.encode()) for k, v in SECURITY_HEADERS.items()]

    async def __call__(self, scope: dict, receive: Any, send: Any) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        no_store = scope["path"].startswith("/api/")

        async def send_with_headers(message: dict) -> None:
            if message["type"] == "http.response.start":
                present = {k.lower() for k, _ in message.get("headers", [])}
                extra = [(k, v) for k, v in self.headers if k not in present]
                if no_store and b"cache-control" not in present:
                    extra.append((b"cache-control", b"no-store"))
                message["headers"] = list(message.get("headers", [])) + extra
            await send(message)

        await self.app(scope, receive, send_with_headers)


# no public /docs, /redoc or /openapi.json: they would advertise the admin routes
app = FastAPI(title="Gabriel Roger Site", docs_url=None, redoc_url=None, openapi_url=None)
app.add_middleware(BodySizeLimit, max_bytes=MAX_BODY_BYTES)
app.add_middleware(SecurityHeaders)
security = HTTPBasic(auto_error=False)


def client_ip(request: Request) -> str:
    """IP used for rate limiting. On Fly, fly-client-ip is set by the proxy."""
    return request.headers.get("fly-client-ip") or (request.client.host if request.client else "0.0.0.0")


def visitor_hash(request: Request) -> str:
    """Salted daily hash of IP + user-agent. Not PII, not reversible."""
    ip = (
        request.headers.get("fly-client-ip")
        or request.headers.get("x-forwarded-for", "").split(",")[0].strip()
        or (request.client.host if request.client else "0.0.0.0")
    )
    ua = request.headers.get("user-agent", "")
    day = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    raw = f"{VISITOR_SALT}|{day}|{ip}|{ua}"
    return hashlib.sha256(raw.encode()).hexdigest()[:32]


def country_of(request: Request) -> str | None:
    # Fly sends the edge region (e.g. "gru"), not the visitor's country. Behind a CDN that
    # sets cf-ipcountry this becomes the real country.
    return request.headers.get("fly-region") or request.headers.get("cf-ipcountry") or None


def clean_path(path: str) -> str:
    """Keep only the path: query strings and fragments can carry personal data."""
    path = path.split("#", 1)[0].split("?", 1)[0]
    return path if path.startswith("/") else "/" + path


def clean_referrer(referrer: str | None) -> str | None:
    """Keep scheme, host and path of an http(s) referrer; drop credentials, query and fragment."""
    if not referrer:
        return None
    try:
        parts = urlsplit(referrer.strip())
        host = parts.hostname
        port = parts.port
    except ValueError:
        return None
    if parts.scheme not in ("http", "https") or not host:
        return None
    netloc = f"{host}:{port}" if port else host
    return urlunsplit((parts.scheme, netloc, parts.path, "", "")) or None


def _same(a: str, b: str) -> bool:
    # compare_digest raises TypeError on non-ASCII str, so compare the UTF-8 bytes instead
    return hmac.compare_digest(a.encode("utf-8"), b.encode("utf-8"))


def admin_configured() -> bool:
    return (
        bool(ADMIN_USER)
        and len(ADMIN_PASS) >= MIN_ADMIN_PASS_LEN
        and ADMIN_PASS.lower() not in WEAK_ADMIN_PASSWORDS
    )


def require_admin(request: Request, credentials: HTTPBasicCredentials | None = Depends(security)) -> str:
    if not admin_configured():
        # fail closed: never fall back to a default password
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="admin disabled")

    ip = client_ip(request)
    if admin_failures.blocked(ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="too many attempts, try again later",
            headers={"Retry-After": str(int(admin_failures.window))},
        )

    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="unauthorized",
        headers={"WWW-Authenticate": 'Basic realm="admin"'},
    )
    if credentials is None:
        raise unauthorized
    user_ok = _same(credentials.username, ADMIN_USER)
    pass_ok = _same(credentials.password, ADMIN_PASS)
    if not (user_ok and pass_ok):
        admin_failures.add(ip)
        raise unauthorized
    return credentials.username


def limit_tracking(request: Request) -> None:
    if not tracking_limiter.allow(client_ip(request)):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="too many requests")


class TrackPayload(BaseModel):
    path: str = Field(..., max_length=500)
    referrer: str | None = Field(None, max_length=500)


class EventPayload(BaseModel):
    name: str = Field(..., max_length=100)
    meta: dict[str, Any] = Field(default_factory=dict)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/track", status_code=204, dependencies=[Depends(limit_tracking)])
def track(payload: TrackPayload, request: Request) -> Response:
    with db() as conn:
        conn.execute(
            "INSERT INTO pageviews (at, path, referrer, user_agent, country, visitor_hash) VALUES (?, ?, ?, ?, ?, ?)",
            (
                datetime.now(timezone.utc).isoformat(timespec="seconds"),
                clean_path(payload.path)[:500],
                clean_referrer(payload.referrer),
                (request.headers.get("user-agent") or "")[:400],
                country_of(request),
                visitor_hash(request),
            ),
        )
    return Response(status_code=204)


@app.post("/api/track/event", status_code=204, dependencies=[Depends(limit_tracking)])
def track_event(payload: EventPayload, request: Request) -> Response:
    with db() as conn:
        conn.execute(
            "INSERT INTO events (at, name, meta, visitor_hash) VALUES (?, ?, ?, ?)",
            (
                datetime.now(timezone.utc).isoformat(timespec="seconds"),
                payload.name[:100],
                json.dumps(payload.meta)[:2000],
                visitor_hash(request),
            ),
        )
    return Response(status_code=204)


@app.get("/api/admin/metrics")
def metrics(_: str = Depends(require_admin)) -> JSONResponse:
    prune_old_rows()
    now = datetime.now(timezone.utc)
    day_ago = (now - timedelta(hours=24)).isoformat(timespec="seconds")
    thirty_ago = (now - timedelta(days=30)).date().isoformat()

    with db() as conn:
        totals_row = conn.execute(
            "SELECT COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS uniq FROM pageviews"
        ).fetchone()
        events_row = conn.execute("SELECT COUNT(*) AS c FROM events").fetchone()
        sessions_row = conn.execute("SELECT COUNT(DISTINCT visitor_hash) AS s FROM pageviews").fetchone()

        last24_row = conn.execute(
            "SELECT COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS uniq FROM pageviews WHERE at >= ?",
            (day_ago,),
        ).fetchone()

        top_paths = conn.execute(
            "SELECT path, COUNT(*) AS views FROM pageviews GROUP BY path ORDER BY views DESC LIMIT 10"
        ).fetchall()

        top_refs = conn.execute(
            "SELECT COALESCE(referrer, '') AS referrer, COUNT(*) AS views FROM pageviews WHERE referrer IS NOT NULL AND referrer <> '' GROUP BY referrer ORDER BY views DESC LIMIT 10"
        ).fetchall()

        top_events = conn.execute(
            "SELECT name, COUNT(*) AS count FROM events GROUP BY name ORDER BY count DESC LIMIT 10"
        ).fetchall()

        daily = conn.execute(
            """
            SELECT substr(at, 1, 10) AS day, COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS uniq
            FROM pageviews
            WHERE substr(at, 1, 10) >= ?
            GROUP BY day
            ORDER BY day
            """,
            (thirty_ago,),
        ).fetchall()

        recent = conn.execute(
            "SELECT at, path, referrer, country, user_agent FROM pageviews ORDER BY id DESC LIMIT 30"
        ).fetchall()

    return JSONResponse(
        {
            "totals": {
                "views": totals_row["views"],
                "unique_visitors": totals_row["uniq"],
                "events": events_row["c"],
                "sessions": sessions_row["s"],
            },
            "last_24h": {
                "views": last24_row["views"],
                "unique_visitors": last24_row["uniq"],
            },
            "top_paths": [dict(r) for r in top_paths],
            "top_referrers": [{"referrer": r["referrer"], "views": r["views"]} for r in top_refs],
            "top_events": [dict(r) for r in top_events],
            "daily": [{"day": r["day"], "views": r["views"], "unique": r["uniq"]} for r in daily],
            "recent": [dict(r) for r in recent],
        }
    )


# --- private surprise -----------------------------------------------------
def normalize_passphrase(text: str) -> str:
    """Case, accents and extra spaces don't matter (phone keyboards capitalize and autocorrect)."""
    no_accents = "".join(
        c for c in unicodedata.normalize("NFKD", text) if not unicodedata.combining(c)
    )
    return " ".join(no_accents.lower().split())


def surprise_token() -> str:
    """Token that lets a device that already typed the passphrase open it again.

    Derived from the passphrase, so changing the passphrase forgets every device.
    """
    key = normalize_passphrase(SURPRISE_PASSPHRASE).encode("utf-8")
    return hmac.new(key, b"lembrar-este-aparelho", hashlib.sha256).hexdigest()


def surprise_enabled() -> bool:
    return bool(normalize_passphrase(SURPRISE_PASSPHRASE)) and bool(SURPRISE_MESSAGE) and SURPRISE_PHOTO.is_file()


class SurprisePayload(BaseModel):
    senha: str | None = Field(None, max_length=200)
    token: str | None = Field(None, max_length=200)


@app.post("/api/surpresa")
def surprise(payload: SurprisePayload, request: Request) -> JSONResponse:
    if not surprise_enabled():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    ip = client_ip(request)
    if surprise_failures.blocked(ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="too many attempts, try again later",
            headers={"Retry-After": str(int(surprise_failures.window))},
        )

    expected = normalize_passphrase(SURPRISE_PASSPHRASE)
    ok = False
    if payload.senha is not None:
        ok = _same(normalize_passphrase(payload.senha), expected)
    elif payload.token is not None:
        ok = _same(payload.token, surprise_token())
    if not ok:
        surprise_failures.add(ip)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="unauthorized")

    photo = base64.b64encode(SURPRISE_PHOTO.read_bytes()).decode("ascii")
    return JSONResponse(
        {
            "mensagem": SURPRISE_MESSAGE,
            "foto": f"data:image/jpeg;base64,{photo}",
            "token": surprise_token(),
        }
    )


# --- SPA static serving ---------------------------------------------------
if STATIC_DIR.exists():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    def static_file(full_path: str) -> Path | None:
        """Return the file for `full_path` only if it really lives inside STATIC_DIR.

        `..`, absolute paths ("//etc/passwd" reaches us as "/etc/passwd", and joining an
        absolute path discards the base) and symlinks pointing outside are all rejected.
        """
        if not full_path:
            return None
        root = STATIC_DIR.resolve()
        try:
            candidate = (root / full_path).resolve()
        except (ValueError, OSError):  # e.g. NUL byte in the path
            return None
        if candidate.is_file() and candidate.is_relative_to(root):
            return candidate
        return None

    @app.get("/{full_path:path}", include_in_schema=False)
    def spa(full_path: str) -> FileResponse:
        # never intercept /api/*
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404)
        return FileResponse(static_file(full_path) or STATIC_DIR / "index.html")

else:

    @app.get("/", include_in_schema=False)
    def dev_root() -> dict[str, str]:
        return {"message": "dev backend, SPA served by Vite on :5173"}
