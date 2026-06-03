#!/bin/sh
set -e

echo "Carregando segredos do Infisical..."
export $(infisical secrets --projectId="$INFISICAL_PROJECT_ID" --env=prod --plain --silent | xargs)

echo "Aplicando migrations..."
npx prisma migrate deploy

echo "Iniciando microsserviço..."
exec node src/index.js
