import { Period } from '@/models/period';

export class UserPeriodParameter {
    constructor() {
        this.period = new Period();
        this.year = 2025;
        this.userName = '';
    }
    period: Period;
    year: number;
    userName: string;
}
