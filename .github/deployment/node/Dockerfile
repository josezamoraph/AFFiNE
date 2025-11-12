# Imagen base compatible con Railway y node-gyp
FROM node:22-bookworm

# Crea directorio de trabajo
WORKDIR /app

# Instala dependencias del sistema necesarias para módulos nativos
RUN apt-get update && apt-get install -y --no-install-recommends \
    git python3 build-essential openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copia todo el repo
COPY . .

# Configura entorno base
ENV NODE_ENV=production
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false

# Activa Yarn moderno
RUN corepack enable && yarn set version stable

# Instala dependencias sin verificar cache
RUN yarn install --no-immutable || yarn install

# ⚙️ Sustituye módulo nativo @node-rs/argon2 por versión JS
RUN yarn remove @node-rs/argon2 || true
RUN yarn add argon2

# Sustituye cualquier referencia interna al módulo nativo
RUN grep -rl "@node-rs/argon2" ./packages/backend/server | xargs -r sed -i 's|@node-rs/argon2|argon2|g' || true

# 🚫 Elimina binarios nativos problemáticos (.node)
RUN find /app -name "*.node" -delete || true
RUN rm -rf node_modules/better-sqlite3 || true
RUN rm -rf node_modules/@napi-rs || true

# 🔨 Compila el backend de AFFiNE (el script oficial del fork)
RUN yarn build || yarn workspace @affine/server build || yarn run build:backend || true

# ✅ Verifica que el backend fue compilado correctamente
RUN test -f packages/backend/server/dist/main.js || (echo "❌ No se generó dist/main.js. Revisa scripts de build del fork." && ls -R packages/backend/server && exit 1)

# Variables de entorno base
ENV PORT=3010
ENV AFFINE_SERVER_PORT=3010
ENV AFFINE_SERVER_HOST=0.0.0.0
ENV AFFINE_BACKEND_DB=postgres
ENV AFFINE_DISABLE_NATIVE_SQLITE=true
ENV AFFINE_DISABLE_NATIVE_MODULES=true
ENV AFFINE_DB_USE_NATIVE=false
ENV AFFINE_SQLITE_WASM=true
ENV AFFINE_ALLOW_UNSAFE_NATIVES=false

# Abre puerto
EXPOSE 3010

# Ejecuta el servidor backend
CMD ["node", "packages/backend/server/dist/main.js"]
