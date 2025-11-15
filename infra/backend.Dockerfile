# syntax=docker/dockerfile:1
FROM node:20-slim AS base

WORKDIR /app

COPY package.json package-lock.json* .npmrc* ./
COPY backend/package.json backend/
COPY shared/package.json shared/
RUN npm install --omit=dev

COPY backend backend
COPY shared shared
RUN npm run build --workspace shared && npm run build --workspace backend

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/package.json ./
COPY --from=base /app/backend ./backend
COPY --from=base /app/shared ./shared
COPY --from=base /app/node_modules ./node_modules

CMD ["node", "backend/dist/index.js"]
