import { Component, OnInit } from '@angular/core';
import { RecentPagesService } from '../core/services/recent-pages.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-pages',
  imports: [CommonModule],
  templateUrl: './recent-pages.component.html',
  styleUrl: './recent-pages.component.css'
})
export class RecentPagesComponent implements OnInit{
  recentPages: string[] = [];

  constructor(private recentPagesService: RecentPagesService) {}

  ngOnInit(): void {
    // Sayfa yüklendiğinde son gezilen sayfaları al
    this.recentPages = this.recentPagesService.getPages();
  }
}
