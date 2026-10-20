"""Proteções do servidor: cabeçalhos, admin fechado por padrão, limite de tentativas,
limite de tamanho, limpeza de dados pessoais e retenção."""
from datetime import datetime, timedelta, timezone

import pytest

ADMIN_URL = "/api/admin/metrics"


def ip(n):
    return {"fly-client-ip": f"198.51.100.{n}", "user-agent": "pytest"}


class TestCabecalhosDeSeguranca:
    @pytest.mark.parametrize("path", ["/", "/admin", "/api/health", "/api/nao-existe", "/assets/app.js"])
    def test_todas_as_respostas_tem_os_cabecalhos(self, client, path):
        h = client.get(path).headers
        assert h["x-content-type-options"] == "nosniff"
        assert h["x-frame-options"] == "DENY"
        assert h["referrer-policy"] == "strict-origin-when-cross-origin"
        assert h["strict-transport-security"].startswith("max-age=31536000")
        assert "camera=()" in h["permissions-policy"]
        assert h["cross-origin-opener-policy"] == "same-origin"
        assert "content-security-policy" in h

    def test_csp_so_permite_o_proprio_site(self, client):
        csp = client.get("/").headers["content-security-policy"]
        diretivas = dict(d.strip().split(" ", 1) for d in csp.split(";"))
        assert diretivas["default-src"] == "'self'"
        assert diretivas["script-src"] == "'self'"
        assert diretivas["frame-ancestors"] == "'none'"
        assert diretivas["object-src"] == "'none'"
        assert "unsafe-inline" not in csp
        assert "unsafe-eval" not in csp
        assert "http" not in csp  # nenhuma origem de terceiros, nem as fontes do Google

    def test_respostas_da_api_nao_ficam_em_cache(self, client, admin_auth):
        assert client.get(ADMIN_URL, auth=admin_auth).headers["cache-control"] == "no-store"
        assert client.post("/api/track", json={"path": "/"}).headers["cache-control"] == "no-store"

    def test_a_pagina_pode_ficar_em_cache(self, client):
        assert client.get("/").headers.get("cache-control") != "no-store"


class TestAdminFechadoPorPadrao:
    @pytest.mark.parametrize(
        "env",
        [
            {"ADMIN_PASS": None},
            {"ADMIN_USER": None},
            {"ADMIN_PASS": ""},
            {"ADMIN_PASS": "changeme"},
            {"ADMIN_PASS": "CHANGEME"},
            {"ADMIN_PASS": "troca123"},
            {"ADMIN_PASS": "curta"},
        ],
    )
    def test_sem_senha_forte_o_admin_fica_desligado(self, app_with, env):
        _, client = app_with(**env)
        senha = env.get("ADMIN_PASS") or "changeme"
        for auth in [("gabriel", senha), ("admin", "changeme"), ("admin", "")]:
            assert client.get(ADMIN_URL, auth=auth).status_code == 503

    def test_sem_senha_o_resto_do_site_continua_funcionando(self, app_with):
        _, client = app_with(ADMIN_PASS=None)
        assert client.get("/api/health").status_code == 200
        assert client.post("/api/track", json={"path": "/"}).status_code == 204

    def test_senha_forte_libera_o_admin(self, app_with):
        _, client = app_with(ADMIN_USER="gabriel", ADMIN_PASS="uma-senha-bem-forte")
        assert client.get(ADMIN_URL, auth=("gabriel", "uma-senha-bem-forte")).status_code == 200

    def test_sem_sal_configurado_usa_um_aleatorio(self, app_with):
        module, _ = app_with(VISITOR_SALT=None)
        assert len(module.VISITOR_SALT) == 32
        assert module.VISITOR_SALT != "groger-salt"


class TestForcaBrutaNoLogin:
    def test_bloqueia_o_ip_depois_de_10_senhas_erradas(self, client, admin_auth):
        for _ in range(10):
            assert client.get(ADMIN_URL, auth=("gabriel", "errada"), headers=ip(1)).status_code == 401

        r = client.get(ADMIN_URL, auth=("gabriel", "errada"), headers=ip(1))
        assert r.status_code == 429
        assert int(r.headers["retry-after"]) > 0

    def test_bloqueado_nem_a_senha_certa_entra(self, client, admin_auth):
        for _ in range(10):
            client.get(ADMIN_URL, auth=("gabriel", "errada"), headers=ip(1))
        assert client.get(ADMIN_URL, auth=admin_auth, headers=ip(1)).status_code == 429

    def test_bloquear_um_ip_nao_bloqueia_outro(self, client, admin_auth):
        for _ in range(10):
            client.get(ADMIN_URL, auth=("gabriel", "errada"), headers=ip(1))
        assert client.get(ADMIN_URL, auth=admin_auth, headers=ip(2)).status_code == 200

    def test_logins_certos_nao_contam_como_tentativa(self, client, admin_auth):
        for _ in range(30):
            assert client.get(ADMIN_URL, auth=admin_auth, headers=ip(1)).status_code == 200

    def test_o_bloqueio_acaba_depois_da_janela(self, main_module):
        limiter = main_module.RateLimiter(limit=2, window_seconds=60)
        limiter.add("x", now=0)
        limiter.add("x", now=1)
        assert limiter.blocked("x", now=2)
        assert not limiter.blocked("x", now=61.5)


class TestLimiteNoRastreamento:
    def test_ate_60_por_minuto_passa_e_o_resto_e_recusado(self, client, rows):
        for _ in range(60):
            assert client.post("/api/track", json={"path": "/"}, headers=ip(1)).status_code == 204
        assert client.post("/api/track", json={"path": "/"}, headers=ip(1)).status_code == 429
        assert len(rows("pageviews")) == 60

    def test_eventos_contam_no_mesmo_limite(self, client):
        for _ in range(60):
            client.post("/api/track/event", json={"name": "x"}, headers=ip(1))
        assert client.post("/api/track", json={"path": "/"}, headers=ip(1)).status_code == 429

    def test_cada_ip_tem_seu_limite(self, client):
        for _ in range(60):
            client.post("/api/track", json={"path": "/"}, headers=ip(1))
        assert client.post("/api/track", json={"path": "/"}, headers=ip(2)).status_code == 204

    def test_o_limitador_nao_cresce_sem_fim(self, main_module):
        limiter = main_module.RateLimiter(limit=1, window_seconds=60, max_keys=100)
        for i in range(1000):
            limiter.allow(f"ip-{i}", now=0)
        assert len(limiter._hits) <= 100


class TestTamanhoDaRequisicao:
    def test_corpo_grande_com_content_length_e_recusado(self, client, rows):
        r = client.post(
            "/api/track",
            content=b'{"path":"/","referrer":"' + b"a" * 20_000 + b'"}',
            headers={"content-type": "application/json"},
        )
        assert r.status_code == 413
        assert rows("pageviews") == []

    def test_corpo_grande_sem_content_length_tambem_e_recusado(self, client, rows):
        def pedacos():
            yield b'{"path":"/","x":"'
            for _ in range(40):
                yield b"a" * 1000
            yield b'"}'

        r = client.post("/api/track/event", content=pedacos(), headers={"content-type": "application/json"})
        assert r.status_code == 413
        assert rows("events") == []

    def test_content_length_invalido_e_recusado(self, client):
        r = client.post("/api/track", content=b"{}", headers={"content-length": "abc", "content-type": "application/json"})
        assert r.status_code in (400, 413)

    def test_corpo_normal_passa(self, client):
        assert client.post("/api/track", json={"path": "/", "referrer": "https://x.com/"}).status_code == 204


class TestDadosPessoaisNaoSaoGuardados:
    @pytest.mark.parametrize(
        "entrada, esperado",
        [
            ("https://www.linkedin.com/feed/?trk=abc", "https://www.linkedin.com/feed/"),
            ("https://site.com/p?email=a@b.com#secao", "https://site.com/p"),
            ("https://usuario:senha@site.com/p", "https://site.com/p"),
            ("https://SITE.com:8443/a", "https://site.com:8443/a"),
            ("https://linkedin.com", "https://linkedin.com"),
            ("javascript:alert(1)", None),
            ("ftp://site.com/arquivo", None),
            ("/so-um-caminho", None),
            ("http://[::1", None),
            ("", None),
            (None, None),
        ],
    )
    def test_limpa_o_referrer(self, main_module, entrada, esperado):
        assert main_module.clean_referrer(entrada) == esperado

    @pytest.mark.parametrize(
        "entrada, esperado",
        [("/", "/"), ("/admin?token=123", "/admin"), ("/a#b", "/a"), ("sem-barra", "/sem-barra")],
    )
    def test_limpa_o_caminho(self, main_module, entrada, esperado):
        assert main_module.clean_path(entrada) == esperado

    def test_o_que_e_gravado_ja_vem_limpo(self, client, rows):
        client.post(
            "/api/track",
            json={"path": "/?email=a@b.com", "referrer": "https://u:p@site.com/x?cpf=123#y"},
            headers=ip(1),
        )
        [row] = rows("pageviews")
        assert row["path"] == "/"
        assert row["referrer"] == "https://site.com/x"


class TestRetencao:
    def test_apaga_visitas_e_eventos_mais_antigos_que_o_prazo(self, main_module, seed, rows):
        agora = datetime.now(timezone.utc)
        seed.pageview(agora - timedelta(days=400), path="/velho")
        seed.pageview(agora - timedelta(days=10), path="/novo")
        seed.event("velho", at=(agora - timedelta(days=400)).isoformat(timespec="seconds"))
        seed.event("novo")

        main_module.prune_old_rows()

        assert [r["path"] for r in rows("pageviews")] == ["/novo"]
        assert [r["name"] for r in rows("events")] == ["novo"]

    def test_o_painel_ja_mostra_sem_os_antigos(self, client, admin_auth, seed):
        agora = datetime.now(timezone.utc)
        seed.pageview(agora - timedelta(days=400))
        seed.pageview(agora)
        assert client.get(ADMIN_URL, auth=admin_auth).json()["totals"]["views"] == 1
