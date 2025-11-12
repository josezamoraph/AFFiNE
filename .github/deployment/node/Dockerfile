# ==============================
#  Stage 1 — Builder
# ==============================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Instala dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates git && rm -rf /var/lib/apt/lists/*

# Habilita Yarn moderno
RUN corepack enable && yarn set version stable

# Copia los archivos necesarios para resolver workspaces
COPY . ./

# Evita errores de instalación con dependencias inmutables
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false

# Instala dependencias del monorepo
RUN yarn install --no-immutable

# Compila el servidor de AFFiNE
RUN yarn workspace @affine/server build


# ==============================
#  Stage 2 — Runtime
# ==============================
FROM node:22-bookworm-slim

WORKDIR /app

# Instala librerías básicas
RUN apt-get update && apt-get install -y --no-install-recommends libjemalloc2 openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copiamos artefactos de build
COPY --from=builder /app /app

# Configuraciones de entorno
ENV NODE_ENV=production
ENV LD_PRELOAD=libjemalloc.so.2

# Arranca el servidor
CMD ["node", "packages/backend/server/dist/main.js"]
