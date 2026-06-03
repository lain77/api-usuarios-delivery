#!/bin/sh
set -e

echo "Autenticando no Infisical..."
export INFISICAL_TOKEN=$(infisical login \
  --method=universal-auth \
  --client-id="$INFISICAL_UNIVERSAL_AUTH_CLIENT_ID" \
  --client-secret="$INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET" \
  --plain --silent)

echo "Aplicando migrations com segredos do Infisical..."
infisical run \
  --projectId="$INFISICAL_PROJECT_ID" \
  --env=prod \
  --token="$INFISICAL_TOKEN" \
  -- npx prisma migrate deploy

echo "Iniciando microsserviço..."
exec infisical run \
  --projectId="$INFISICAL_PROJECT_ID" \
  --env=prod \
  --token="$INFISICAL_TOKEN" \
  -- node src/index.js
