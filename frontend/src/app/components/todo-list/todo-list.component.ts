import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle: string = '';
  newTodoDescription: string = '';
  editingTodo: Todo | null = null;
  loading: boolean = false;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    this.todoService.getAllTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.loading = false;
      }
    });
  }

  addTodo(): void {
    if (!this.newTodoTitle.trim()) return;

    const newTodo = {
      title: this.newTodoTitle,
      description: this.newTodoDescription
    };

    this.todoService.createTodo(newTodo).subscribe({
      next: (todo) => {
        this.todos.unshift(todo);
        this.newTodoTitle = '';
        this.newTodoDescription = '';
      },
      error: (error) => {
        console.error('Error creating todo:', error);
      }
    });
  }

  toggleComplete(todo: Todo): void {
    this.todoService.toggleComplete(todo).subscribe({
      next: (updatedTodo) => {
        const index = this.todos.findIndex(t => t.id === updatedTodo.id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
        }
      },
      error: (error) => {
        console.error('Error updating todo:', error);
      }
    });
  }

  startEdit(todo: Todo): void {
    this.editingTodo = { ...todo };
  }

  cancelEdit(): void {
    this.editingTodo = null;
  }

  saveEdit(): void {
    if (!this.editingTodo || !this.editingTodo.title.trim()) return;

    const updates = {
      title: this.editingTodo.title,
      description: this.editingTodo.description
    };

    this.todoService.updateTodo(this.editingTodo.id!, updates).subscribe({
      next: (updatedTodo) => {
        const index = this.todos.findIndex(t => t.id === updatedTodo.id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
        }
        this.editingTodo = null;
      },
      error: (error) => {
        console.error('Error updating todo:', error);
      }
    });
  }

  deleteTodo(todo: Todo): void {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    this.todoService.deleteTodo(todo.id!).subscribe({
      next: () => {
        this.todos = this.todos.filter(t => t.id !== todo.id);
      },
      error: (error) => {
        console.error('Error deleting todo:', error);
      }
    });
  }
}