FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build -w @affine/server

FROM node:22-bookworm-slim
WORKDIR /app
COPY --from=builder /app/packages/backend/server/dist ./dist
COPY --from=builder /app/packages/backend/server/package.json .
RUN apt-get update && apt-get install -y --no-install-recommends openssl libjemalloc2 && rm -rf /var/lib/apt/lists/*
RUN npm ci --omit=dev

ENV LD_PRELOAD=libjemalloc.so.2
CMD ["node", "./dist/main.js"]

