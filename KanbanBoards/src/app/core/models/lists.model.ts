import { Cards } from './cards.model';
import { Boards } from './boards.model';

export interface Lists {
  id: number;
  title: string;
  boardId: number;
  board: Boards;
  cards: Cards[];
}