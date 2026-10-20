# groger-site

Site pessoal one-page do Gabriel Roger, tech lead, cientista e engenheiro de dados.

Front em React, Vite, TypeScript, Framer Motion e TailwindCSS. Back em FastAPI com SQLite. Tudo roda num container único no Fly.dev. As ilustrações são SVGs animados com Framer Motion.

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

## Build de produção (Docker)

```bash
docker build -t groger-site .
docker run -p 8000:8000 -e ADMIN_PASS=troca -v $(pwd)/data:/data groger-site
```

## Deploy no Fly.dev

```bash
./deploy.sh            # primeira vez: cria o app, o volume e os secrets, e faz o deploy
./deploy.sh redeploy   # só o fly deploy
```

A configuração está em [fly.toml](fly.toml) e no [Dockerfile](Dockerfile). O SQLite fica num volume persistente montado em `/data`.

## Estrutura

```
groger-site/
├── frontend/            # Vite + React + TS + Tailwind + Framer Motion
│   ├── src/
│   │   ├── App.tsx
│   │   ├── data.ts      # todo o conteúdo: áreas, projetos, trajetória e ferramentas
│   │   ├── components/  # Hero, About, Numbers, Expertise, TechStack, Timeline, Projects, Contact, Admin e ilustrações
│   │   └── lib/track.ts # envio de pageviews e eventos
│   └── ...
├── backend/
│   ├── main.py          # FastAPI + SQLite (pageviews, eventos e admin)
│   └── requirements.txt
├── Dockerfile           # multi-stage: build do front em node, serve em python
├── fly.toml
└── deploy.sh
```
