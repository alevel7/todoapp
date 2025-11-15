import { Router, Request, Response } from 'express';
import { Database } from '../database/database';
import { CreateTodoRequest, UpdateTodoRequest } from '../models/Todo';

export class TodoRoutes {
  public router: Router;
  private db: Database;

  constructor() {
    this.router = Router();
    this.db = new Database();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', this.getAllTodos.bind(this));
    this.router.get('/:id', this.getTodoById.bind(this));
    this.router.post('/', this.createTodo.bind(this));
    this.router.put('/:id', this.updateTodo.bind(this));
    this.router.delete('/:id', this.deleteTodo.bind(this));
  }

  private async getAllTodos(req: Request, res: Response): Promise<void> {
    try {
      const todos = await this.db.getAllTodos();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  }

  private async getTodoById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const todo = await this.db.getTodoById(id);
      
      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }
      
      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch todo' });
    }
  }

  private async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, reminderDate }: CreateTodoRequest = req.body;
      
      if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }
      
      const todo = await this.db.createTodo({
        title,
        description,
        completed: false,
        reminderDate
      });
      
      res.status(201).json(todo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create todo' });
    }
  }

  private async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updates: UpdateTodoRequest = req.body;
      
      const todo = await this.db.updateTodo(id, updates);
      
      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }
      
      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update todo' });
    }
  }

  private async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.db.deleteTodo(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  }
}