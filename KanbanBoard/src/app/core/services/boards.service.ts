import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  private apiUrl = 'https://localhost:7114/api/Boards'; // Change to your actual API endpoint

  constructor(private http: HttpClient) { }

  // Method to create a new board
  createBoard(board: { title: string, creatorName: string }): Observable<any> { //Board data with detailed request
    return this.http.post(this.apiUrl, board);
  }
  getBoardByTitle(title: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${title}`);
  }
}
