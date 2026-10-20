"""Registro de acessos (/api/track) e de eventos (/api/track/event)."""
import json

import pytest

HEADERS = {
    "user-agent": "pytest-agent",
    "fly-client-ip": "198.51.100.7",
    "fly-region": "gru",
}


class TestTrack:
    def test_registra_o_acesso(self, client, rows):
        r = client.post(
            "/api/track",
            json={"path": "/", "referrer": "https://www.linkedin.com/"},
            headers=HEADERS,
        )
        assert r.status_code == 204
        assert r.content == b""

        [row] = rows("pageviews")
        assert row["path"] == "/"
        assert row["referrer"] == "https://www.linkedin.com/"
        assert row["user_agent"] == "pytest-agent"
        assert row["country"] == "gru"
        assert row["at"].endswith("+00:00")

    def test_grava_o_hash_do_visitante_e_nao_o_ip(self, client, rows):
        client.post("/api/track", json={"path": "/"}, headers=HEADERS)
        [row] = rows("pageviews")
        assert len(row["visitor_hash"]) == 32
        assert "198.51.100.7" not in [str(v) for v in row.values()]

    @pytest.mark.parametrize(
        "payload",
        [{"path": "/"}, {"path": "/", "referrer": None}, {"path": "/", "referrer": ""}],
    )
    def test_referrer_ausente_ou_vazio_vira_nulo(self, client, rows, payload):
        client.post("/api/track", json=payload, headers=HEADERS)
        [row] = rows("pageviews")
        assert row["referrer"] is None

    def test_aceita_path_no_limite_de_500(self, client, rows):
        r = client.post("/api/track", json={"path": "/" + "a" * 499}, headers=HEADERS)
        assert r.status_code == 204
        assert len(rows("pageviews")[0]["path"]) == 500

    def test_rejeita_path_acima_de_500(self, client, rows):
        r = client.post("/api/track", json={"path": "/" + "a" * 500}, headers=HEADERS)
        assert r.status_code == 422
        assert rows("pageviews") == []

    def test_rejeita_referrer_acima_de_500(self, client, rows):
        r = client.post(
            "/api/track", json={"path": "/", "referrer": "https://x.com/" + "a" * 500}, headers=HEADERS
        )
        assert r.status_code == 422
        assert rows("pageviews") == []

    def test_path_e_obrigatorio(self, client, rows):
        r = client.post("/api/track", json={}, headers=HEADERS)
        assert r.status_code == 422
        assert rows("pageviews") == []

    def test_corpo_que_nao_e_json_e_rejeitado(self, client, rows):
        r = client.post("/api/track", content="isso nao e json", headers=HEADERS)
        assert r.status_code == 422
        assert rows("pageviews") == []

    def test_user_agent_e_cortado_em_400(self, client, rows):
        client.post("/api/track", json={"path": "/"}, headers={**HEADERS, "user-agent": "u" * 600})
        assert len(rows("pageviews")[0]["user_agent"]) == 400

    def test_sem_regiao_o_pais_fica_nulo(self, client, rows):
        headers = {k: v for k, v in HEADERS.items() if k != "fly-region"}
        client.post("/api/track", json={"path": "/"}, headers=headers)
        assert rows("pageviews")[0]["country"] is None

    def test_cada_chamada_gera_uma_linha(self, client, rows):
        for caminho in ("/", "/", "/admin"):
            client.post("/api/track", json={"path": caminho}, headers=HEADERS)
        assert [r["path"] for r in rows("pageviews")] == ["/", "/", "/admin"]

    def test_so_aceita_post(self, client):
        assert client.put("/api/track", json={"path": "/"}).status_code == 405


class TestTrackEvent:
    def test_registra_o_evento_com_o_meta(self, client, rows):
        meta = {"name": "fraud-pix-model", "url": "https://github.com/g-roger/fraud-pix-model"}
        r = client.post("/api/track/event", json={"name": "project_click", "meta": meta}, headers=HEADERS)
        assert r.status_code == 204

        [row] = rows("events")
        assert row["name"] == "project_click"
        assert json.loads(row["meta"]) == meta
        assert len(row["visitor_hash"]) == 32

    def test_meta_padrao_e_um_objeto_vazio(self, client, rows):
        client.post("/api/track/event", json={"name": "expertise_open"}, headers=HEADERS)
        assert json.loads(rows("events")[0]["meta"]) == {}

    def test_nome_e_obrigatorio(self, client, rows):
        assert client.post("/api/track/event", json={"meta": {}}, headers=HEADERS).status_code == 422
        assert rows("events") == []

    def test_aceita_nome_no_limite_de_100(self, client, rows):
        r = client.post("/api/track/event", json={"name": "n" * 100}, headers=HEADERS)
        assert r.status_code == 204
        assert len(rows("events")[0]["name"]) == 100

    def test_rejeita_nome_acima_de_100(self, client, rows):
        r = client.post("/api/track/event", json={"name": "n" * 101}, headers=HEADERS)
        assert r.status_code == 422
        assert rows("events") == []

    def test_meta_que_nao_e_objeto_e_rejeitada(self, client, rows):
        r = client.post("/api/track/event", json={"name": "x", "meta": "texto"}, headers=HEADERS)
        assert r.status_code == 422
        assert rows("events") == []

    def test_meta_enorme_nunca_passa_de_2000_caracteres(self, client, rows):
        client.post("/api/track/event", json={"name": "x", "meta": {"k": "a" * 5000}}, headers=HEADERS)
        assert len(rows("events")[0]["meta"]) <= 2000

    def test_eventos_nao_entram_na_tabela_de_acessos(self, client, rows):
        client.post("/api/track/event", json={"name": "x"}, headers=HEADERS)
        assert rows("pageviews") == []
        assert len(rows("events")) == 1
