# Imagen base estable (compatible con Railway y Node 22)
FROM node:22-bookworm-slim

# Directorio de trabajo
WORKDIR /app

# Instala dependencias del sistema necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates python3 build-essential git \
    && rm -rf /var/lib/apt/lists/*

# Copia todo el contenido del repositorio
COPY . .

# Configura entorno base
ENV NODE_ENV=production
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false

# Activa corepack (para Yarn moderno)
RUN corepack enable && yarn set version stable

# Instala dependencias
RUN yarn install --no-immutable

# ⚙️ Sustituye el módulo nativo @node-rs/argon2 por versión JS
RUN yarn remove @node-rs/argon2 || true
RUN yarn add argon2

# Sustituye referencias de @node-rs/argon2 por argon2 (compatible con BusyBox sed)
RUN grep -rl "@node-rs/argon2" ./packages/backend/server | xargs -r sed -i 's|@node-rs/argon2|argon2|g' || true

# 🚫 Elimina binarios nativos de SQLite y módulos innecesarios
RUN rm -f /app/packages/backend/server/dist/server-native*.node || true
RUN rm -rf /app/packages/backend/server/dist/*.node || true
RUN rm -rf node_modules/better-sqlite3 || true
RUN find /app -name "*.node" -delete || true

# 🔨 Compila el backend de AFFiNE
RUN yarn workspace @affine/server build

# 🔧 Variables por defecto (Railway las sobreescribirá)
ENV PORT=3010
ENV AFFINE_SERVER_PORT=3010
ENV AFFINE_SERVER_HOST=0.0.0.0
ENV AFFINE_BACKEND_DB=postgres
ENV AFFINE_DISABLE_NATIVE_SQLITE=true
ENV AFFINE_DISABLE_NATIVE_MODULES=true
ENV AFFINE_DB_USE_NATIVE=false
ENV AFFINE_SQLITE_WASM=true
ENV AFFINE_ALLOW_UNSAFE_NATIVES=false

# Abre el puerto
EXPOSE 3010

# Comando final
CMD ["node", "packages/backend/server/dist/main.js"]
