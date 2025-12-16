import { Expense } from '@/models/expense';

export class Reimbursement {

    constructor() {
        this.id = 0;
        this.amount = 0;
        this.expenseId = 0;
        this.userName = '';
        this.familyId = 0;
        this.description = '';
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
    familyId: number;
    reimbursementDate?: Date;
    description: string;
}
