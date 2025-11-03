# TodoApp (Angular + Node.js + SQLite)

This repository contains a simple Todo application with:

- Frontend: Angular (compiled and served by nginx in Docker)
- Backend: Node.js + TypeScript + Express
- Database: SQLite (file-based)

## Docker (recommended)

The repository includes Dockerfiles for both frontend and backend and a `docker-compose.yml` to run them together.

### Build and run

From the project root (`todoapp`) run:

```bash
# Build images and start containers in background
docker-compose up --build -d

# Check container status
docker-compose ps

# Show recent logs (backend/frontend)
docker-compose logs --tail 200 backend
docker-compose logs --tail 200 frontend

# Stop and remove containers
docker-compose down
```

The frontend will be available at: http://localhost:4200
The backend API will be available at: http://localhost:3000

### Important note about volumes and native modules

Do NOT mount the entire `backend/` folder into the backend container (for example with `- ./backend:/app`) when running the container. If you do, host-installed `node_modules` (built for macOS/host architecture) will replace the container's `node_modules` and any native binaries (like sqlite3) will be incompatible inside the Linux container — causing errors such as `invalid ELF header`.

This project intentionally mounts only the SQLite DB file (`./backend/todos.db:/app/todos.db`) for persistence. If you need to develop inside the container, prefer using remote container workflows or rebuild the image after installing modules inside the container.

## Local development without Docker

- Backend:
  ```bash
  cd backend
  npm install
  npm run dev   # runs ts-node server for development
  ```

- Frontend:
  ```bash
  cd frontend
  npm install
  npx ng serve
  ```

## Troubleshooting

- If the backend fails to start with errors about sqlite3 or native modules, ensure you are not mounting host `node_modules` into the container.
- If you change Node version, rebuild the backend image so native modules are compiled for that runtime.

## Files added for Docker

- `frontend/Dockerfile`, `frontend/.dockerignore`
- `backend/Dockerfile`, `backend/.dockerignore`
- `docker-compose.yml`

