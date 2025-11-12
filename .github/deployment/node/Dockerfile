# ==============================
#  Stage 1 — Builder
# ==============================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Dependencias base del sistema (git, openssl, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates git python3 build-essential && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && yarn set version stable

# Copiamos todo el monorepo
COPY . ./

# Instalamos dependencias y build del backend
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false
RUN yarn install --no-immutable
RUN yarn workspace @affine/server build

# ==============================
#  Stage 2 — Runtime
# ==============================
FROM node:22-bookworm-slim

WORKDIR /app

# Dependencias del runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libjemalloc2 openssl ca-certificates python3 build-essential && \
    rm -rf /var/lib/apt/lists/*

ENV LD_PRELOAD=libjemalloc.so.2
ENV NODE_ENV=production

# Copiamos los artefactos
COPY --from=builder /app /app

# 🔧 Reconstruimos los binarios nativos (Prisma / SQLite / etc.)
RUN yarn workspace @affine/server run postinstall || true

# Iniciamos el servidor
CMD ["node", "packages/backend/server/dist/main.js"]
