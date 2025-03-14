import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TasksComponent } from '@src/task/tasks.component';
import { TaskFilter } from '@src/task/interfaces/task.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskService } from '@src/task/services/task.service';
import { of } from 'rxjs';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  // Mock del servicio TaskService
  const mockTaskService = {
    // Agrega aquí los métodos del servicio que el componente utiliza
    getTasks: () => of([]),
    // Otros métodos según sea necesario
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientTestingModule, // Módulo para pruebas de HttpClient
        TasksComponent
      ],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        // Otros proveedores si es necesario
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    expect(component.taskForm).toBeDefined();
    expect(component.taskForm.get('title')).toBeTruthy();
    expect(component.taskForm.get('description')).toBeTruthy();
    expect(component.taskForm.get('isCompleted')).toBeTruthy();
  });

  it('debería validar que el título es requerido y mínimo de 3 caracteres', () => {
    const titleControl = component.taskForm.get('title');
    titleControl?.setValue('');
    expect(titleControl?.valid).toBeFalsy();

    titleControl?.setValue('ab');
    expect(titleControl?.valid).toBeFalsy();

    titleControl?.setValue('abc');
    expect(titleControl?.valid).toBeTruthy();
  });

  it('debería validar que la descripción tiene máximo 50 caracteres', () => {
    const descriptionControl = component.taskForm.get('description');
    descriptionControl?.setValue('a'.repeat(51));
    expect(descriptionControl?.valid).toBeFalsy();

    descriptionControl?.setValue('a'.repeat(50));
    expect(descriptionControl?.valid).toBeTruthy();
  });

  it('debería establecer correctamente el filtro activo', () => {
    component.selectFilter(TaskFilter.Completed);
    expect(component.activeFilter).toBe(TaskFilter.Completed);

    component.selectFilter(TaskFilter.Pending);
    expect(component.activeFilter).toBe(TaskFilter.Pending);
  });

  it('debería resetear el formulario y desactivar modo edición', () => {
    component.taskForm.setValue({ title: 'Test', description: 'Test Desc', isCompleted: true });
    component.isEditing = true;
    component.editingTaskId = 1;

    component.resetForm();

    expect(component.taskForm.value).toEqual({ title: null, description: null, isCompleted: null });
    expect(component.isEditing).toBeFalse();
    expect(component.editingTaskId).toBeNull();
  });

  it('debería devolver el mensaje correcto cuando no hay tareas', () => {
    component.activeFilter = TaskFilter.Completed;
    expect(component.getEmptyMessage()).toBe('No hay tareas completadas.');

    component.activeFilter = TaskFilter.Pending;
    expect(component.getEmptyMessage()).toBe('No hay tareas pendientes.');

    component.activeFilter = TaskFilter.All;
    expect(component.getEmptyMessage()).toBe('No hay tareas registradas.');
  });

  it('debería devolver la descripción correcta cuando no hay tareas', () => {
    component.activeFilter = TaskFilter.Completed;
    expect(component.getEmptyDescription()).toBe('Marca las tareas como completadas para que aparezcan aquí.');

    component.activeFilter = TaskFilter.Pending;
    expect(component.getEmptyDescription()).toBe('¡Disfruta tu tiempo libre! 😎');

    component.activeFilter = TaskFilter.All;
    expect(component.getEmptyDescription()).toBe('Crea una nueva tarea para comenzar a organizarte.');
  });

  it('debería resetear el filtro a "All" cuando se llama resetFilter', () => {
    component.activeFilter = TaskFilter.Completed;
    component.resetFilter();
    expect(component.activeFilter).toBe(TaskFilter.All);
  });
});
