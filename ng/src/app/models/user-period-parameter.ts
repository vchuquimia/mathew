import { Period } from '@/models/period';
import { PeriodParameter } from '@/models/period-parameter';

export class UserPeriodParameter {
    constructor() {
        this.periodParameter = new PeriodParameter(new Period(), new Date().getFullYear());
        this.userName = '';
    }
    periodParameter: PeriodParameter;
    userName: string;
}
