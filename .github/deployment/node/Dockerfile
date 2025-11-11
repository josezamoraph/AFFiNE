# ---------- Build stage ----------
FROM node:22-bookworm-slim AS builder

WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
# Habilita Yarn moderno (Berry)
RUN corepack enable

# Copiamos archivos de Yarn Berry y el monorepo necesarios
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
COPY packages/ packages/

# Instalamos dependencias enfocando el workspace del servidor
# (evita instalar todo el monorepo)
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false
RUN yarn workspaces focus @affine/server

# Compilamos el servidor (genera packages/backend/server/dist)
RUN yarn workspace @affine/server build

# ---------- Runtime stage ----------
FROM node:22-bookworm-slim

# Opcional: jemalloc como tenías
RUN apt-get update && apt-get install -y --no-install-recommends libjemalloc2 openssl ca-certificates && rm -rf /var/lib/apt/lists/*
ENV LD_PRELOAD=libjemalloc.so.2
WORKDIR /app

# Copiamos lo necesario desde el builder
# Artefactos PnP de Yarn
COPY --from=builder /app/.pnp.cjs /app/.pnp.cjs
COPY --from=builder /app/.yarn/ /app/.yarn/
COPY --from=builder /app/.yarnrc.yml /app/.yarnrc.yml
COPY --from=builder /app/yarn.lock /app/yarn.lock

# El dist del servidor y su package.json (para "yarn node" si lo quisieras)
COPY --from=builder /app/packages/backend/server/dist ./dist
COPY --from=builder /app/packages/backend/server/package.json ./package.json

# Muy importante: decirle a Node que cargue el hook PnP
ENV NODE_OPTIONS="--require /app/.pnp.cjs"
ENV NODE_ENV=production

# Si tu build también publica los estáticos, cópialos como hacías:
# (descomenta si los necesitas)
# COPY --from=builder /app/packages/frontend/admin/dist /app/static/admin
# COPY --from=builder /app/packages/frontend/mobile/dist /app/static/mobile
# etc.

# Arranque (usa PnP)
CMD ["node", "./dist/main.js"]


CMD ["node", "./dist/main.js"]


