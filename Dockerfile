# ─── Estágio de build ────────────────────────────────────────────────────────
FROM node:22-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm prune --omit=dev

# ─── Imagem final ────────────────────────────────────────────────────────────
FROM node:22-slim
WORKDIR /app

# Dependências de runtime + Infisical CLI (via npm — mais confiável)
RUN apt-get update && apt-get install -y openssl wget \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g @infisical/cli

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 9525

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:9525/health || exit 1

CMD ["./entrypoint.sh"]
