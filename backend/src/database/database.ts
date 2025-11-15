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
        reminderDate DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Database initialized successfully');
        // Add reminderDate column if it doesn't exist (migration)
        this.addReminderDateColumn();
      }
    });
  }

  private addReminderDateColumn(): void {
    // Check if reminderDate column exists, if not add it
    this.db.all("PRAGMA table_info(todos)", (err, rows: any[]) => {
      if (err) {
        console.error('Error checking table schema:', err);
        return;
      }
      
      const hasReminderDate = rows.some(row => row.name === 'reminderDate');
      
      if (!hasReminderDate) {
        this.db.run('ALTER TABLE todos ADD COLUMN reminderDate DATETIME', (err) => {
          if (err) {
            console.error('Error adding reminderDate column:', err);
          } else {
            console.log('Added reminderDate column to todos table');
          }
        });
      }
    });
  }

  getAllTodos(): Promise<Todo[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM todos ORDER BY reminderDate ASC, createdAt DESC', (err, rows) => {
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
      const { title, description, completed, reminderDate } = todo;
      const query = 'INSERT INTO todos (title, description, completed, reminderDate) VALUES (?, ?, ?, ?)';
      
      this.db.run(query, [title, description, completed, reminderDate], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            title,
            description,
            completed,
            reminderDate,
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
      if (updates.reminderDate !== undefined) {
        fields.push('reminderDate = ?');
        values.push(updates.reminderDate);
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