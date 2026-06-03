
FROM node:22-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm prune --omit=dev

FROM node:22-slim
WORKDIR /app

RUN apt-get update && apt-get install -y openssl wget \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y curl bash \
    && curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash \
    && apt-get update && apt-get install -y infisical \
    && rm -rf /var/lib/apt/lists/*

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
