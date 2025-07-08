import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecentPagesService {
  private readonly storageKey = 'recentPages'; // localStorage'da saklanacak anahtar

  constructor() { }

  // When visisted a page, save it
  addPage(url: string): void {
    let pages = this.getPages();
    // if page is already at the list, remove and add it
    pages = pages.filter(page => page !== url);
    pages.unshift(url); // new page addded to start

    // Last 5 pages
    if (pages.length > 5) {
      pages.pop(); // if there is more than 5 destroy the older ones
    }

    localStorage.setItem(this.storageKey, JSON.stringify(pages));
  }

  // Get The last 5 Saved Pages
  getPages(): string[] {
    const pages = localStorage.getItem(this.storageKey);
    return pages ? JSON.parse(pages) : [];
  }
}