import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecentPagesComponent } from './recent-pages/recent-pages.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RecentPagesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'KanbanBoard';
}
