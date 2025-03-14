import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from '@src/task/services/task.service';
import { environment } from 'src/environments/environment';
import { ApiResponse, Task } from '@src/task/interfaces/task.interface';

/**
 * Pruebas unitarias para el servicio `TaskService`
 */
describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/tasks`;

  /**
   * Configuración inicial antes de cada prueba.
   * Se inyectan las dependencias necesarias para el servicio.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        provideHttpClient(), // Proporciona HttpClient para el servicio
        provideHttpClientTesting() // Configura el backend de pruebas HTTP
      ]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  /**
   * Verifica que no haya peticiones pendientes después de cada prueba.
   */
  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Verifica que el servicio se ha creado correctamente.
   */
  it('Debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Prueba la obtención de todas las tareas desde la API.
   */
  it('Debe obtener todas las tareas', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Tarea 1', isCompleted: false },
      { id: 2, title: 'Tarea 2', isCompleted: true }
    ];

    service.getAllTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockTasks } as ApiResponse<Task[]>);
  });

  /**
   * Prueba la obtención de una tarea específica por su ID.
   */
  it('Debe obtener una tarea por ID', () => {
    const mockTask: Task = { id: 1, title: 'Tarea 1', isCompleted: false };

    service.getTaskById(1).subscribe(task => {
      expect(task).toEqual(mockTask);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockTask } as ApiResponse<Task>);
  });

  /**
   * Prueba la creación de una nueva tarea.
   */
  it('Debe crear una tarea', () => {
    const newTask: Partial<Task> = { title: 'Nueva Tarea', isCompleted: false };

    // Asegurar que los valores requeridos están definidos
    const createdTask: Task = {
      id: 1,
      title: newTask.title ?? 'Título por defecto', // Se asegura que `title` no sea undefined
      isCompleted: newTask.isCompleted ?? false,
      description: newTask.description ?? '',
      createdAt: new Date().toISOString() // Se asegura que `createdAt` tenga un valor válido
    };

    service.createTask(newTask).subscribe(task => {
      expect(task).toEqual(createdTask);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ data: createdTask } as ApiResponse<Task>);
  });

  /**
   * Prueba la actualización de una tarea existente.
   */
  it('Debe actualizar una tarea', () => {
    const updatedTask: Task = { id: 1, title: 'Tarea Editada', isCompleted: true };

    service.updateTask(updatedTask).subscribe(task => {
      expect(task).toEqual(updatedTask);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ data: updatedTask } as ApiResponse<Task>);
  });

  /**
   * Prueba la eliminación de una tarea.
   */
  it('Debe eliminar una tarea', () => {
    service.deleteTask(1).subscribe(message => {
      expect(message).toBe('Tarea eliminada exitosamente');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Tarea eliminada exitosamente' } as ApiResponse<string>);
  });
});
