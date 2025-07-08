import { Lists } from "./lists.model";

export interface Boards {
    id: number;
    title: string;
    creatorName: string;
    lists: Lists[];
}
