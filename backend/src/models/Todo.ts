export interface Todo {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  reminderDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  reminderDate?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  reminderDate?: string;
}