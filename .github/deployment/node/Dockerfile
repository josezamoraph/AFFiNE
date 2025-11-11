FROM node:22-bookworm-slim

# Copiamos todo el monorepo
COPY . /app
WORKDIR /app

# Instalamos dependencias del monorepo
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl libjemalloc2 && \
    rm -rf /var/lib/apt/lists/*

RUN npm ci
RUN npm run build -w @affine/server

# Preload jemalloc para rendimiento
ENV LD_PRELOAD=libjemalloc.so.2

# Arrancamos el servidor ya compilado
CMD ["node", "packages/backend/server/dist/main.js"]
