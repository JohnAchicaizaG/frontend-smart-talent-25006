import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../interfaces/task.interface';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [
    { id: 1, title: 'Aprender Angular', completed: false },
    { id: 2, title: 'Configurar NgRx con Signals', completed: true },
    { id: 3, title: 'Implementar modo oscuro', completed: false }
  ];

  getAllTasks(): Observable<Task[]> {
    return of(this.tasks); // ✅ Retorna tareas simuladas
  }

  getTaskById(taskId: number): Observable<Task> {
    const task = this.tasks.find(t => t.id === taskId);
    return of(task!); // ✅ Simulación de obtener una tarea específica
  }

  createTask(task: Partial<Task>): Observable<Task> {
    const newTask: Task = { id: Date.now(), title: task.title || 'Nueva tarea', completed: false };
    this.tasks.push(newTask);
    return of(newTask);
  }

  updateTask(task: Task): Observable<Task> {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = { ...task };
    }
    return of(task);
  }

  deleteTask(taskId: number): Observable<void> {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    return of(undefined);
  }
}
