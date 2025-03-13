import { Component, effect, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TasksComponent } from './task/tasks.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TasksComponent],
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent  {

}
