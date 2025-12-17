import { ShoppingListItem } from './shopping-list-item';

export interface ShoppingList {
    id: number;
    name: string;
    familyId: number;
    done: boolean;
    createdDate: string;
    items: ShoppingListItem[];
}
