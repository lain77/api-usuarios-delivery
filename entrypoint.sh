#!/bin/sh
set -e
echo "Aplicando migrations..."
npx prisma migrate deploy
echo "Iniciando microsserviço..."
exec node src/index.js
