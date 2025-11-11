# ===== Build stage =====
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Instala dependencias básicas
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Habilita corepack y configura Yarn
RUN corepack enable && yarn set version stable

# Copiamos todo el proyecto (no solo packages)
COPY . .

# Desactiva el modo inmutable (útil para forks o repos no 100% bloqueados)
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false

# Instala dependencias del monorepo
RUN yarn install --no-immutable

# Compila el servidor de AFFiNE
RUN yarn workspace @affine/server build


# ===== Runtime stage =====
FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends libjemalloc2 openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV LD_PRELOAD=libjemalloc.so.2

# Copiamos artefactos del builder
COPY --from=builder /app /app

# Variables de entorno
ENV NODE_OPTIONS="--require /app/.pnp.cjs"
ENV NODE_ENV=production

# Comando de inicio
CMD ["node", "./dist/main.js"]
