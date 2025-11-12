FROM node:22-bookworm-slim

WORKDIR /app

# Dependencias mínimas del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates python3 && \
    rm -rf /var/lib/apt/lists/*

# Copia todo el proyecto
COPY . .

# Configuración base
ENV NODE_ENV=production
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false

# Instala dependencias
RUN corepack enable && yarn set version stable
RUN yarn install --no-immutable
RUN yarn workspace @affine/server build

# 🚫 Elimina binarios nativos de SQLite (causan crash en Railway)
RUN rm -f /app/packages/backend/server/dist/server-native*.node || true
RUN rm -rf /app/packages/backend/server/dist/*.node || true
RUN rm -rf node_modules/better-sqlite3 || true
RUN find /app -name "*.node" -delete || true

# 🔒 Configura para usar solo Postgres
ENV AFFINE_BACKEND_DB=postgres
ENV AFFINE_DISABLE_NATIVE_SQLITE=true
ENV AFFINE_DISABLE_NATIVE_MODULES=true
ENV AFFINE_DB_USE_NATIVE=false
ENV AFFINE_SQLITE_WASM=true
ENV AFFINE_ALLOW_UNSAFE_NATIVES=false

# Variables del servidor
ENV PORT=3010
ENV AFFINE_SERVER_PORT=3010
ENV AFFINE_SERVER_HOST=0.0.0.0

EXPOSE 3010

CMD ["node", "packages/backend/server/dist/main.js"]
