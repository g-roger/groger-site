"""Autenticação e agregações do painel admin (/api/admin/metrics)."""
from datetime import datetime, timedelta, timezone

import pytest

URL = "/api/admin/metrics"


class TestAuth:
    def test_sem_credenciais_pede_autenticacao(self, client):
        r = client.get(URL)
        assert r.status_code == 401
        assert r.headers["www-authenticate"].lower().startswith("basic")

    @pytest.mark.parametrize(
        "auth",
        [
            ("gabriel", "errada"),
            ("outro", "senha-de-teste"),
            ("", ""),
            ("gabriel", ""),
            ("GABRIEL", "senha-de-teste"),
            ("gabriel", "senha-de-teste "),
        ],
    )
    def test_credenciais_erradas_retornam_401(self, client, auth):
        assert client.get(URL, auth=auth).status_code == 401

    def test_credenciais_com_acento_retornam_401_e_nao_500(self, client):
        assert client.get(URL, auth=("gabriël", "sénha")).status_code == 401

    def test_esquema_diferente_de_basic_e_recusado(self, client):
        assert client.get(URL, headers={"authorization": "Bearer qualquer-coisa"}).status_code == 401

    def test_credenciais_certas_retornam_200(self, client, admin_auth):
        assert client.get(URL, auth=admin_auth).status_code == 200

    def test_as_rotas_de_rastreamento_continuam_abertas(self, client):
        assert client.post("/api/track", json={"path": "/"}).status_code == 204
        assert client.get("/api/health").status_code == 200

    def test_senha_do_servidor_com_acento_nao_derruba_o_endpoint(self, client, main_module, monkeypatch):
        monkeypatch.setattr(main_module, "ADMIN_PASS", "sénha-com-acento")
        assert client.get(URL, auth=("gabriel", "errada")).status_code == 401


class TestMetrics:
    def test_banco_vazio_devolve_zeros_e_listas_vazias(self, client, admin_auth):
        data = client.get(URL, auth=admin_auth).json()
        assert data["totals"] == {"views": 0, "unique_visitors": 0, "events": 0, "sessions": 0}
        assert data["last_24h"] == {"views": 0, "unique_visitors": 0}
        for chave in ("top_paths", "top_referrers", "top_events", "daily", "recent"):
            assert data[chave] == []

    def test_totais_e_janela_de_24_horas(self, client, admin_auth, seed):
        agora = datetime.now(timezone.utc)
        seed.pageview(agora - timedelta(hours=1), visitor="a")
        seed.pageview(agora - timedelta(hours=2), visitor="a")
        seed.pageview(agora - timedelta(hours=30), visitor="b")
        seed.pageview(agora - timedelta(days=40), visitor="c")
        seed.event("project_click")
        seed.event("expertise_open")

        data = client.get(URL, auth=admin_auth).json()
        assert data["totals"] == {"views": 4, "unique_visitors": 3, "events": 2, "sessions": 3}
        assert data["last_24h"] == {"views": 2, "unique_visitors": 1}

    def test_paginas_mais_vistas_em_ordem_decrescente(self, client, admin_auth, seed):
        agora = datetime.now(timezone.utc)
        for _ in range(3):
            seed.pageview(agora, path="/")
        seed.pageview(agora, path="/admin")

        data = client.get(URL, auth=admin_auth).json()
        assert data["top_paths"] == [{"path": "/", "views": 3}, {"path": "/admin", "views": 1}]

    def test_paginas_mais_vistas_limita_a_10(self, client, admin_auth, seed):
        agora = datetime.now(timezone.utc)
        for i in range(12):
            seed.pageview(agora, path=f"/p{i}")
        assert len(client.get(URL, auth=admin_auth).json()["top_paths"]) == 10

    def test_origens_ignoram_acessos_diretos(self, client, admin_auth, seed):
        agora = datetime.now(timezone.utc)
        seed.pageview(agora, referrer="https://linkedin.com")
        seed.pageview(agora, referrer="https://linkedin.com")
        seed.pageview(agora, referrer="https://github.com")
        seed.pageview(agora, referrer=None)
        seed.pageview(agora, referrer="")

        data = client.get(URL, auth=admin_auth).json()
        assert data["top_referrers"] == [
            {"referrer": "https://linkedin.com", "views": 2},
            {"referrer": "https://github.com", "views": 1},
        ]

    def test_eventos_mais_frequentes(self, client, admin_auth, seed):
        for nome in ("project_click", "project_click", "expertise_open"):
            seed.event(nome)

        data = client.get(URL, auth=admin_auth).json()
        assert data["top_events"] == [
            {"name": "project_click", "count": 2},
            {"name": "expertise_open", "count": 1},
        ]

    def test_serie_diaria_cobre_os_ultimos_30_dias_em_ordem(self, client, admin_auth, seed):
        agora = datetime.now(timezone.utc)
        seed.pageview(agora - timedelta(hours=1), visitor="a")
        seed.pageview(agora - timedelta(days=5), visitor="a")
        seed.pageview(agora - timedelta(days=5), visitor="b")
        seed.pageview(agora - timedelta(days=29), visitor="c")
        seed.pageview(agora - timedelta(days=45), visitor="d")

        daily = client.get(URL, auth=admin_auth).json()["daily"]
        dias = [d["day"] for d in daily]
        assert dias == sorted(dias)
        assert sum(d["views"] for d in daily) == 4
        limite = (agora - timedelta(days=30)).date().isoformat()
        assert all(dia >= limite for dia in dias)

        cinco_dias = (agora - timedelta(days=5)).date().isoformat()
        assert next(d for d in daily if d["day"] == cinco_dias) == {
            "day": cinco_dias,
            "views": 2,
            "unique": 2,
        }

    def test_recentes_trazem_os_30_mais_novos_primeiro(self, client, admin_auth, seed):
        agora = datetime.now(timezone.utc)
        for i in range(35):
            seed.pageview(agora, path=f"/p{i}")

        recent = client.get(URL, auth=admin_auth).json()["recent"]
        assert len(recent) == 30
        assert recent[0]["path"] == "/p34"
        assert recent[-1]["path"] == "/p5"

    def test_recentes_nao_expoem_o_hash_do_visitante(self, client, admin_auth, seed):
        seed.pageview(datetime.now(timezone.utc))
        recent = client.get(URL, auth=admin_auth).json()["recent"]
        assert set(recent[0]) == {"at", "path", "referrer", "country", "user_agent"}

    def test_acesso_registrado_pela_api_aparece_nas_metricas(self, client, admin_auth):
        client.post(
            "/api/track",
            json={"path": "/", "referrer": "https://linkedin.com"},
            headers={"user-agent": "ua", "fly-client-ip": "198.51.100.7"},
        )
        data = client.get(URL, auth=admin_auth).json()
        assert data["totals"]["views"] == 1
        assert data["last_24h"]["views"] == 1
        assert data["top_referrers"] == [{"referrer": "https://linkedin.com", "views": 1}]
