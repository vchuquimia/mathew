import { Category } from '@/models/category';

export class Expense {
    constructor() {
        this.date = new Date();
        this.id = 0;
        this.description = '';
        this.categoryId = 0;
        this.registeredBy = '';
        this.familyId = 0;
    }

    id: number;
    amount?: number;
    description: string;
    category?: Category;
    categoryId: number;
    registeredBy: string;
    date: Date;
    familyId: number;
}
