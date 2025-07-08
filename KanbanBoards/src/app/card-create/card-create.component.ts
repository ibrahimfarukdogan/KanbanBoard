import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardsService } from '../core/services/cards.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecentPagesService } from '../core/services/recent-pages.service';

@Component({
  selector: 'app-card-create',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './card-create.component.html',
  styleUrl: './card-create.component.css'
})
export class CardCreateComponent implements OnInit{
  cardForm;
  boardtitle: string='';
  listId: number=0;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private cardsService: CardsService, // Service to interact with backend
    private fb: FormBuilder,
    private router: Router,
    private recentPagesService: RecentPagesService
  ) { 
    this.cardForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      color: ['Blue'],
      tag: [''],
      order: [0],  // Order can be handled dynamically in the backend
      boardtitle: [''], // ListId is handled at the Submit
      listId: [0], // ListId is handled at the Submit
    })
  }

  ngOnInit(): void {
    // Get the listId from the route parameters
    this.boardtitle = this.route.snapshot.paramMap.get('title')!;
    this.listId = +this.route.snapshot.paramMap.get('listId')!;
    this.recentPagesService.addPage(window.location.href);
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      let cardData = this.cardForm.getRawValue(); // Get raw form data
    
      // Ensure that the values are valid and not null/undefined
      cardData.boardtitle = this.boardtitle ?? ''; // Fallback to 0 if undefined
      cardData.listId = this.listId ?? 0;   // Fallback to 0 if undefined
      cardData.title = cardData.title?.trim() || ''; // Fallback to empty string if title is empty
      cardData.description = cardData.description?.trim() || ''; // Fallback to empty string if title is empty
      cardData.color = cardData.color?.trim() || 'Blue'; // Ensure color is not empty
      cardData.tag = cardData.tag?.trim() || ''; // Fallback to empty string if tag is empty
    
      // Explicitly assert that the type of cardData is correct
      const sanitizedCardData = cardData as {
        title: string;
        description: string;
        color: string;
        tag: string;
        order: number;
        listId: number;
        boardtitle: string;
      };
    
      // Now pass the sanitized cardData to your createCard method
      this.cardsService.createCard(sanitizedCardData).subscribe(
        response => {
          // Redirect back to the board or list
          this.router.navigate([`/${this.boardtitle}`]);
        },
        error => {
          this.errorMessage = 'There was an error creating the card';
          console.error(error);
        }
      );
    }
  }
}