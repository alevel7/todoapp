# Frontend Dockerfile - builds Angular app and serves with nginx
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build -- --output-path=dist/todo-frontend

# Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist/todo-frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
