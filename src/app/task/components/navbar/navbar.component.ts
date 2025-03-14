import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
  <div class=" py-4 md:py-8 px-4 md:px-12 bg-gray-100 transition duration-300 ease-in-out">
  <nav class="bg-gray-700 shadow-lg px-6 py-4 rounded-lg flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <img src="assets/smart_talent.png" alt="Logo" class="h-10 w-auto" />
      </div>
      <h1 class="text-xl font-semibold text-gray-200">Gestor de Tareas</h1>
    </nav>
  </div>

  `,
  styles: []
})
export class NavbarComponent {}
