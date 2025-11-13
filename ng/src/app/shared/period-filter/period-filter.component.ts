import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Select, SelectChangeEvent } from 'primeng/select';
import { Period } from '@/models/period';
import { from } from 'linq-to-typescript';
import { UserPeriodParameter } from '@/models/user-period-parameter';
import { PeriodService } from '@/service/period.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'period-filter',
    imports: [Select, FormsModule],
    templateUrl: './period-filter.component.html',
    standalone: true
})
export class PeriodFilterComponent implements OnInit {
    private _periodParameter!: Period;

    get periodParameter(): Period {
        return this._periodParameter;
    }
    @Input()
    set periodParameter(value: Period) {
        this._periodParameter = value;
    }
    @Output()
    periodParameterChange = new EventEmitter<Period>();

    periods!: Period[];
    // currentPeriod!: Period;
    constructor(private periodService: PeriodService) {}
    @Output()
    onFilter = new EventEmitter<Period>();

    ngOnInit() {
        this.periods = this.periodService.getMonths();
        const period = new Date().getMonth() + 1;
        this.periodParameter = { ...from(this.periods).first((i) => i.value == period) };

        this.onFilter.emit(this.periodParameter);
    }

    protected filterMonth($event: SelectChangeEvent) {
        this.periodParameter = $event.value;
        this.onFilter.emit(this.periodParameter);
    }
}
