FROM node:22-bookworm-slim

# Copiamos solo el backend y creamos carpetas vacías para evitar errores
COPY ./apps/backend /app
RUN mkdir -p /app/static /app/static/admin /app/static/mobile
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl libjemalloc2 && \
    rm -rf /var/lib/apt/lists/*

# Enable jemalloc by preloading the library
ENV LD_PRELOAD=libjemalloc.so.2

CMD ["node", "./dist/main.js"]
