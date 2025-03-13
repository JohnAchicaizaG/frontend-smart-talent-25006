import { inject, computed } from '@angular/core';
import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, updateEntity, removeEntity } from '@ngrx/signals/entities';
import { Task } from '../interfaces/task.interface';
import { TaskService } from '../services/task.service';

// Estado inicial del store
interface TaskState {
  loading: boolean;
  filter: 'all' | 'completed' | 'pending';
}

const initialState: TaskState = {
  loading: false,
  filter: 'all',
};

export const TaskStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities<Task>(),

  // ✅ Agregamos método computado para tareas filtradas
  withMethods((store) => {
    const taskService = inject(TaskService);

    return {
      // ✅ Computed para obtener tareas filtradas según el estado `filter`
      filteredTasks: computed(() => {
        const filter = store.filter();
        return store.entities().filter(task => {
          if (filter === 'completed') return task.completed;
          if (filter === 'pending') return !task.completed;
          return true;
        });
      }),

      // Cargar tareas desde API
      async loadTasks() {
        patchState(store, { loading: true });

        try {
          const tasks = await taskService.getAllTasks().toPromise();
          patchState(store, setAllEntities(tasks ?? []), { loading: false });
        } catch (error) {
          console.error('Error loading tasks:', error);
          patchState(store, { loading: false });
        }
      },

      // Agregar nueva tarea a la API
      async addTask(task: Partial<Task>) {
        try {
          const newTask = await taskService.createTask(task).toPromise();
          if (newTask) patchState(store, addEntity(newTask));
        } catch (error) {
          console.error('Error adding task:', error);
        }
      },

      // Actualizar tarea en la API
      async updateTask(task: Task) {
        try {
          const updatedTask = await taskService.updateTask(task).toPromise();
          if (updatedTask) {
            patchState(store, updateEntity({ id: updatedTask.id, changes: updatedTask }));
          }
        } catch (error) {
          console.error('Error updating task:', error);
        }
      },

      // Eliminar tarea de la API
      async deleteTask(taskId: number) {
        try {
          await taskService.deleteTask(taskId).toPromise();
          patchState(store, removeEntity(taskId));
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      },

      // Establecer filtro
      setFilter(filter: 'all' | 'completed' | 'pending') {
        patchState(store, { filter });
      }
    };
  })
);
