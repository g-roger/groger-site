# groger-site

Site pessoal one-page do Gabriel Roger — cientista e engenheiro de dados.

Stack: **React + Vite + TypeScript + Framer Motion + TailwindCSS** no front, **FastAPI + SQLite** no back, deploy num **container único no Fly.dev**. Ilustrações e animações autorais (SVG + Framer).

## Rodar local

```bash
# terminal 1 — frontend (Vite em :5173, proxy /api → :8000)
cd frontend
npm install
npm run dev

# terminal 2 — backend
cd backend
pip install -r requirements.txt
DB_PATH=./local.db STATIC_DIR=./_none ADMIN_USER=admin ADMIN_PASS=troca \
  uvicorn main:app --reload
```

## Rotas

- `/` — one-page (hero, sobre, números, especialidades, marquee tech, stack, trajetória, projetos, contato)
- `/admin` — dashboard de métricas protegido por HTTP Basic

## Build de produção (Docker)

```bash
docker build -t groger-site .
docker run -p 8000:8000 -e ADMIN_PASS=troca -v $(pwd)/data:/data groger-site
```

## Deploy Fly.dev

```bash
./deploy.sh            # primeira vez: cria app, volume, secrets e deploya
./deploy.sh redeploy   # apenas fly deploy
```

Configuração em [fly.toml](fly.toml) e [Dockerfile](Dockerfile). Volume persistente montado em `/data` para o SQLite.

## Estrutura

```
groger-site/
├── frontend/            # Vite + React + TS + Tailwind + Framer Motion
│   ├── src/
│   │   ├── App.tsx
│   │   ├── data.ts      # conteúdo (expertises, projects, timeline, tech)
│   │   ├── components/  # Hero, About, Expertise, TechStack, Timeline, Projects, Contact, Admin, Illustrations, Spotlight, TechMarquee, Numbers
│   │   └── lib/track.ts # tracker de pageviews/eventos
│   └── ...
├── backend/
│   ├── main.py          # FastAPI + SQLite (pageviews, events, admin)
│   └── requirements.txt
├── Dockerfile           # multi-stage: node build → python serve
├── fly.toml
└── deploy.sh
```
