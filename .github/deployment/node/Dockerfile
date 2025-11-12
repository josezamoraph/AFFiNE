# ==============================
#  Stage 1 — Builder
# ==============================
FROM node:22-bookworm AS builder

WORKDIR /app

# Dependencias de compilación necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 build-essential pkg-config libsqlite3-dev ca-certificates git && \
  rm -rf /var/lib/apt/lists/*

RUN corepack enable && yarn set version stable

COPY . ./

ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false

RUN yarn install --no-immutable
RUN yarn workspace @affine/server build

# ==============================
#  Stage 2 — Runtime
# ==============================
FROM node:22-bookworm-slim

WORKDIR /app

# Dependencias mínimas de runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
  libjemalloc2 openssl ca-certificates libsqlite3-0 python3 build-essential && \
  rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV LD_PRELOAD=libjemalloc.so.2

COPY --from=builder /app /app

# 🔧 Recompila todos los módulos nativos para Linux x64
WORKDIR /app/packages/backend/server
RUN npm rebuild --build-from-source

# 🔧 Asegura que better-sqlite3 esté compilado
RUN npm rebuild better-sqlite3 --build-from-source || true

WORKDIR /app

CMD ["node", "packages/backend/server/dist/main.js"]
