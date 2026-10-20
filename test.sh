#!/usr/bin/env bash
# Roda os testes do backend (pytest) e do frontend (vitest).
# Na primeira vez cria o venv do backend e instala as dependências de teste.
set -euo pipefail
cd "$(dirname "$0")"

echo "→ backend (pytest)"
if [ ! -x backend/.venv/bin/python ]; then
  PY=$(command -v python3.13 || command -v python3.12 || command -v python3)
  "$PY" -m venv backend/.venv
  backend/.venv/bin/pip install --quiet -r backend/requirements-dev.txt
fi
(cd backend && ./.venv/bin/python -m pytest -q)

echo "→ frontend (vitest)"
if [ ! -d frontend/node_modules ]; then
  (cd frontend && npm install --no-audit --no-fund)
fi
(cd frontend && npm test --silent)

echo "✔ todos os testes passaram"
