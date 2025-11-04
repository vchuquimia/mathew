import { Category } from '@/models/category';

export class Expense {
    constructor(param: any) {
        this.date = param.date;
    }

    id?: number;
    amount?: number;
    description?: string;
    category?: Category;
    categoryId?: number;
    date: Date;
}
