#!/bin/sh
set -e

# A CLI do Infisical le as credenciais automaticamente destas variaveis de ambiente
# (definidas no docker-compose.yml):
#   INFISICAL_UNIVERSAL_AUTH_CLIENT_ID
#   INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET
# Por isso nao e necessario "infisical login" separado.
# Usamos "npx infisical" para nao depender de instalacao global.

echo "Aplicando migrations com segredos do Infisical..."
npx infisical run \
  --projectId="$INFISICAL_PROJECT_ID" \
  --env=prod \
  -- npx prisma migrate deploy

echo "Iniciando microsservico..."
exec npx infisical run \
  --projectId="$INFISICAL_PROJECT_ID" \
  --env=prod \
  -- node src/index.js