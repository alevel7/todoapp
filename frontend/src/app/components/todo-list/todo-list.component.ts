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
  newTodoReminderDate: string = '';
  editingTodo: Todo | null = null;
  loading: boolean = false;
  sortOrder: 'date-asc' | 'date-desc' = 'date-asc';

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.setDefaultReminderDate();
    this.loadTodos();
  }

  setDefaultReminderDate(): void {
    const now = new Date();
    // Format: YYYY-MM-DDTHH:MM (datetime-local input format)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.newTodoReminderDate = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  isToday(dateString?: string): boolean {
    if (!dateString) return false;
    const todoDate = new Date(dateString);
    const today = new Date();
    return todoDate.getFullYear() === today.getFullYear() &&
           todoDate.getMonth() === today.getMonth() &&
           todoDate.getDate() === today.getDate();
  }

  loadTodos(): void {
    this.loading = true;
    this.todoService.getAllTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.sortTodos();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.loading = false;
      }
    });
  }

  sortTodos(): void {
    this.todos.sort((a, b) => {
      const dateA = a.reminderDate ? new Date(a.reminderDate).getTime() : 0;
      const dateB = b.reminderDate ? new Date(b.reminderDate).getTime() : 0;
      
      if (this.sortOrder === 'date-asc') {
        // Todos without dates go to the end
        if (!a.reminderDate && b.reminderDate) return 1;
        if (a.reminderDate && !b.reminderDate) return -1;
        return dateA - dateB;
      } else {
        // Todos without dates go to the end
        if (!a.reminderDate && b.reminderDate) return 1;
        if (a.reminderDate && !b.reminderDate) return -1;
        return dateB - dateA;
      }
    });
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'date-asc' ? 'date-desc' : 'date-asc';
    this.sortTodos();
  }

  addTodo(): void {
    if (!this.newTodoTitle.trim()) return;

    const newTodo = {
      title: this.newTodoTitle,
      description: this.newTodoDescription,
      reminderDate: this.newTodoReminderDate
    };

    this.todoService.createTodo(newTodo).subscribe({
      next: (todo) => {
        this.todos.push(todo);
        this.sortTodos();
        this.newTodoTitle = '';
        this.newTodoDescription = '';
        this.setDefaultReminderDate();
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
      description: this.editingTodo.description,
      reminderDate: this.editingTodo.reminderDate
    };

    this.todoService.updateTodo(this.editingTodo.id!, updates).subscribe({
      next: (updatedTodo) => {
        const index = this.todos.findIndex(t => t.id === updatedTodo.id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
          this.sortTodos();
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