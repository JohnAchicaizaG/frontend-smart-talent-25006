import { Component, OnInit, inject } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { TaskStore } from './store/tasks.store';
import { Task } from './interfaces/task.interface';


@Component({
  selector: 'app-tasks',
  standalone: true,
    imports: [CommonModule, NgFor,],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  private taskStore = inject(TaskStore);

  // ✅ Ahora usamos el `computed` directamente desde el store
  filteredTasks = this.taskStore.filteredTasks;

  ngOnInit(): void {
    this.taskStore.loadTasks();
  }

  selectFilter(filter: 'all' | 'completed' | 'pending') {
    this.taskStore.setFilter(filter);
  }

  addNewTask(title: string) {
    if (title.trim()) {
      this.taskStore.addTask({ id: Date.now(), title, completed: false });
    }
  }

  removeTask(taskId: number) {
    this.taskStore.deleteTask(taskId);
  }

  // ✅ Solución: Método auxiliar para actualizar el estado de `completed`
  toggleTaskCompletion(task: Task) {
    this.taskStore.updateTask({ id: task.id, title: task.title, completed: !task.completed });
  }

  // ✅ trackBy para mejorar rendimiento en *ngFor
  trackById(index: number, task: Task): number {
    return task.id;
  }
}
