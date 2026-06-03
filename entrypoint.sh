#!/bin/sh
set -e

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
