import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TaskStore } from '@src/task/store/tasks.store';
import { TaskService } from '@src/task/services/task.service';
import { Task, TaskFilter } from '@src/task/interfaces/task.interface';

describe('TaskStore', () => {
  let taskStore: InstanceType<typeof TaskStore>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;

  const mockTasks: Task[] = [
    { id: 1, title: 'Tarea 1', isCompleted: false },
    { id: 2, title: 'Tarea 2', isCompleted: true }
  ];

  beforeEach(() => {
    // Crear un mock del servicio TaskService
    taskServiceMock = jasmine.createSpyObj('TaskService', [
      'getAllTasks',
      'createTask',
      'updateTask',
      'deleteTask'
    ]);

    // Configuración del entorno de pruebas
    TestBed.configureTestingModule({
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        TaskStore
      ]
    });

    taskStore = TestBed.inject(TaskStore);
  });

  /**
   * Prueba de carga de tareas desde la API
   */
  it('Debe cargar todas las tareas', async () => {
    taskServiceMock.getAllTasks.and.returnValue(of(mockTasks));

    await taskStore.loadTasks();

    expect(taskServiceMock.getAllTasks).toHaveBeenCalled();
    expect(taskStore.filteredTasks()).toEqual(mockTasks);
  });

  /**
   * Prueba para agregar una nueva tarea
   */
  it('Debe agregar una nueva tarea', async () => {
    const newTask: Partial<Task> = { title: 'Nueva Tarea', isCompleted: false };

    // Se asegura de que todas las propiedades obligatorias están definidas
    const createdTask: Task = {
      id: 3,
      title: newTask.title ?? 'Título por defecto',
      isCompleted: newTask.isCompleted ?? false,
      description: newTask.description ?? '',
      createdAt: new Date().toISOString(), // Se agrega una fecha por defecto
    };

    taskServiceMock.createTask.and.returnValue(of(createdTask));

    await taskStore.addTask(newTask);

    expect(taskServiceMock.createTask).toHaveBeenCalledWith(newTask);
    expect(taskStore.filteredTasks()).toContain(createdTask);
  });
  /**
   * Prueba para actualizar una tarea existente
   */
  it('Debe actualizar una tarea existente', async () => {
    const existingTask = { id: 1, title: 'Tarea 1', isCompleted: false };
    const updatedTask = { ...existingTask, title: 'Tarea Actualizada', isCompleted: true };

    // Mock the createTask method to return an observable
    taskServiceMock.createTask.and.returnValue(of(existingTask));

    // Add the existing task to the store
    await taskStore.addTask(existingTask);

    // Mock the updateTask method to return an observable
    taskServiceMock.updateTask.and.returnValue(of(updatedTask));

    // Update the task
    await taskStore.updateTask(updatedTask);

    expect(taskServiceMock.updateTask).toHaveBeenCalledWith(updatedTask);

    const storedTask = taskStore.filteredTasks().find(t => t.id === 1);
    expect(storedTask).toEqual(updatedTask);
  });



  /**
   * Prueba para eliminar una tarea del store
   */
  it('Debe eliminar una tarea existente', async () => {
    taskServiceMock.deleteTask.and.returnValue(of('Tarea eliminada exitosamente'));

    await taskStore.deleteTask(1);

    expect(taskServiceMock.deleteTask).toHaveBeenCalledWith(1);
    expect(taskStore.filteredTasks().some(t => t.id === 1)).toBeFalse();
  });


  /**
   * Prueba para cambiar el filtro de tareas
   */
  it('Debe cambiar el filtro de tareas', () => {
    taskStore.setFilter(TaskFilter.Completed);
    expect(taskStore.filteredTasks().every(t => t.isCompleted)).toBeTrue();
  });

  /**
   * Prueba de manejo de errores en la carga de tareas
   */
  it('Debe manejar un error al cargar tareas', async () => {
    taskServiceMock.getAllTasks.and.returnValue(throwError(() => new Error('Error en la API')));

    await taskStore.loadTasks();

    expect(taskServiceMock.getAllTasks).toHaveBeenCalled();
    expect(taskStore.filteredTasks()).toEqual([]);
  });
});
