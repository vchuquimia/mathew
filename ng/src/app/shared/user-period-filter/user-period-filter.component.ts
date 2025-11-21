import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '@/service/user.service';
import { PeriodService } from '@/service/period.service';
import { Period } from '@/models/period';
import { UserPeriodParameter } from '@/models/user-period-parameter';
import { SelectButton } from 'primeng/selectbutton';
import { Select, SelectChangeEvent } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { from } from 'linq-to-typescript';
import { PeriodFilterComponent } from '@/shared/period-filter/period-filter.component';
import { Toolbar } from 'primeng/toolbar';
import { UserFilterComponent } from '@/shared/user-filter/user-filter.component';

@Component({
    selector: 'user-period-filter',
    standalone: true,
    imports: [SelectButton, Select, FormsModule, PeriodFilterComponent, Toolbar, UserFilterComponent],
    templateUrl: './user-period-filter.component.html'
})
export class UserPeriodFilterComponent implements OnInit {
    private _parameter: UserPeriodParameter = new UserPeriodParameter();
    get parameter(): UserPeriodParameter {
        return this._parameter;
    }
    @Input()
    set parameter(value: UserPeriodParameter) {
        this._parameter = value;
        this.parameterChange.emit(this._parameter);
    }
    @Output() parameterChange = new EventEmitter<UserPeriodParameter>();

    @Output() onFilter = new EventEmitter<UserPeriodParameter>();


    constructor(
        public userService: UserService,
        public periodService: PeriodService
    ) {}

    ngOnInit() {

    }

    filterUser(userName:string) {
        this.parameter.userName = userName;
        this.parameter = {...this.parameter};
        this.onFilter.emit(this.parameter);
    }

    filterPeriod($event: Period) {
        this.parameter.period = $event;
        this.parameter = {...this.parameter};
        this.onFilter.emit(this.parameter);
    }
}

