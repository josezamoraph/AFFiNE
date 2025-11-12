FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl ca-certificates python3 && \
  rm -rf /var/lib/apt/lists/*

COPY . .

# Prepara entorno
ENV NODE_ENV=production
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false
RUN corepack enable && yarn set version stable
RUN yarn install --no-immutable
RUN yarn workspace @affine/server build

# Fuerza el uso de Postgres sin SQLite nativo
ENV AFFINE_BACKEND_DB=postgres
ENV AFFINE_ALLOW_UNSAFE_NATIVES=false
ENV AFFINE_DISABLE_NATIVE_SQLITE=true
ENV AFFINE_DISABLE_NATIVE_MODULES=true
ENV AFFINE_DB_USE_NATIVE=false
ENV AFFINE_SQLITE_WASM=true
ENV PORT=3000

EXPOSE 3000
CMD ["node", "packages/backend/server/dist/main.js"]
