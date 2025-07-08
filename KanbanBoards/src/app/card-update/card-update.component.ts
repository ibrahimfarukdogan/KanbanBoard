import { Component, inject, OnInit } from '@angular/core';
import { CardsService } from '../core/services/cards.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Cardupdatedto } from '../core/models/cardupdatedto.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecentPagesService } from '../core/services/recent-pages.service';

@Component({
  selector: 'app-card-update',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-update.component.html',
  styleUrl: './card-update.component.css'
})
export class CardUpdateComponent implements OnInit {
  private route = inject(ActivatedRoute);
  boardtitle: string = "";
  listId: number = 0;
  cardId: number = 0;
  cardForm;
  errorMessage: string = '';

  constructor(
    private cardsService: CardsService,
    private fb: FormBuilder,
    private router: Router,
    private recentPagesService: RecentPagesService
  ) {
    this.cardForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      color: ['Blue'],
      tag: [''],
    })
  }

  ngOnInit(): void {
    this.boardtitle = this.route.snapshot.paramMap.get('title')!;
    this.listId = +this.route.snapshot.paramMap.get('listId')!;
    this.cardId = +this.route.snapshot.paramMap.get('cardId')!;
    this.recentPagesService.addPage(window.location.href);
    this.getCardDetails();
  }

  getCardDetails(): void {
    this.cardsService.getCard(this.cardId).subscribe({
      next: (cardData: Cardupdatedto) => {
        // Populate the form with the retrieved card data
        this.cardForm.patchValue({
          title: cardData.title,
          description: cardData.description || '',
          color: cardData.color || 'Blue',
          tag: cardData.tag || '',
        });
      },
      error: (err) => {
        this.errorMessage = 'There was an error loading the card data';
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.cardForm.valid) { 
      let cardData = this.cardForm.getRawValue(); // Get raw form data
    
      // Ensure that the values are valid and not null/undefined
      cardData.title = cardData.title?.trim() || ''; // Fallback to empty string if title is empty
      cardData.description = cardData.description?.trim() || ''; // Fallback to empty string if title is empty
      cardData.color = cardData.color?.trim() || 'Blue'; // Ensure color is not empty
      cardData.tag = cardData.tag?.trim() || ''; // Fallback to empty string if tag is empty
    
      // Explicitly assert that the type of cardData is correct
      const sanitizedCardData = cardData as Cardupdatedto;
      sanitizedCardData.id=this.cardId;

      // Now pass the sanitized cardData to your updateCard method
      this.updateCards(sanitizedCardData);
    }
  }

  updateCards(card: Cardupdatedto): void {
    this.cardsService.updateCards(this.boardtitle, this.listId, card).subscribe({
      next: () => {
        console.log('Card order updated successfully');
        this.router.navigate([`/${this.boardtitle}`]);
      },
      error: (err) => {
          this.errorMessage = 'There was an error creating the card';
          console.error(err);
      }
    });
  }
}
