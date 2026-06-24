#!/bin/sh
set -e

# Login explicito via Universal Auth, capturando o token.
# --silent suprime mensagens; --plain faz sair so o token.
echo "Autenticando no Infisical..."
INFISICAL_TOKEN=$(npx infisical login \
  --method=universal-auth \
  --client-id="$INFISICAL_UNIVERSAL_AUTH_CLIENT_ID" \
  --client-secret="$INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET" \
  --silent --plain)
export INFISICAL_TOKEN

echo "Iniciando microsservico..."
exec npx infisical run \
  --token="$INFISICAL_TOKEN" \
  --projectId="$INFISICAL_PROJECT_ID" \
  --env=prod \
  -- node src/index.js
