import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Panel } from 'primeng/panel';
import { Tooltip } from 'primeng/tooltip';
import { FinantialSummaryDto } from '@/models/finantial-summary-dto';
import { IncomeService } from '@/service/income.service';
import { UserPeriodParameter } from '@/models/user-period-parameter';

@Component({
    selector: 'financial-summary',
    imports: [CurrencyPipe, Panel, Tooltip, NgClass],
    templateUrl: './financial-summary.component.html',
    standalone: true,
})
export class FinancialSummaryComponent {
    get currentUserPeriodParameter(): UserPeriodParameter {
        return this._currentUserPeriodParameter;
    }
    @Input()
    set currentUserPeriodParameter(value: UserPeriodParameter) {
        this._currentUserPeriodParameter = value;
        if(this.currentUserPeriodParameter.period.value != 0)
            this.load();
    }
    @Output() currentUserPeriodParameterChange = new EventEmitter<UserPeriodParameter>();

    incomeBudgetSummary:  FinantialSummaryDto[]= [];
    private _currentUserPeriodParameter: UserPeriodParameter = new UserPeriodParameter();

    constructor(private incomeService: IncomeService,) {
    }

    load(){
        this.incomeService.getIncomeBudgetMontlySummaryDto(this._currentUserPeriodParameter).subscribe((data) => {
            this.incomeBudgetSummary = data;
        });
    }
}
