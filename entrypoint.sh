#!/bin/sh
set -e

# A CLI do Infisical lê automaticamente as credenciais destas variáveis de ambiente:
#   INFISICAL_UNIVERSAL_AUTH_CLIENT_ID
#   INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET
# (injetadas pelo docker-compose a partir do .env, que NÃO é commitado)
# Por isso não é necessário um "infisical login" separado.

echo "Aplicando migrations com segredos do Infisical..."
infisical run \
  --projectId="$INFISICAL_PROJECT_ID" \
  --env=prod \
  -- npx prisma migrate deploy

echo "Iniciando microsserviço..."
exec infisical run \
  --projectId="$INFISICAL_PROJECT_ID" \
  --env=prod \
  -- node src/index.js
