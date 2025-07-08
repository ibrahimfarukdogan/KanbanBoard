import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardOrderDTO } from '../models/cardsorderdto.model';
import { Cardupdatedto } from '../models/cardupdatedto.model';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private apiUrl = 'https://localhost:7114/api/Cards'; // Change to your actual API endpoint

  constructor(private http: HttpClient) { }

  // POST request to create a new card
  createCard(cardData: { title: string, description: string, color: string, tag: string, listId: number, boardtitle: string }):  Observable<any> {
    return this.http.post(`${this.apiUrl}/${cardData.boardtitle}/lists/${cardData.listId}/cards`, cardData);
  }
  getCard(cardId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cards/${cardId}`);
  }
  updateCardOrder(cards: CardOrderDTO[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/cardsorder`, cards);
  }
  updateCardList (cardId: number, listId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${cardId}/cardlist`, listId);
  }
  updateCards (boardtitle: string, listId: number, cards: Cardupdatedto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${boardtitle}/lists/${listId}/cards/${cards.id}`, cards);
  }
  RemoveCard (cardId: number, listId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/lists/${listId}/cards/${cardId}`);
  }

}
