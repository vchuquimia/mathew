import { Component, Input } from '@angular/core';
import { CurrencyPipe, NgForOf } from '@angular/common';
import { Toolbar } from 'primeng/toolbar';
import { Tooltip } from 'primeng/tooltip';
import { IncomeBudgetMontlySummaryDto } from '@/models/income-budget-montly-summary-dto';
import { IncomeService } from '@/service/income.service';
import { UserPeriodParameter } from '@/models/user-period-parameter';

@Component({
    selector: 'user-financial-summary',
    imports: [CurrencyPipe, Toolbar, Tooltip],
    templateUrl: './user-financial-summary.component.html',
    standalone: true
})
export class UserFinancialSummaryComponent {
    @Input()
    set currentParameter(value: UserPeriodParameter) {
        this._currentParameter = value;
        this.incomeService.getIncomeBudgetMontlySummaryDto(value).subscribe((i) => {
            this.incomeBudgetSummaries = i;
        });
    }

    incomeBudgetSummaries!: IncomeBudgetMontlySummaryDto[];

    private _currentParameter!: UserPeriodParameter;
    constructor(private incomeService: IncomeService) {}
}
