import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardsService } from '../core/services/boards.service';
import { CommonModule } from '@angular/common';
import { CardsService } from '../core/services/cards.service';
import { Cards } from '../core/models/cards.model';
import { Lists } from '../core/models/lists.model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule
} from '@angular/cdk/drag-drop';
import { CardOrderDTO } from '../core/models/cardsorderdto.model';
import { RecentPagesService } from '../core/services/recent-pages.service';

@Component({
  selector: 'app-board-detail',
  imports: [DragDropModule, CommonModule],
  templateUrl: './board-detail.component.html',
  styleUrl: './board-detail.component.css'
})
export class BoardDetailComponent implements OnInit {
  board: any;
  errorMessage: string = '';
  private route = inject(ActivatedRoute);

  constructor(
    private boardsService: BoardsService,
    private cardsService: CardsService,
    private router: Router,
    private recentPagesService: RecentPagesService
  ) { }

  ngOnInit(): void {
    this.recentPagesService.addPage(window.location.href);
    const title = this.route.snapshot.paramMap.get('title');
    if (title) {
      this.boardsService.getBoardByTitle(title).subscribe(
        (boardData) => {
          this.board = boardData;

          this.board.lists.$values.forEach((list: any) => {
            // Log the list title (you can also log other properties)
            console.log(`List: ${list.title}`);

            // Check if cards exist and log each card
            if (list.cards && list.cards.$values) {
              list.cards.$values.sort((a: any, b: any) => a.order - b.order);
            }
          });
        },
        (error) => {
          this.errorMessage = 'Error fetching';
          console.error(error);
        }
      );
    }
  }

  onCardDrop(event: CdkDragDrop<any>) {
    const previousList = event.previousContainer.data;
    const currentList = event.container.data;

    const card = event.item.data;
    card.listId = currentList.id;
    if (previousList === currentList) // Reordering within the same list
    {
      const previousIndex = previousList.cards.$values.findIndex((c: Cards) => c.id === card.id);
      previousList.cards.$values.splice(previousIndex, 1); // Remove the card
      currentList.cards.$values.splice(event.currentIndex, 0, card); // Add it to the new position
    }
    else // Moving between different lists
    {
      const previousListIndex = previousList.cards.$values.findIndex((c: Cards) => c.id === card.id);
      if (previousListIndex > -1) {
        previousList.cards.$values.splice(previousListIndex, 1); // Remove the card from the previous list
      }

      currentList.cards.$values.splice(event.currentIndex, 0, card); // Add card to the new list

      this.updateCardList(card.id, card.listId);

      // Update order in the current list
      const cardOrderDTOCurrent: CardOrderDTO[] = currentList.cards.$values.map((c: Cards, index: number) => {
        return {
          id: c.id,
          order: index + 1
        };
      });
      this.updateCardOrder(cardOrderDTOCurrent);
      //console.log('Cards in the new list (dropped list):');
      //currentList.cards.$values.forEach((c: Cards) => console.log(c));
    }

    // Update order in the previous list
    /*previousList.cards.$values.forEach((c: Cards, index: number) => {
      c.order = index + 1;
    });*/
    const cardOrderDTOPrevious: CardOrderDTO[] = previousList.cards.$values.map((c: Cards, index: number) => {
      return {
        id: c.id,
        order: index + 1
      };
    });
    this.updateCardOrder(cardOrderDTOPrevious);
    //cardOrderDTOPrevious.forEach((c: CardOrderDTO) => console.log(c));
    //console.log('Cards in the original list (dragged list):');
    //previousList.cards.$values.forEach((c: Cards) => console.log(c));
    //console.log('Card moved or reordered:', card);
    //console.log('Updated board:', this.board);
  }

  RemoveCard(card: Cards): void {
    const cardId = card.id;
    const listId = card.listId;
    this.RemoveCardApi(cardId,listId);
    

    const list = this.board.lists.$values.find((list: Lists) => list.id === card.listId); // Find the list containing the card
    if (list) {
      const index = list.cards.$values.findIndex((c: Cards) => c.id === card.id);
      if (index > -1) {
        list.cards.$values.splice(index, 1);  // Remove the card from the list visually
      }
      const cardOrderDTOCurrent: CardOrderDTO[] = list.cards.$values.map((c: Cards, index: number) => {
        return {
          id: c.id,
          order: index + 1
        };
      });
      this.updateCardOrder(cardOrderDTOCurrent);
    }
  }

  RemoveCardApi(cardId: number, listId: number): void {
    this.cardsService.RemoveCard(cardId, listId).subscribe({
      next: () => {
        console.log('Card deleted successfully');
      },
      error: (err) => {
        this.errorMessage = 'Error deleting';
        console.error(err);
      }
    });
  }

  updateCardOrder(updatedCards: CardOrderDTO[]): void {
    this.cardsService.updateCardOrder(updatedCards).subscribe({
      next: () => {
        console.log('Card order updated successfully');
      },
      error: (err) => {
        this.errorMessage = 'Error updating';
        console.error(err);
      }
    });
  }

  updateCardList(cardId: number, listId: number): void {
    this.cardsService.updateCardList(cardId, listId).subscribe({
      next: () => {
        console.log('Card order updated successfully');
        console.log(cardId);
        console.log(listId);
      },
      error: (err) => {
        this.errorMessage = 'Error updating';
        console.error(err);
      }
    });
  }

  navigateToCardCreate(listId: number): void {
    this.router.navigate([`/${this.board.title}/lists/${listId}/cardcreate`]);
  }
  navigateToCardUpdate(listId: number, cardId: number): void {
    this.router.navigate([`/${this.board.title}/lists/${listId}/cardupdate/${cardId}`]);
  }
}