#!/bin/sh
set -e

# Login explicito via Universal Auth, capturando o token.
# --silent suprime mensagens; --plain faz sair so o token.
# NAO usamos --domain: o default ja e a cloud US (app.infisical.com),
# e passar --domain dispara bugs conhecidos de parse de dominio.
echo "Autenticando no Infisical..."
INFISICAL_TOKEN=$(npx infisical login \
  --method=universal-auth \
  --client-id="$INFISICAL_UNIVERSAL_AUTH_CLIENT_ID" \
  --client-secret="$INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET" \
  --silent --plain)
export INFISICAL_TOKEN

echo "Aplicando migrations com segredos do Infisical..."
npx infisical run \
  --token="$INFISICAL_TOKEN" \
  --projectId="$INFISICAL_PROJECT_ID" \
  --env=prod \
  -- npx prisma migrate deploy

echo "Iniciando microsservico..."
exec npx infisical run \
  --token="$INFISICAL_TOKEN" \
  --projectId="$INFISICAL_PROJECT_ID" \
  --env=prod \
  -- node src/index.js