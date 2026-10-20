"""Fixtures dos testes do backend.

O `main.py` lê as variáveis de ambiente e cria o banco quando é importado. Por isso cada
teste importa o módulo de novo, com um banco e uma pasta de estáticos só dele, dentro de
`tmp_path`. Assim nenhum teste enxerga dados de outro nem toca em /data.
"""
import importlib
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parent.parent

ADMIN_USER = "gabriel"
ADMIN_PASS = "senha-de-teste"
VISITOR_SALT = "sal-de-teste"


def load_main(monkeypatch, tmp_path, with_static=True, env=None):
    """Importa o `main` do zero com o ambiente de teste e devolve o módulo.

    `env` sobrescreve variáveis; um valor None remove a variável do ambiente.
    """
    valores = {
        "DB_PATH": str(tmp_path / "data" / "site.db"),
        "ADMIN_USER": ADMIN_USER,
        "ADMIN_PASS": ADMIN_PASS,
        "VISITOR_SALT": VISITOR_SALT,
        **(env or {}),
    }
    for nome, valor in valores.items():
        if valor is None:
            monkeypatch.delenv(nome, raising=False)
        else:
            monkeypatch.setenv(nome, valor)

    static = tmp_path / "static"
    if with_static and not static.exists():
        (static / "assets").mkdir(parents=True)
        (static / "index.html").write_text("<!doctype html><title>spa-index</title>")
        (static / "assets" / "app.js").write_text("console.log('app')")
        (static / "robots.txt").write_text("User-agent: *")
    monkeypatch.setenv("STATIC_DIR", str(static))

    monkeypatch.syspath_prepend(str(BACKEND_DIR))
    sys.modules.pop("main", None)
    return importlib.import_module("main")


@pytest.fixture
def main_module(monkeypatch, tmp_path):
    module = load_main(monkeypatch, tmp_path)
    yield module
    sys.modules.pop("main", None)


@pytest.fixture
def client(main_module):
    return TestClient(main_module.app)


@pytest.fixture
def dev_client(monkeypatch, tmp_path):
    """App sem pasta de estáticos, como no desenvolvimento local."""
    module = load_main(monkeypatch, tmp_path, with_static=False)
    yield TestClient(module.app)
    sys.modules.pop("main", None)


@pytest.fixture
def app_with(monkeypatch, tmp_path):
    """Sobe o app com variáveis de ambiente diferentes das padrão dos testes."""

    def build(**env):
        module = load_main(monkeypatch, tmp_path, env=env)
        return module, TestClient(module.app)

    yield build
    sys.modules.pop("main", None)


@pytest.fixture
def admin_auth():
    return (ADMIN_USER, ADMIN_PASS)


@pytest.fixture
def rows(main_module):
    """Lê tabelas do banco de teste como lista de dicts."""

    def read(table):
        conn = sqlite3.connect(main_module.DB_PATH)
        conn.row_factory = sqlite3.Row
        try:
            return [dict(r) for r in conn.execute(f"SELECT * FROM {table} ORDER BY id")]
        finally:
            conn.close()

    return read


@pytest.fixture
def seed(main_module):
    """Insere linhas direto no banco, para controlar a data de cada acesso."""

    def pageview(at, path="/", referrer=None, visitor="v1", user_agent="ua", country="gru"):
        if isinstance(at, datetime):
            at = at.astimezone(timezone.utc).isoformat(timespec="seconds")
        with main_module.db() as conn:
            conn.execute(
                "INSERT INTO pageviews (at, path, referrer, user_agent, country, visitor_hash)"
                " VALUES (?, ?, ?, ?, ?, ?)",
                (at, path, referrer, user_agent, country, visitor),
            )

    def event(name, at=None, meta="{}", visitor="v1"):
        at = at or datetime.now(timezone.utc).isoformat(timespec="seconds")
        with main_module.db() as conn:
            conn.execute(
                "INSERT INTO events (at, name, meta, visitor_hash) VALUES (?, ?, ?, ?)",
                (at, name, meta, visitor),
            )

    class Seed:
        pass

    s = Seed()
    s.pageview = pageview
    s.event = event
    return s
