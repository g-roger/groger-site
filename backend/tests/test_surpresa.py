"""Surpresa privada: só abre com a palavra secreta (ou com o token de um aparelho já liberado)."""
import base64

import pytest

URL = "/api/surpresa"
FOTO = b"\xff\xd8\xff\xe0 foto de teste \xff\xd9"
MENSAGEM = "mensagem de teste"


def ip(n):
    return {"fly-client-ip": f"198.51.100.{n}"}


@pytest.fixture
def surpresa(app_with, tmp_path):
    """App com a surpresa configurada: palavra 'Céu Estrelado', foto e mensagem de teste."""
    foto = tmp_path / "surpresa.jpg"
    foto.write_bytes(FOTO)
    module, client = app_with(
        SURPRISE_PHOTO=str(foto),
        SURPRISE_PASSPHRASE="Céu Estrelado",
        SURPRISE_MESSAGE=MENSAGEM,
    )
    return module, client


class TestDesligadaSemConfiguracao:
    def test_sem_palavra_secreta_responde_404(self, app_with, tmp_path):
        foto = tmp_path / "f.jpg"
        foto.write_bytes(FOTO)
        _, client = app_with(SURPRISE_PHOTO=str(foto), SURPRISE_PASSPHRASE=None, SURPRISE_MESSAGE=MENSAGEM)
        assert client.post(URL, json={"senha": ""}).status_code == 404
        assert client.post(URL, json={"senha": "qualquer"}).status_code == 404

    def test_palavra_so_de_espacos_conta_como_nao_configurada(self, app_with, tmp_path):
        foto = tmp_path / "f.jpg"
        foto.write_bytes(FOTO)
        _, client = app_with(SURPRISE_PHOTO=str(foto), SURPRISE_PASSPHRASE="   ", SURPRISE_MESSAGE=MENSAGEM)
        assert client.post(URL, json={"senha": "   "}).status_code == 404

    def test_sem_foto_responde_404(self, app_with, tmp_path):
        _, client = app_with(
            SURPRISE_PHOTO=str(tmp_path / "nao-existe.jpg"), SURPRISE_PASSPHRASE="segredo", SURPRISE_MESSAGE=MENSAGEM
        )
        assert client.post(URL, json={"senha": "segredo"}).status_code == 404

    def test_sem_mensagem_responde_404(self, app_with, tmp_path):
        foto = tmp_path / "f.jpg"
        foto.write_bytes(FOTO)
        _, client = app_with(SURPRISE_PHOTO=str(foto), SURPRISE_PASSPHRASE="segredo", SURPRISE_MESSAGE=None)
        assert client.post(URL, json={"senha": "segredo"}).status_code == 404


class TestPalavraSecreta:
    def test_palavra_certa_entrega_mensagem_foto_e_token(self, surpresa):
        _, client = surpresa
        r = client.post(URL, json={"senha": "Céu Estrelado"})
        assert r.status_code == 200
        dados = r.json()
        assert dados["mensagem"] == MENSAGEM
        assert dados["foto"] == "data:image/jpeg;base64," + base64.b64encode(FOTO).decode()
        assert len(dados["token"]) == 64
        assert r.headers["cache-control"] == "no-store"

    @pytest.mark.parametrize(
        "digitado",
        ["céu estrelado", "CEU ESTRELADO", "  Ceu   Estrelado ", "ceu estrelado", "Céu\tEstrelado"],
    )
    def test_ignora_maiusculas_acentos_e_espacos(self, surpresa, digitado):
        _, client = surpresa
        assert client.post(URL, json={"senha": digitado}).status_code == 200

    @pytest.mark.parametrize("digitado", ["", "céu", "ceu estrelad", "céu estrelado!", "estrelado céu"])
    def test_palavra_errada_responde_401_sem_dados(self, surpresa, digitado):
        _, client = surpresa
        r = client.post(URL, json={"senha": digitado})
        assert r.status_code == 401
        assert MENSAGEM not in r.text
        assert "base64" not in r.text

    def test_sem_senha_nem_token_responde_401(self, surpresa):
        _, client = surpresa
        assert client.post(URL, json={}).status_code == 401

    def test_so_aceita_post(self, surpresa):
        _, client = surpresa
        r = client.get(URL)
        assert r.status_code in (404, 405)
        assert MENSAGEM not in r.text


class TestLembrarAparelho:
    def test_token_recebido_abre_de_novo_sem_a_palavra(self, surpresa):
        _, client = surpresa
        token = client.post(URL, json={"senha": "céu estrelado"}).json()["token"]
        r = client.post(URL, json={"token": token})
        assert r.status_code == 200
        assert r.json()["mensagem"] == MENSAGEM

    def test_token_inventado_responde_401(self, surpresa):
        _, client = surpresa
        assert client.post(URL, json={"token": "a" * 64}).status_code == 401

    def test_trocar_a_palavra_esquece_os_aparelhos(self, surpresa, monkeypatch):
        module, client = surpresa
        token = client.post(URL, json={"senha": "céu estrelado"}).json()["token"]
        monkeypatch.setattr(module, "SURPRISE_PASSPHRASE", "outra palavra")
        assert client.post(URL, json={"token": token}).status_code == 401

    def test_o_token_nao_e_a_palavra(self, surpresa):
        _, client = surpresa
        token = client.post(URL, json={"senha": "céu estrelado"}).json()["token"]
        assert "estrelado" not in token.lower()


class TestForcaBruta:
    def test_bloqueia_o_ip_depois_de_8_erros(self, surpresa):
        _, client = surpresa
        for _ in range(8):
            assert client.post(URL, json={"senha": "chute"}, headers=ip(1)).status_code == 401
        r = client.post(URL, json={"senha": "céu estrelado"}, headers=ip(1))
        assert r.status_code == 429
        assert int(r.headers["retry-after"]) > 0

    def test_tokens_errados_tambem_contam(self, surpresa):
        _, client = surpresa
        for _ in range(8):
            client.post(URL, json={"token": "x"}, headers=ip(1))
        assert client.post(URL, json={"senha": "céu estrelado"}, headers=ip(1)).status_code == 429

    def test_outro_ip_continua_podendo_abrir(self, surpresa):
        _, client = surpresa
        for _ in range(8):
            client.post(URL, json={"senha": "chute"}, headers=ip(1))
        assert client.post(URL, json={"senha": "céu estrelado"}, headers=ip(2)).status_code == 200

    def test_acertos_nao_contam_como_tentativa(self, surpresa):
        _, client = surpresa
        for _ in range(20):
            assert client.post(URL, json={"senha": "céu estrelado"}, headers=ip(1)).status_code == 200


# Palavras que não podem aparecer no código público, guardadas só como SHA-256 para que
# este próprio teste não as revele.
PALAVRAS_PROIBIDAS = {
    "4081df7b72c0a9f11f5a8851a81ea552b948ef0c9de3430c51883cfbe30efeb7",
    "b1c1d73e5424eb64a8cc2d0949700541e78df8d6388441627f5dc0cbb1efbefe",
    "980045174dbdb33b054c18ffb0abe42cfd4732b38743a509f5dcd6f8e75d0137",
}


class TestNadaPessoalNoCodigo:
    def test_o_codigo_do_servidor_nao_tem_nada_da_surpresa(self):
        import hashlib
        import re
        from pathlib import Path

        codigo = (Path(__file__).resolve().parent.parent / "main.py").read_text(encoding="utf-8")
        palavras = set(re.findall(r"[a-zà-ÿ]+", codigo.lower()))
        hashes = {hashlib.sha256(p.encode()).hexdigest() for p in palavras}
        assert not hashes & PALAVRAS_PROIBIDAS
        assert not re.search(r"base64,[A-Za-z0-9+/]{100}", codigo)
