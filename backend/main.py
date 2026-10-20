"""FastAPI backend: serves the SPA + tracks visits + exposes an admin endpoint."""
from __future__ import annotations

import hashlib
import hmac
import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterator

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

DB_PATH = Path(os.environ.get("DB_PATH", "/data/site.db"))
STATIC_DIR = Path(os.environ.get("STATIC_DIR", "/app/static"))
ADMIN_USER = os.environ.get("ADMIN_USER", "admin")
ADMIN_PASS = os.environ.get("ADMIN_PASS", "changeme")
VISITOR_SALT = os.environ.get("VISITOR_SALT", "groger-salt")

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


init_db()

app = FastAPI(title="Gabriel Roger Site")
security = HTTPBasic()


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


def _same(a: str, b: str) -> bool:
    # compare_digest raises TypeError on non-ASCII str, so compare the UTF-8 bytes instead
    return hmac.compare_digest(a.encode("utf-8"), b.encode("utf-8"))


def require_admin(credentials: HTTPBasicCredentials = Depends(security)) -> str:
    user_ok = _same(credentials.username, ADMIN_USER)
    pass_ok = _same(credentials.password, ADMIN_PASS)
    if not (user_ok and pass_ok):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="unauthorized",
            headers={"WWW-Authenticate": 'Basic realm="admin"'},
        )
    return credentials.username


class TrackPayload(BaseModel):
    path: str = Field(..., max_length=500)
    referrer: str | None = Field(None, max_length=500)


class EventPayload(BaseModel):
    name: str = Field(..., max_length=100)
    meta: dict[str, Any] = Field(default_factory=dict)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/track", status_code=204)
def track(payload: TrackPayload, request: Request) -> Response:
    with db() as conn:
        conn.execute(
            "INSERT INTO pageviews (at, path, referrer, user_agent, country, visitor_hash) VALUES (?, ?, ?, ?, ?, ?)",
            (
                datetime.now(timezone.utc).isoformat(timespec="seconds"),
                payload.path[:500],
                (payload.referrer or None) and payload.referrer[:500],
                (request.headers.get("user-agent") or "")[:400],
                country_of(request),
                visitor_hash(request),
            ),
        )
    return Response(status_code=204)


@app.post("/api/track/event", status_code=204)
def track_event(payload: EventPayload, request: Request) -> Response:
    import json

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
