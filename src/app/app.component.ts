import { Component, effect, OnInit, signal } from '@angular/core';
import { TasksComponent } from './task/tasks.component';
import { FooterComponent } from "./task/components/footer/footer.component";
import { NavbarComponent } from "./task/components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [TasksComponent, FooterComponent, NavbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent  {

}
