import { Category } from '@/models/category';

export interface Budget {
    id?: number;
    categoryId?: number;
    amount?: number;
    month?: number;
    year?: number;
    category?: Category;
}
