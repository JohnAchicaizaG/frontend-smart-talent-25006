import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Task } from '../interfaces/task.interface';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tasks`;


  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      map(tasks => tasks.map(task => ({
        ...task,
        completed: task.isCompleted
      })))
    );
  }


  getTaskById(taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${taskId}`).pipe(
      map(task => ({
        ...task,
        completed: task.isCompleted
      }))
    );
  }


  createTask(task: Partial<Task>): Observable<Task> {
    const mappedTask = { ...task, isCompleted: task.isCompleted };
    return this.http.post<Task>(this.apiUrl, mappedTask).pipe(
      map(task => ({
        ...task,
        completed: task.isCompleted
      }))
    );
  }


  updateTask(task: Task): Observable<Task> {
    const mappedTask = { ...task, isCompleted: task.isCompleted };
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, mappedTask).pipe(
      map(task => ({
        ...task,
        completed: task.isCompleted
      }))
    );
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }
}
