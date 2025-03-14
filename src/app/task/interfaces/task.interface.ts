/**
 * Interfaz que representa una tarea.
 */
export interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt?: string;
}

/**
 * Enum para los filtros de tareas.
 */
export enum TaskFilter {
  All = 'all',
  Completed = 'completed',
  Pending = 'pending'
}

/**
 * Modelo genérico para estructurar las respuestas de la API.
 * `data` ahora puede ser `T` o `null` en caso de error o ausencia de datos.
 * @template T - Tipo de datos que se devolverán en `data`.
 */
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T | null;
}
