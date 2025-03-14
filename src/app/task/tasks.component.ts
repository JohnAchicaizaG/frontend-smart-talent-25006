import { Component, OnInit, inject } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { TaskStore } from './store/tasks.store';
import { confirmAction, showNotification } from './utils/alert.utils';
import { Task, TaskFilter } from './interfaces/task.interface';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, NgFor, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  // Inyección de dependencias
  readonly taskStore = inject(TaskStore);
  private fb = inject(FormBuilder);

  /** Enumeración de los filtros disponibles */
  TaskFilter = TaskFilter;

  /** Lista de tareas filtradas */
  filteredTasks = this.taskStore.filteredTasks;

  /** Formulario reactivo para la creación/edición de tareas */
  taskForm!: FormGroup;

  /** Indica si se está editando una tarea */
  isEditing = false;

  /** ID de la tarea en edición */
  editingTaskId: number | null = null;

  /** Filtro actualmente seleccionado */
  activeFilter: TaskFilter = TaskFilter.All;

  /**
   * Inicializa el componente y carga las tareas existentes
   */
  ngOnInit(): void {
    this.taskStore.loadTasks();
    this.initForm();
  }

  /**
   * Inicializa el formulario con los valores por defecto
   * @private
   */
  private initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.maxLength(50)]],
      isCompleted: [false],
    });
  }

  /**
   * Cambia el filtro activo y actualiza la lista de tareas
   * @param {TaskFilter} filter - Filtro seleccionado
   */
  selectFilter(filter: TaskFilter): void {
    this.taskStore.setFilter(filter);
    this.activeFilter = filter;
  }

  /**
   * Agrega o actualiza una tarea según el estado de edición
   */
  async addOrUpdateTask(): Promise<void> {
    if (this.taskForm.valid) {
      this.isEditing ? await this.updateTask() : await this.createTask();
      this.resetForm();
    }
  }

  /**
   * Actualiza una tarea existente en el store
   * @private
   */
  private async updateTask(): Promise<void> {
    await this.taskStore.updateTask({
      id: this.editingTaskId!,
      ...this.taskForm.value,
    });

    this.taskStore.loadTasks();

    showNotification('✏️ Tarea Actualizada', 'Los cambios han sido guardados exitosamente.', 'info', '#fef9c3', '#713f12');
  }

  /**
   * Crea una nueva tarea en el store
   * @private
   */
  private async createTask(): Promise<void> {
    await this.taskStore.addTask({
      id: Date.now(),
      ...this.taskForm.value,
      isCompleted: false,
    });

    showNotification('✅ Tarea Agregada', 'La tarea ha sido agregada con éxito.', 'success', '#d1fae5', '#065f46');
  }

  /**
   * Establece una tarea para su edición y llena el formulario con sus datos
   * @param {Task} task - Tarea a editar
   */
  editTask(task: Task): void {
    this.taskForm.patchValue(task);
    this.isEditing = true;
    this.editingTaskId = task.id;
  }

  /**
   * Resetea el formulario y desactiva el modo edición
   */
  resetForm(): void {
    this.taskForm.reset();
    this.isEditing = false;
    this.editingTaskId = null;
  }

  /**
   * Elimina una tarea tras confirmar la acción
   * @param {number} taskId - ID de la tarea a eliminar
   */
  async removeTask(taskId: number): Promise<void> {
    if (await confirmAction('¿Estás seguro?', 'Esta acción no se puede deshacer', 'warning', 'Sí, eliminar', '#b91c1c')) {
      await this.taskStore.deleteTask(taskId);
      this.taskStore.loadTasks();
      showNotification('Tarea Eliminada', 'La tarea ha sido eliminada con éxito.', 'success', '#fecaca', '#7f1d1d');
    }
  }
  /**
   * Alterna el estado de completado de una tarea
   * @param {Task} task - Tarea a actualizar
   */
  toggleTaskCompletion(task: Task): void {
    this.taskStore.toggleTaskCompletion(task);
  }

  /**
   * Optimiza la renderización de la lista de tareas
   * @param {number} index - Índice del elemento en la lista
   * @param {Task} task - Tarea a identificar
   * @returns {number} ID único de la tarea
   */
  trackById(index: number, task: Task): number {
    return task.id;
  }


  /**
 * Devuelve un mensaje personalizado según el filtro seleccionado cuando no hay tareas.
 */
  getEmptyMessage(): string {
    switch (this.activeFilter) {
      case TaskFilter.Completed:
        return "No hay tareas completadas.";
      case TaskFilter.Pending:
        return "No hay tareas pendientes.";
      default:
        return "No hay tareas registradas.";
    }
  }

  /**
   * Devuelve una descripción amigable cuando no hay tareas en el filtro actual.
   */
  getEmptyDescription(): string {
    switch (this.activeFilter) {
      case TaskFilter.Completed:
        return "Marca las tareas como completadas para que aparezcan aquí.";
      case TaskFilter.Pending:
        return "¡Disfruta tu tiempo libre! 😎";
      default:
        return "Crea una nueva tarea para comenzar a organizarte.";
    }
  }

  /**
   * Reinicia el filtro para mostrar todas las tareas.
   */
  resetFilter(): void {
    this.selectFilter(TaskFilter.All);
  }

}
