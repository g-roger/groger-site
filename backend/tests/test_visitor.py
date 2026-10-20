"""Hash do visitante e origem do acesso.

O hash é a única identificação que o site guarda de quem visita, então estes testes
cobrem as propriedades que importam: é estável no mesmo dia, muda de um dia para o outro,
depende do sal e nunca carrega o IP.
"""
from datetime import datetime, timezone

import pytest
from starlette.requests import Request


def make_request(headers=None, client=("203.0.113.9", 5000)):
    raw = [(k.lower().encode(), v.encode()) for k, v in (headers or {}).items()]
    scope = {
        "type": "http",
        "method": "POST",
        "path": "/api/track",
        "headers": raw,
        "client": client,
    }
    return Request(scope)


def freeze_now(monkeypatch, main_module, when):
    class Frozen(datetime):
        @classmethod
        def now(cls, tz=None):
            return when if tz is None else when.astimezone(tz)

    monkeypatch.setattr(main_module, "datetime", Frozen)


class TestVisitorHash:
    def test_tem_32_caracteres_hexadecimais(self, main_module):
        h = main_module.visitor_hash(make_request({"user-agent": "ua"}))
        assert len(h) == 32
        int(h, 16)

    def test_e_estavel_para_o_mesmo_visitante(self, main_module):
        req = {"fly-client-ip": "198.51.100.7", "user-agent": "ua"}
        assert main_module.visitor_hash(make_request(req)) == main_module.visitor_hash(make_request(req))

    def test_ip_diferente_gera_hash_diferente(self, main_module):
        a = main_module.visitor_hash(make_request({"fly-client-ip": "198.51.100.7", "user-agent": "ua"}))
        b = main_module.visitor_hash(make_request({"fly-client-ip": "198.51.100.8", "user-agent": "ua"}))
        assert a != b

    def test_user_agent_diferente_gera_hash_diferente(self, main_module):
        a = main_module.visitor_hash(make_request({"fly-client-ip": "198.51.100.7", "user-agent": "chrome"}))
        b = main_module.visitor_hash(make_request({"fly-client-ip": "198.51.100.7", "user-agent": "safari"}))
        assert a != b

    def test_prefere_o_ip_do_fly_ao_x_forwarded_for(self, main_module):
        so_fly = make_request({"fly-client-ip": "198.51.100.7", "user-agent": "ua"})
        ambos = make_request(
            {"fly-client-ip": "198.51.100.7", "x-forwarded-for": "10.0.0.1", "user-agent": "ua"}
        )
        so_xff = make_request({"x-forwarded-for": "10.0.0.1", "user-agent": "ua"})
        assert main_module.visitor_hash(ambos) == main_module.visitor_hash(so_fly)
        assert main_module.visitor_hash(ambos) != main_module.visitor_hash(so_xff)

    def test_usa_so_o_primeiro_ip_do_x_forwarded_for(self, main_module):
        lista = make_request({"x-forwarded-for": "10.0.0.1, 10.0.0.2", "user-agent": "ua"})
        primeiro = make_request({"fly-client-ip": "10.0.0.1", "user-agent": "ua"})
        assert main_module.visitor_hash(lista) == main_module.visitor_hash(primeiro)

    def test_sem_cabecalhos_de_ip_usa_o_ip_da_conexao(self, main_module):
        conexao = make_request({"user-agent": "ua"}, client=("192.0.2.55", 1))
        via_fly = make_request({"fly-client-ip": "192.0.2.55", "user-agent": "ua"})
        assert main_module.visitor_hash(conexao) == main_module.visitor_hash(via_fly)

    def test_sem_nenhum_ip_usa_zeros(self, main_module):
        sem_cliente = make_request({"user-agent": "ua"}, client=None)
        zeros = make_request({"fly-client-ip": "0.0.0.0", "user-agent": "ua"})
        assert main_module.visitor_hash(sem_cliente) == main_module.visitor_hash(zeros)

    def test_muda_de_um_dia_para_o_outro(self, main_module, monkeypatch):
        req = make_request({"fly-client-ip": "198.51.100.7", "user-agent": "ua"})
        freeze_now(monkeypatch, main_module, datetime(2026, 10, 20, 12, tzinfo=timezone.utc))
        dia_1 = main_module.visitor_hash(req)
        freeze_now(monkeypatch, main_module, datetime(2026, 10, 21, 12, tzinfo=timezone.utc))
        dia_2 = main_module.visitor_hash(req)
        assert dia_1 != dia_2

    def test_continua_igual_durante_o_mesmo_dia(self, main_module, monkeypatch):
        req = make_request({"fly-client-ip": "198.51.100.7", "user-agent": "ua"})
        freeze_now(monkeypatch, main_module, datetime(2026, 10, 20, 0, 1, tzinfo=timezone.utc))
        manha = main_module.visitor_hash(req)
        freeze_now(monkeypatch, main_module, datetime(2026, 10, 20, 23, 59, tzinfo=timezone.utc))
        noite = main_module.visitor_hash(req)
        assert manha == noite

    def test_depende_do_sal(self, main_module, monkeypatch):
        req = make_request({"fly-client-ip": "198.51.100.7", "user-agent": "ua"})
        antes = main_module.visitor_hash(req)
        monkeypatch.setattr(main_module, "VISITOR_SALT", "outro-sal")
        assert main_module.visitor_hash(req) != antes

    def test_nao_carrega_o_ip(self, main_module):
        h = main_module.visitor_hash(make_request({"fly-client-ip": "198.51.100.7", "user-agent": "ua"}))
        assert "198.51.100.7" not in h


class TestCountryOf:
    def test_usa_a_regiao_do_fly(self, main_module):
        assert main_module.country_of(make_request({"fly-region": "gru"})) == "gru"

    def test_a_regiao_do_fly_vem_antes_do_pais_da_cloudflare(self, main_module):
        req = make_request({"fly-region": "gru", "cf-ipcountry": "BR"})
        assert main_module.country_of(req) == "gru"

    def test_cai_no_pais_da_cloudflare(self, main_module):
        assert main_module.country_of(make_request({"cf-ipcountry": "BR"})) == "BR"

    @pytest.mark.parametrize("headers", [{}, {"fly-region": ""}, {"cf-ipcountry": ""}])
    def test_sem_origem_devolve_none(self, main_module, headers):
        assert main_module.country_of(make_request(headers)) is None
