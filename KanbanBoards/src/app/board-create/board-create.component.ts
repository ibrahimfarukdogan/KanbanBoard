import { Component, OnInit } from '@angular/core';
import { BoardsService } from '../core/services/boards.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecentPagesService } from '../core/services/recent-pages.service';

@Component({
  selector: 'app-board-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './board-create.component.html',
  styleUrl: './board-create.component.css'
})
export class BoardCreateComponent implements OnInit{
  boardCreateForm;

  constructor(
    private boardService: BoardsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private recentPagesService: RecentPagesService) {
    this.boardCreateForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]], // title is required and at least 3 characters long
      creatorName: ['', [Validators.required, Validators.minLength(3)]], // creator name is required and at least 3 characters long
    });
  }

  get title() {
    return this.boardCreateForm.get('title');
  }
  get creatorName() {
    return this.boardCreateForm.get('creatorName');
  }

  ngOnInit(): void {
    // Save The Visited Page
    this.recentPagesService.addPage(window.location.href);
  }

  onSubmit(): void {
    if (this.boardCreateForm.valid) {
      const newBoard = {
        title: this.boardCreateForm.value.title || '',
        creatorName: this.boardCreateForm.value.creatorName || ''
      };

      this.boardService.createBoard(newBoard).subscribe(
        (response) => {
          console.log('Board created successfully', response);
          this.boardCreateForm.reset();
          this.router.navigate([`/${newBoard.title}`]); // Navigate back to homepage after creating board
        },
        (error) => {
          console.error('Error creating board', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
