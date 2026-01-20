import { Period } from '@/models/period';

export class PeriodParameter {
    constructor(period: Period, year: number) {
        this.period = period;
        this.year = year;
    }
    period: Period;
    year: number;
}
