import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from '@src/app.component';
import { TasksComponent } from '@src/task/tasks.component';
import { FooterComponent } from '@src/task/components/footer/footer.component';
import { NavbarComponent } from '@src/task/components/navbar/navbar.component';

/**
 * Suite de pruebas para el componente AppComponent.
 */
describe('AppComponent', () => {
  /**
   * Configuración inicial que se ejecuta antes de cada prueba.
   * Se importa AppComponent y sus componentes hijos como standalone.
   * Se proporciona HttpClient para las dependencias que lo requieran.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        TasksComponent,
        FooterComponent,
        NavbarComponent
      ],
      providers: [
        provideHttpClient()
      ]
    }).compileComponents();
  });

  /**
   * Prueba que verifica la creación del AppComponent.
   */
  it('debería crear el AppComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /**
   * Prueba que verifica la renderización del componente NavbarComponent.
   */
  it('debería renderizar el NavbarComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navbar')).not.toBeNull();
  });

  /**
   * Prueba que verifica la renderización del componente TasksComponent.
   */
  it('debería renderizar el TasksComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-tasks')).not.toBeNull();
  });

  /**
   * Prueba que verifica la renderización del componente FooterComponent.
   */
  it('debería renderizar el FooterComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-footer')).not.toBeNull();
  });
});
