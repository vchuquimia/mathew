import { IncomeSource } from '@/models/income-source';

export class Income {
    constructor(param: any) {
    this.date = param.date;
}
    id?: number;
    amount?: number;
    description?: string;
    date: Date;
    incomeSourceId?: number;
    incomeSource?: IncomeSource;
}
