import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BoardCreateComponent } from './board-create/board-create.component';
import { BoardDetailComponent } from './board-detail/board-detail.component';
import { CardCreateComponent } from './card-create/card-create.component';
import { CardUpdateComponent } from './card-update/card-update.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Default route for homepage
    { path: ':title', component: BoardDetailComponent }, // Detail route for Boards
    { path: ':title/lists/:listId/cardcreate', component: CardCreateComponent }, // Card creating route for Boards
    { path: ':title/lists/:listId/cardupdate/:cardId', component: CardUpdateComponent }, // Card creating route for Boards
    { path: 'board/create', component: BoardCreateComponent } // Board creating route for homepage
  ];