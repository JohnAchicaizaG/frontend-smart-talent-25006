import { inject, computed } from '@angular/core';
import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, updateEntity, removeEntity } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { Task } from '../interfaces/task.interface';
import { TaskService } from '../services/task.service';

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
  withMethods((store) => {
    const taskService = inject(TaskService);

    return {
      filteredTasks: computed(() => {
        const filter = store.filter();
        return store.entities().filter(task => {
          if (filter === 'completed') return task.isCompleted;
          if (filter === 'pending') return !task.isCompleted;
          return true;
        });
      }),

      async loadTasks() {
        patchState(store, { loading: true });
        try {
          const tasks = await firstValueFrom(taskService.getAllTasks());
          patchState(store, setAllEntities(tasks ?? []), { loading: false });
        } catch (error) {
          console.error('Error loading tasks:', error);
          patchState(store, { loading: false });
        }
      },

      async addTask(task: Partial<Task>) {
        try {
          const newTask = await firstValueFrom(taskService.createTask(task));
          if (newTask) patchState(store, addEntity(newTask));
        } catch (error) {
          console.error('Error adding task:', error);
        }
      },

      async updateTask(task: Task) {
        try {
          const updatedTask = await firstValueFrom(taskService.updateTask(task));
          if (updatedTask) {
            patchState(store, updateEntity({ id: updatedTask.id, changes: updatedTask }));
          }
        } catch (error) {
          console.error('Error updating task:', error);
        }
      },

      async deleteTask(taskId: number) {
        try {
          await firstValueFrom(taskService.deleteTask(taskId));
          patchState(store, removeEntity(taskId));
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      },

      async toggleTaskCompletion(task: Task) {
        const updatedTask = { ...task, isCompleted: !task.isCompleted };
        patchState(store, updateEntity({ id: task.id, changes: updatedTask }));

        try {
          await firstValueFrom(taskService.updateTask(updatedTask));
        } catch (error) {
          console.error('Error updating task:', error);
        }
      },

      setFilter(filter: 'all' | 'completed' | 'pending') {
        patchState(store, { filter });
      }
    };
  })
);
