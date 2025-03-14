import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Task } from '../interfaces/task.interface';

/**
 * Servicio para manejar las operaciones CRUD de las tareas.
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  /** Inyección del servicio HttpClient */
  private http = inject(HttpClient);

  /** URL base de la API */
  private apiUrl = `${environment.apiUrl}/tasks`;

  /**
   * Obtiene todas las tareas desde la API.
   * @returns {Observable<Task[]>} - Lista de tareas en un Observable.
   */
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  /**
   * Obtiene una tarea específica por su ID.
   * @param {number} taskId - ID de la tarea a obtener.
   * @returns {Observable<Task>} - La tarea encontrada en un Observable.
   */
  getTaskById(taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${taskId}`);
  }

  /**
   * Crea una nueva tarea en la API.
   * @param {Partial<Task>} task - Datos de la nueva tarea.
   * @returns {Observable<Task>} - La tarea creada en un Observable.
   */
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  /**
   * Actualiza una tarea existente en la API.
   * @param {Task} task - Datos actualizados de la tarea.
   * @returns {Observable<Task>} - La tarea actualizada en un Observable.
   */
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }

  /**
   * Elimina una tarea de la API.
   * @param {number} taskId - ID de la tarea a eliminar.
   * @returns {Observable<void>} - Observable que indica la finalización de la operación.
   */
  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }
}
