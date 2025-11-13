import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryService } from '@/service/category.service';
import { ExpensesService } from '@/service/expenses.service';
import { UserService } from '@/service/user.service';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Select, SelectChangeEvent } from 'primeng/select';
import { Period } from '@/models/period';
import { PeriodService } from '@/service/period.service';
import { Toolbar } from 'primeng/toolbar';
import { UserPeriodParameter } from '@/models/user-period-parameter';
import { from } from 'linq-to-typescript';

@Component({
    selector: 'user-filter',
    standalone: true,
    imports: [SelectButton, FormsModule, Card, Select, Toolbar],
    templateUrl: './user-filter.component.html'
})
export class UserFilterComponent implements OnInit {
    private _userParameter: string = '';

    get userParameter(): string {
        return this._userParameter;
    }
    @Input()
    set userParameter(value: string) {
        this._userParameter = value;
    }
    @Output()
    userParameterChange = new EventEmitter<string>();

    @Output()
    onFilter = new EventEmitter<string>();
    // private _currentUserOption!: string;
    // get currentUserOption(): string {
    //     return this._currentUserOption;
    // }
    // @Input()
    // set currentUserOption(value: string) {
    //     this._currentUserOption = value;
    //     this.currentUserOptionChange.emit(value);
    // }
    // @Output()
    // currentUserOptionChange = new EventEmitter<string>();


    filterUserOptions!: any[];

    @Input() showPeriodFilter: boolean = true;

    constructor(
        public userService: UserService,

    ) {}

    ngOnInit() {
        this.filterUserOptions = this.userService.users.map((user) => ({ name: user.name, value: user.name }));
        this.filterUserOptions.push({ name: 'Todo' });


        // this.userPeriodParameter = new UserPeriodParameter(this.currenMonth.value, 2025, this.userService.currentUser?.name ?? '');
        this.onFilter.emit(this.userService.currentUser?.name ?? '');
    }

    protected filter() {
        this.onFilter.emit(this.userParameter);
    }
    //
    // protected filterMonth($event: SelectChangeEvent) {
    //     this.userParameter.month = $event.value.value;
    //     this.filter();
    // }
}
