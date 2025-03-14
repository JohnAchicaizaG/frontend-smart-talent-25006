import { inject, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, updateEntity, removeEntity } from '@ngrx/signals/entities';

import { Task, TaskFilter } from '../interfaces/task.interface';
import { TaskService } from '../services/task.service';

/**
 * Define el estado del store de tareas.
 */
interface TaskState {
  loading: boolean; // Indica si se está cargando información
  filter: TaskFilter; // Filtro aplicado a la lista de tareas
}

/**
 * Estado inicial de la tienda.
 */
const initialState: TaskState = {
  loading: false,
  filter: TaskFilter.All, // Por defecto, muestra todas las tareas
};

/**
 * Definición de la tienda de estado utilizando `@ngrx/signals`.
 */
export const TaskStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities<Task>(), // Permite manejar un conjunto de tareas
  withMethods((store) => {
    const taskService = inject(TaskService); // Inyección del servicio de tareas

    return {
      /**
       * Filtra las tareas según el estado seleccionado (todas, completadas o pendientes).
       */
      filteredTasks: computed(() => {
        const filter = store.filter();
        return store.entities().filter(task => {
          if (filter === TaskFilter.Completed) return task.isCompleted;
          if (filter === TaskFilter.Pending) return !task.isCompleted;
          return true; // Devuelve todas las tareas si el filtro es 'all'
        });
      }),

      /**
       * Carga todas las tareas desde la API y actualiza el estado.
       */
      async loadTasks() {
        patchState(store, { loading: true });
        try {
          const tasks = await firstValueFrom(taskService.getAllTasks());
          patchState(store, setAllEntities(tasks ?? []), { loading: false });
        } catch (error) {
          console.error('Error cargando tareas:', error);
          patchState(store, { loading: false });
        }
      },

      /**
       * Agrega una nueva tarea y la sincroniza con la API.
       * @param task - Datos de la nueva tarea.
       */
      async addTask(task: Partial<Task>) {
        try {
          const newTask = await firstValueFrom(taskService.createTask(task));
          if (newTask) patchState(store, addEntity(newTask));
        } catch (error) {
          console.error('Error agregando tarea:', error);
        }
      },

      /**
       * Actualiza una tarea existente en la API y en el estado.
       * @param task - Datos de la tarea actualizada.
       */
      async updateTask(task: Task) {
        try {
          const updatedTask = await firstValueFrom(taskService.updateTask(task));
          if (updatedTask) {
            patchState(store, updateEntity({ id: updatedTask.id, changes: updatedTask }));
          }
        } catch (error) {
          console.error('Error actualizando tarea:', error);
        }
      },

      /**
       * Elimina una tarea de la API y la remueve del estado.
       * @param taskId - ID de la tarea a eliminar.
       */
      async deleteTask(taskId: number) {
        try {
          await firstValueFrom(taskService.deleteTask(taskId));
          patchState(store, removeEntity(taskId));
        } catch (error) {
          console.error('Error eliminando tarea:', error);
        }
      },

      /**
       * Alterna el estado de completado de una tarea.
       * @param task - Tarea a actualizar.
       */
      async toggleTaskCompletion(task: Task) {
        const updatedTask = { ...task, isCompleted: !task.isCompleted };

        // Actualiza el estado de la tarea en la tienda
        patchState(store, updateEntity({ id: task.id, changes: updatedTask }));

        try {
          // Sincroniza la actualización con la API
          await firstValueFrom(taskService.updateTask(updatedTask));
        } catch (error) {
          console.error('Error alternando el estado de la tarea:', error);
        }
      },

      /**
       * Cambia el filtro de las tareas (Todas, Completadas, Pendientes).
       * @param filter - Filtro a aplicar.
       */
      setFilter(filter: TaskFilter) {
        patchState(store, { filter });
      }
    };
  })
);
