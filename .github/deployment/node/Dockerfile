FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  libjemalloc2 openssl ca-certificates python3 && \
  rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV LD_PRELOAD=libjemalloc.so.2

# Copia los archivos del proyecto
COPY . .

RUN corepack enable && yarn set version stable
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false
RUN yarn install --no-immutable
RUN yarn workspace @affine/server build

# 🔧 Aquí viene la clave:
# Desactivamos el backend nativo para SQLite
ENV AFFINE_BACKEND_DB=sqlite
ENV AFFINE_DB_USE_NATIVE=false
ENV AFFINE_SQLITE_WASM=true

# Iniciamos el servidor
CMD ["node", "packages/backend/server/dist/main.js"]
