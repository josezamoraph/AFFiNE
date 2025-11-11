# ===== Build stage =====
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Instala dependencias necesarias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Habilita corepack y Yarn estable
RUN corepack enable && yarn set version stable

# Copiamos todo el repositorio (necesario para workspaces)
COPY . .

# Desactiva el modo inmutable (más compatible con forks o cambios locales)
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false

# Instala dependencias del monorepo
RUN yarn install --no-immutable

# Compila el servidor de AFFiNE
RUN yarn workspace @affine/server build


# ===== Runtime stage =====
FROM node:22-bookworm-slim

WORKDIR /app

# Instala librerías básicas
RUN apt-get update && apt-get install -y --no-install-recommends libjemalloc2 openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Mejora de rendimiento
ENV LD_PRELOAD=libjemalloc.so.2

# Copiamos los archivos construidos desde el builder
COPY --from=builder /app /app

# Configuración de entorno
ENV NODE_ENV=production

# Comando de inicio
CMD ["node", "./dist/main.js"]
