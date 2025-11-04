import { Category } from '@/models/category';

export class ExpenseSummaryDto {
    totalAmount?: number;
    categoryId?: number;
    expenseCount?: number;
    category?: Category;
    budgetUsedPercentage?: number;
    remainingBudget?: number;
    budgetAmount?: number;
}
