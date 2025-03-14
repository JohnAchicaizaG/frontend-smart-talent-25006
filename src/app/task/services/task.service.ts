import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Task, ApiResponse } from '../interfaces/task.interface';

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
    return this.http.get<ApiResponse<Task[]>>(this.apiUrl).pipe(
      map(response => response.data ?? []) // Devuelve un array vacío si data es null
    );
  }

  /**
   * Obtiene una tarea específica por su ID.
   * @param {number} taskId - ID de la tarea a obtener.
   * @returns {Observable<Task | null>} - La tarea encontrada o null.
   */
  getTaskById(taskId: number): Observable<Task | null> {
    return this.http.get<ApiResponse<Task>>(`${this.apiUrl}/${taskId}`).pipe(
      map(response => response.data ?? null) // Devuelve null si data es undefined o null
    );
  }

  /**
   * Crea una nueva tarea en la API.
   * @param {Partial<Task>} task - Datos de la nueva tarea.
   * @returns {Observable<Task | null>} - La tarea creada o null si hay un error.
   */
  createTask(task: Partial<Task>): Observable<Task | null> {
    return this.http.post<ApiResponse<Task>>(this.apiUrl, task).pipe(
      map(response => response.data ?? null)
    );
  }

  /**
   * Actualiza una tarea existente en la API.
   * @param {Task} task - Datos actualizados de la tarea.
   * @returns {Observable<Task | null>} - La tarea actualizada o null si falla.
   */
  updateTask(task: Task): Observable<Task | null> {
    return this.http.put<ApiResponse<Task>>(`${this.apiUrl}/${task.id}`, task).pipe(
      map(response => response.data ?? null)
    );
  }

  /**
   * Elimina una tarea de la API.
   * @param {number} taskId - ID de la tarea a eliminar.
   * @returns {Observable<string>} - Mensaje de confirmación.
   */
  deleteTask(taskId: number): Observable<string> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/${taskId}`).pipe(
      map(response => response.message)
    );
  }
}
