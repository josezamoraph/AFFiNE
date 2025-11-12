FROM node:22-bookworm-slim

WORKDIR /app

# Instala dependencias del sistema mínimas
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates python3 && \
    rm -rf /var/lib/apt/lists/*

# Copia el proyecto
COPY . .

# Configura entorno
ENV NODE_ENV=production
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false

# Prepara Yarn y dependencias
RUN corepack enable && yarn set version stable
RUN yarn install --no-immutable
RUN yarn workspace @affine/server build

# ⚙️ Fuerza PostgreSQL y desactiva todo lo nativo
ENV AFFINE_BACKEND_DB=postgres
ENV AFFINE_ALLOW_UNSAFE_NATIVES=false
ENV AFFINE_DISABLE_NATIVE_SQLITE=true
ENV AFFINE_DISABLE_NATIVE_MODULES=true
ENV AFFINE_DB_USE_NATIVE=false
ENV AFFINE_SQLITE_WASM=true

# 🔥 Elimina binarios nativos problemáticos antes de arrancar
RUN rm -f /app/packages/backend/server/dist/server-native.x64.node || true
RUN rm -f /app/packages/backend/server/dist/*.node || true
RUN rm -rf node_modules/better-sqlite3 || true

# Configura puerto
ENV PORT=3010
ENV AFFINE_SERVER_PORT=3010
ENV AFFINE_SERVER_HOST=0.0.0.0

EXPOSE 3010

CMD ["node", "packages/backend/server/dist/main.js"]
