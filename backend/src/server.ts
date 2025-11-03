import express from 'express';
import cors from 'cors';
import { TodoRoutes } from './routes/todoRoutes';

class Server {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    const todoRoutes = new TodoRoutes();
    this.app.use('/api/todos', todoRoutes.router);
    
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', message: 'Todo API is running' });
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

const server = new Server();
server.start();