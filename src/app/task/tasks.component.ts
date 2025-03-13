import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgFor, CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { TaskStore } from './store/tasks.store';
import { Task } from './interfaces/task.interface';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, NgFor, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  private taskStore = inject(TaskStore);
  private fb = inject(FormBuilder);

  filteredTasks = this.taskStore.filteredTasks;
  taskForm!: FormGroup;
  isEditing = false;
  editingTaskId: number | null = null;

  ngOnInit(): void {
    this.taskStore.loadTasks();

    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.maxLength(255)]],
      isCompleted: [false]
    });
  }

  selectFilter(filter: 'all' | 'completed' | 'pending') {
    this.taskStore.setFilter(filter);
  }

  async addOrUpdateTask() {
    if (this.taskForm.valid) {
      const { title, description } = this.taskForm.value;

      if (this.isEditing && this.editingTaskId !== null) {
        await this.taskStore.updateTask({
          id: this.editingTaskId,
          title,
          description,
          isCompleted: this.taskForm.get('isCompleted')?.value ?? false

        });
        this.taskStore.loadTasks();

        Swal.fire({
          title: '✏️ Tarea Actualizada',
          text: 'Los cambios han sido guardados exitosamente.',
          icon: 'info',
          timer: 2000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          background: '#fef9c3',
          color: '#713f12',
        });

      } else {
        await this.taskStore.addTask({
          id: Date.now(),
          title,
          description,
          isCompleted: false,
        });

        Swal.fire({
          title: '✅ Tarea Agregada',
          text: 'La tarea ha sido agregada con éxito.',
          icon: 'success',
          timer: 2000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          background: '#d1fae5',
          color: '#065f46',
        });
      }

      this.taskForm.reset();
      this.isEditing = false;
      this.editingTaskId = null;
    }
  }


  editTask(task: Task) {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      isCompleted: task.isCompleted
    });

    this.isEditing = true;
    this.editingTaskId = task.id;
  }

  resetForm() {
    this.taskForm.reset();
    this.isEditing = false;
    this.editingTaskId = null;
  }

  async removeTask(taskId: number) {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#64748b',
      background: '#fef2f2',
      color: '#7f1d1d',
    });

    if (confirm.isConfirmed) {
      await this.taskStore.deleteTask(taskId);

      Swal.fire({
        title: '🗑️ Tarea Eliminada',
        text: 'La tarea ha sido eliminada con éxito.',
        icon: 'success',
        timer: 2000,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        background: '#fecaca',
        color: '#7f1d1d',
      });
    }
  }

  toggleTaskCompletion(task: Task) {
    this.taskStore.toggleTaskCompletion(task);
  }

  trackById(index: number, task: Task): number {
    return task.id;
  }
}
