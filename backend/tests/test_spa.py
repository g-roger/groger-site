"""Servidor do front (SPA), rotas da API que não podem ser engolidas e proteção de caminhos."""
import pytest


class TestSpa:
    def test_raiz_serve_o_index(self, client):
        r = client.get("/")
        assert r.status_code == 200
        assert "spa-index" in r.text
        assert r.headers["content-type"].startswith("text/html")

    @pytest.mark.parametrize("path", ["/admin", "/en", "/en/", "/qualquer/rota/do/front", "/api"])
    def test_rotas_do_front_caem_no_index(self, client, path):
        r = client.get(path)
        assert r.status_code == 200
        assert "spa-index" in r.text

    def test_serve_arquivo_solto_da_pasta_de_estaticos(self, client):
        r = client.get("/robots.txt")
        assert r.status_code == 200
        assert r.text == "User-agent: *"

    def test_serve_os_assets(self, client):
        r = client.get("/assets/app.js")
        assert r.status_code == 200
        assert r.text == "console.log('app')"

    def test_asset_inexistente_retorna_404(self, client):
        assert client.get("/assets/nao-existe.js").status_code == 404


class TestDocumentacaoDaApiNaoEPublica:
    @pytest.mark.parametrize("path", ["/docs", "/redoc", "/openapi.json", "/docs/oauth2-redirect"])
    def test_nao_expoe_a_documentacao(self, client, path):
        r = client.get(path)
        assert "swagger" not in r.text.lower()
        assert "redoc" not in r.text.lower()
        assert "/api/admin/metrics" not in r.text


class TestApiNaoEInterceptada:
    def test_health(self, client):
        r = client.get("/api/health")
        assert r.status_code == 200
        assert r.json() == {"status": "ok"}

    def test_rota_de_api_desconhecida_retorna_404_e_nao_o_index(self, client):
        r = client.get("/api/nao-existe")
        assert r.status_code == 404
        assert "spa-index" not in r.text

    def test_metricas_sem_login_nao_cai_no_index(self, client):
        r = client.get("/api/admin/metrics")
        assert r.status_code == 401
        assert "spa-index" not in r.text


class TestCaminhosPerigosNaoSaemDaPasta:
    @pytest.mark.parametrize(
        "path",
        [
            "/%2e%2e/segredo.txt",
            "/..%2fsegredo.txt",
            "/%2e%2e%2fsegredo.txt",
            "/assets/%2e%2e/%2e%2e/segredo.txt",
        ],
    )
    def test_nao_serve_arquivos_de_fora_da_pasta_de_estaticos(self, client, tmp_path, path):
        (tmp_path / "segredo.txt").write_text("SEGREDO-FORA-DA-PASTA")
        r = client.get(path)
        assert "SEGREDO-FORA-DA-PASTA" not in r.text

    def test_subir_ate_a_raiz_do_disco_nao_le_arquivos_do_sistema(self, client, tmp_path):
        static = (tmp_path / "static").resolve()
        subidas = "/".join(["%2e%2e"] * (len(static.parts) - 1))
        r = client.get(f"/{subidas}/etc/hosts")
        assert "localhost" not in r.text

    def test_caminho_absoluto_nao_escapa(self, client, tmp_path):
        # "//pasta/arquivo" chega ao app como "/pasta/arquivo" (absoluto). Em pathlib, juntar um
        # caminho absoluto descarta a base, então sem validação isso abre qualquer arquivo.
        (tmp_path / "segredo.txt").write_text("SEGREDO-FORA-DA-PASTA")
        r = client.get(f"/%2F{str(tmp_path).lstrip('/')}/segredo.txt")
        assert "SEGREDO-FORA-DA-PASTA" not in r.text

    def test_caminho_absoluto_nao_le_arquivos_do_sistema(self, client):
        r = client.get("/%2Fetc/hosts")
        assert "localhost" not in r.text

    def test_byte_nulo_no_caminho_nao_gera_erro_500(self, client):
        r = client.get("/%00")
        assert r.status_code == 200
        assert "spa-index" in r.text

    def test_link_simbolico_para_fora_nao_e_seguido(self, client, tmp_path):
        (tmp_path / "segredo.txt").write_text("SEGREDO-FORA-DA-PASTA")
        (tmp_path / "static" / "atalho.txt").symlink_to(tmp_path / "segredo.txt")
        r = client.get("/atalho.txt")
        assert "SEGREDO-FORA-DA-PASTA" not in r.text


class TestModoDev:
    def test_raiz_responde_com_aviso(self, dev_client):
        r = dev_client.get("/")
        assert r.status_code == 200
        assert "dev backend" in r.json()["message"]

    def test_outras_rotas_retornam_404(self, dev_client):
        assert dev_client.get("/qualquer").status_code == 404

    def test_api_continua_funcionando(self, dev_client):
        assert dev_client.get("/api/health").json() == {"status": "ok"}
        assert dev_client.post("/api/track", json={"path": "/"}).status_code == 204
