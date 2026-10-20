# groger-site

Site pessoal one-page do Gabriel Roger, tech lead, cientista e engenheiro de dados.

Front em React, Vite, TypeScript, Framer Motion e TailwindCSS. Back em FastAPI com SQLite. Tudo roda num container único no Fly.dev. As ilustrações são SVGs animados com Framer Motion.

Está no ar em [gabrielroger.fly.dev](https://gabrielroger.fly.dev).

## Rodar local

```bash
# terminal 1: frontend (Vite em :5173, com proxy de /api para :8000)
cd frontend
npm install
npm run dev

# terminal 2: backend
cd backend
pip install -r requirements.txt
DB_PATH=./local.db STATIC_DIR=./_none ADMIN_USER=admin ADMIN_PASS=troca \
  uvicorn main:app --reload
```

## Rotas

- `/`: a página única (hero, sobre, números, áreas, ferramentas, trajetória, projetos e contato)
- `/admin`: dashboard de métricas de acesso, protegido por HTTP Basic

## Testes

```bash
./test.sh                              # roda tudo
cd backend && .venv/bin/python -m pytest   # só o backend (pytest + TestClient)
cd frontend && npm test                    # só o frontend (Vitest + Testing Library)
```

O `test.sh` cria o venv do backend (`backend/.venv`) e instala as dependências na primeira vez.

- **Backend** (`backend/tests`): hash do visitante, registro de acessos e eventos, login e agregações do admin, servidor do front e proteção contra path traversal.
- **Frontend** (`frontend/src/**/*.test.ts(x)`): regras dos textos e dados, rastreamento, cada seção da página, o modal das áreas, o login do admin e uma varredura da página inteira contra travessão, e-mail e telefone.

## Build de produção (Docker)

```bash
docker build -t groger-site .
docker run -p 8000:8000 -e ADMIN_PASS=troca -v $(pwd)/data:/data groger-site
```

## Deploy no Fly.dev

```bash
./deploy.sh            # primeira vez: cria o app, o volume e os secrets, e faz o deploy
./deploy.sh redeploy   # só o fly deploy
SKIP_TESTS=1 ./deploy.sh redeploy   # pula os testes (por padrão o deploy só segue se passarem)
```

A configuração está em [fly.toml](fly.toml) e no [Dockerfile](Dockerfile). O SQLite fica num volume persistente montado em `/data`.

## Estrutura

```
groger-site/
├── frontend/            # Vite + React + TS + Tailwind + Framer Motion
│   ├── src/
│   │   ├── App.tsx
│   │   ├── data.ts      # todo o conteúdo: áreas, projetos, trajetória, ferramentas e números
│   │   ├── components/  # Hero, About, Numbers, Expertise, TechStack, Timeline, Projects, Contact, Admin e ilustrações
│   │   ├── lib/track.ts # envio de pageviews e eventos
│   │   └── test/setup.ts
│   └── ...
├── backend/
│   ├── main.py          # FastAPI + SQLite (pageviews, eventos e admin)
│   ├── tests/           # pytest
│   └── requirements.txt / requirements-dev.txt
├── Dockerfile           # multi-stage: build do front em node, serve em python
├── fly.toml
├── deploy.sh
└── test.sh
```
