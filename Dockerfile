# Build stage — compile frontend assets
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY server.ts tsconfig.json config.json ./
COPY types ./types

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.ts"]
