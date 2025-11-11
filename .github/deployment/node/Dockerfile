# --- Build stage ---
FROM node:22-bookworm-slim AS builder

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y --no-install-recommends openssl libjemalloc2 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar todo el monorepo
COPY . .

# Instalar Yarn 3 globalmente
RUN corepack enable && corepack prepare yarn@3.6.4 --activate

# Instalar dependencias (usando el lockfile de Yarn workspaces)
RUN yarn install --immutable

# Compilar solo el backend
RUN yarn workspace @affine/server build

# --- Runtime stage ---
FROM node:22-bookworm-slim
WORKDIR /app

# Copiamos solo lo necesario del backend compilado
COPY --from=builder /app/packages/backend/server/dist ./dist
COPY --from=builder /app/packages/backend/server/package.json .

RUN apt-get update && apt-get install -y --no-install-recommends openssl libjemalloc2 && rm -rf /var/lib/apt/lists/*

ENV LD_PRELOAD=libjemalloc.so.2

CMD ["node", "./dist/main.js"]


