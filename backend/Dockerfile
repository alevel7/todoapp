# Backend Dockerfile - build TypeScript backend and run with Node
FROM node:20-bullseye-slim AS build
WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json* tsconfig.json ./
RUN npm ci --silent

# Copy source, build TypeScript
COPY src ./src
COPY tsconfig.json ./tsconfig.json
RUN npm run build

FROM node:20-bullseye-slim
WORKDIR /app

# Only production deps in runtime image
COPY package.json package-lock.json* ./
RUN npm ci --production --silent

# Copy built files
COPY --from=build /app/dist ./dist

# Persist or use the sqlite database file from the project (optional)
VOLUME ["/app/data"]
WORKDIR /app

EXPOSE 3000
CMD ["node", "dist/server.js"]
