# ------------ Build stage ------------
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Paquetes útiles y limpieza
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Corepack / Yarn
RUN corepack enable && yarn set version stable

# Copiamos lo necesario del monorepo
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
COPY packages/ packages/
COPY tsconfig.json ./

# Dependencias
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false
RUN yarn install --no-immutable

# Build del servidor (@affine/server)
RUN yarn workspace @affine/server build

# ------------ Runtime stage ------------
FROM node:22-bookworm-slim

# libs y certificados
RUN apt-get update && apt-get install -y --no-install-recommends libjemalloc2 openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiamos artefactos del builder que hacen falta en runtime
# (Pnp + Yarn + raíz del repo para resolver workspaces)
COPY --from=builder /app/.yarn/ ./.yarn/
COPY --from=builder /app/.pnp.cjs /.pnp.cjs
COPY --from=builder /app/.pnp.loader.mjs /.pnp.loader.mjs
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/package.json ./package.json

# Copiamos SOLO el build del servidor
COPY --from=builder /app/packages/backend/server/dist /app/packages/backend/server/dist
COPY --from=builder /app/packages/backend/server/package.json /app/packages/backend/server/package.json

# (Opcional) Si tu runtime necesita algún archivo extra del repo raíz:
# COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Habilitamos PnP en runtime
ENV NODE_OPTIONS="--require /app/.pnp.cjs"
ENV NODE_ENV=production

# Ejecutamos el entrypoint correcto del servidor
CMD ["node", "packages/backend/server/dist/main.js"]
