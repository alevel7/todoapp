import sqlite3 from 'sqlite3';
import { Todo } from '../models/Todo';

export class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('./todos.db');
    this.init();
  }

  private init(): void {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Database initialized successfully');
      }
    });
  }

  getAllTodos(): Promise<Todo[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM todos ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Todo[]);
        }
      });
    });
  }

  getTodoById(id: number): Promise<Todo | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as Todo || null);
        }
      });
    });
  }

  createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    return new Promise((resolve, reject) => {
      const { title, description, completed } = todo;
      const query = 'INSERT INTO todos (title, description, completed) VALUES (?, ?, ?)';
      
      this.db.run(query, [title, description, completed], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            title,
            description,
            completed,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      });
    });
  }

  updateTodo(id: number, updates: Partial<Todo>): Promise<Todo | null> {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];
      
      if (updates.title !== undefined) {
        fields.push('title = ?');
        values.push(updates.title);
      }
      if (updates.description !== undefined) {
        fields.push('description = ?');
        values.push(updates.description);
      }
      if (updates.completed !== undefined) {
        fields.push('completed = ?');
        values.push(updates.completed);
      }
      
      fields.push('updatedAt = ?');
      values.push(new Date().toISOString());
      values.push(id);

      const query = `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`;
      
      this.db.run(query, values, (err) => {
        if (err) {
          reject(err);
        } else {
          this.getTodoById(id).then(resolve).catch(reject);
        }
      });
    });
  }

  deleteTodo(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}