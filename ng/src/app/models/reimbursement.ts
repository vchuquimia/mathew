import { Expense } from '@/models/expense';

export class Reimbursement {

    constructor() {
        this.id = 0;
        this.amount = 0;
        this.expenseId = 0;
        this.userName = '';
        //this.percentage = 0;
        // this.pending = true;
    }

    id: number;
    amount: number;
    expenseId: number;
    userName: string;
    percentage?: number;
    pending?: boolean;
    expense?: Expense;
}
