# ==============================
#  Stage 1 — Builder
# ==============================
FROM node:22-bookworm AS builder

WORKDIR /app

# Instala dependencias necesarias para compilar binarios nativos
RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 build-essential pkg-config libsqlite3-dev ca-certificates git && \
  rm -rf /var/lib/apt/lists/*

RUN corepack enable && yarn set version stable

# Copiamos todo el monorepo
COPY . ./

# Desactivamos instalaciones inmutables para evitar errores con Yarn PnP
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false

# Instalamos dependencias y construimos el backend
RUN yarn install --no-immutable
RUN yarn workspace @affine/server build

# 🔧 Recompilamos explicitly better-sqlite3
RUN cd packages/backend/server && npm rebuild better-sqlite3 --build-from-source

# ==============================
#  Stage 2 — Runtime
# ==============================
FROM node:22-bookworm-slim

WORKDIR /app

# Dependencias runtime mínimas
RUN apt-get update && apt-get install -y --no-install-recommends \
  libjemalloc2 openssl ca-certificates libsqlite3-0 && \
  rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV LD_PRELOAD=libjemalloc.so.2

# Copiamos el resultado del builder
COPY --from=builder /app /app

# Iniciamos el servidor
CMD ["node", "packages/backend/server/dist/main.js"]
