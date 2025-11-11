# ---------- Build stage ----------
FROM node:22-bookworm-slim AS builder

WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN corepack enable && yarn set version stable

# Copiamos los archivos necesarios
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
COPY packages/ packages/
COPY tsconfig.json ./

# Instalamos todos los workspaces (AFFiNE usa monorepo con Yarn)
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false
RUN yarn workspaces focus --all

# Compilamos el servidor
RUN yarn workspace @affine/server build

# ---------- Runtime stage ----------
FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends libjemalloc2 openssl ca-certificates && rm -rf /var/lib/apt/lists/*
ENV LD_PRELOAD=libjemalloc.so.2
WORKDIR /app

# Copiamos artefactos del builder
COPY --from=builder /app/.pnp.cjs /app/.pnp.cjs
COPY --from=builder /app/.yarn/ /app/.yarn/
COPY --from=builder /app/.yarnrc.yml /app/.yarnrc.yml
COPY --from=builder /app/yarn.lock /app/yarn.lock

COPY --from=builder /app/packages/backend/server/dist ./dist
COPY --from=builder /app/packages/backend/server/package.json ./package.json

ENV NODE_OPTIONS="--require /app/.pnp.cjs"
ENV NODE_ENV=production

CMD ["node", "./dist/main.js"]
