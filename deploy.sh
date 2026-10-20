#!/usr/bin/env bash
# Deploy do groger-site no Fly.dev.
# Pré-requisitos:
#   - `fly` CLI logada (fly auth whoami)
#   - conta Fly com cartão ativo (o trial precisa estar liberado)
#
# Uso:
#   ./deploy.sh            # primeira vez (cria app + volume + secrets)
#   ./deploy.sh redeploy   # só faz fly deploy

set -euo pipefail
APP=gabrielroger
REGION=gru

cd "$(dirname "$0")"

# Só publica se os testes passarem. Para pular: SKIP_TESTS=1 ./deploy.sh
if [ "${SKIP_TESTS:-0}" != "1" ]; then
  echo "→ rodando os testes"
  ./test.sh
fi

if [ "${1:-}" = "redeploy" ]; then
  fly deploy --app "$APP"
  exit 0
fi

echo "→ criando app $APP (se já existir, pula)"
fly apps create "$APP" --org personal 2>/dev/null || echo "  app já existe, ok."

echo "→ criando volume groger_data em $REGION (1GB)"
fly volumes create groger_data --region "$REGION" --size 1 --app "$APP" --yes 2>/dev/null || echo "  volume já existe, ok."

echo "→ alocando IPs (v4 compartilhado e v6), porque o primeiro deploy não consegue fazer isso sozinho"
fly ips allocate-v4 --shared --app "$APP" || echo "  v4 não alocado (já existe?)"
fly ips allocate-v6 --app "$APP" || echo "  v6 não alocado (já existe?)"

echo "→ definindo secrets"
ADMIN_USER=${ADMIN_USER:-gabriel}
if [ -z "${ADMIN_PASS:-}" ]; then
  # pede a senha sem mostrar na tela; nunca é impressa nem gravada em arquivo
  read -r -s -p "  senha do admin (mínimo 12 caracteres): " ADMIN_PASS
  echo
fi
if [ "${#ADMIN_PASS}" -lt 12 ]; then
  echo "  senha curta demais, abortando" >&2
  exit 1
fi
VISITOR_SALT=${VISITOR_SALT:-$(python3 -c 'import secrets;print(secrets.token_urlsafe(24))')}

fly secrets set \
  ADMIN_USER="$ADMIN_USER" \
  ADMIN_PASS="$ADMIN_PASS" \
  VISITOR_SALT="$VISITOR_SALT" \
  --app "$APP" >/dev/null
unset ADMIN_PASS VISITOR_SALT

echo "→ fly deploy"
fly deploy --app "$APP"

echo ""
echo "✔ pronto. abra: https://$APP.fly.dev"
echo "  admin:     https://$APP.fly.dev/admin (usuário: $ADMIN_USER)"
