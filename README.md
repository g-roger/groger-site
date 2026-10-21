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

- `/`: a página única em português (hero, sobre, números, áreas, ferramentas, trajetória, projetos e contato)
- `/en`: a mesma página em inglês. O seletor PT | EN fica na barra do topo e troca sem recarregar
- `/admin`: dashboard de métricas de acesso, protegido por HTTP Basic

## Idiomas

O idioma vem da URL: `/` é português e `/en` é inglês, então cada versão tem o seu link para compartilhar. O servidor devolve o mesmo `index.html` nas duas e o front escolhe o idioma pela rota (`src/Site.tsx`).

- `src/data.ts` e `src/data.en.ts`: o conteúdo longo (áreas, projetos, trajetória, ferramentas e números), com a mesma estrutura, os mesmos itens e a mesma ordem.
- `src/strings.ts`: os textos da interface nos dois idiomas. O inglês é tipado como `typeof pt`, então esquecer uma chave não compila. `*assim*` marca um trecho em destaque.
- `src/lib/i18n.tsx`: o provider, os hooks (`useStrings`, `useContent`) e o ajuste de `<html lang>`, título e descrição.
- Os ids das seções mudam com o idioma (`#projetos` e `#projects`), e o seletor traduz o hash ao trocar.

Ao mudar um texto, mude os dois idiomas. `data.en.test.ts` e `strings.test.ts` falham se um ficar para trás ou se sobrar português na versão em inglês.

## Testes

```bash
./test.sh                              # roda tudo
cd backend && .venv/bin/python -m pytest   # só o backend (pytest + TestClient)
cd frontend && npm test                    # só o frontend (Vitest + Testing Library)
```

O `test.sh` cria o venv do backend (`backend/.venv`) e instala as dependências na primeira vez.

- **Backend** (`backend/tests`): hash do visitante, registro de acessos e eventos, login e agregações do admin, servidor do front e proteção contra path traversal.
- **Frontend** (`frontend/src/**/*.test.ts(x)`): regras dos textos e dados, rastreamento, cada seção da página, o modal das áreas, o login do admin e uma varredura da página inteira contra travessão, e-mail e telefone. A versão em inglês tem a própria varredura (sem português sobrando, nem nos rótulos de acessibilidade) e os testes da troca de idioma.

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
│   │   ├── Site.tsx     # escolhe o idioma pela rota (/ e /en)
│   │   ├── data.ts      # todo o conteúdo em português: áreas, projetos, trajetória, ferramentas e números
│   │   ├── data.en.ts   # o mesmo conteúdo em inglês
│   │   ├── strings.ts   # textos da interface nos dois idiomas
│   │   ├── components/  # Hero, About, Numbers, Expertise, TechStack, Timeline, Projects, Contact, Admin e ilustrações
│   │   ├── lib/i18n.tsx # idioma, hooks e <html lang>
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
