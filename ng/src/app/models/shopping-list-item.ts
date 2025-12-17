import { Category } from './category';

export interface ShoppingListItem {
    id: number;
    name: string;
    budgetAmount: number;
    categoryId: number;
    category?: Category;
    shoppingListId: number;
    isBought: boolean;
    done: boolean;
}

