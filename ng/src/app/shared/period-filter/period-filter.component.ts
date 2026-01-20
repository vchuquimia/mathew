import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Select, SelectChangeEvent } from 'primeng/select';
import { Period } from '@/models/period';
import { from } from 'linq-to-typescript';
import { UserPeriodParameter } from '@/models/user-period-parameter';
import { PeriodService } from '@/service/period.service';
import { FormsModule } from '@angular/forms';
import { PeriodParameter } from '@/models/period-parameter';

@Component({
    selector: 'period-filter',
    imports: [Select, FormsModule],
    templateUrl: './period-filter.component.html',
    standalone: true
})
export class PeriodFilterComponent implements OnInit {
    private _periodParameter!: PeriodParameter;

    get periodParameter(): PeriodParameter {
        return this._periodParameter;
    }
    @Input()
    set periodParameter(value: PeriodParameter) {
        this._periodParameter = value;
        this.periodParameterChange.emit(value);
    }
    @Output()
    periodParameterChange = new EventEmitter<PeriodParameter>();

    periods!: Period[];
    years = [
        2025,2026
    ];
    // currentPeriod!: Period;
    constructor(private periodService: PeriodService) {}
    @Output()
    onFilter = new EventEmitter<PeriodParameter>();

    ngOnInit() {
        this.periods = this.periodService.getPeriods();
        const period = new Date().getMonth() + 1;

        this.periodParameter = new PeriodParameter(from(this.periods).first((i) => i.number == period), new Date().getFullYear());
        this.onFilter.emit(this.periodParameter);

        console.log(this.periodParameter, 'period filter Init');
    }

    protected filterMonth($event: Period) {
        this.periodParameter.period = $event;
        this.periodParameter = {... this.periodParameter };
        this.onFilter.emit(this.periodParameter);
        console.log(this.periodParameter, 'period filter');
    }

    protected filterYear($event: number) {
        this.periodParameter.year = $event;
        this.periodParameter = { ...this.periodParameter };
        this.onFilter.emit(this.periodParameter);
        console.log(this.periodParameter.year, 'year filter');
    }
}
