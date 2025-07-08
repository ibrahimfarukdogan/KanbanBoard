import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecentPagesService } from '../core/services/recent-pages.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  constructor(private recentPagesService: RecentPagesService) {}
  ngOnInit(): void {
    // Save The Visited Page
    this.recentPagesService.addPage(window.location.href);
  }
}
