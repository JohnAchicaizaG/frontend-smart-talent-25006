import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="fixed bottom-0 left-0 w-full bg-gray-700 text-gray-100 py-3 text-center shadow-lg">
      © 2025 Task Manager, John Chicaiza. Prueba Técnica (25006) Desarrollador Angular Semi-Senior.
    </footer>
  `,
  styles: []
})
export class FooterComponent {}
