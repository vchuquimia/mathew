import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '@/service/user.service';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';
import { Toolbar } from 'primeng/toolbar';

@Component({
    selector: 'user-filter',
    standalone: true,
    imports: [SelectButton, FormsModule],
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
        this.userParameterChange.emit(this._userParameter);
    }
    @Output()
    userParameterChange = new EventEmitter<string>();

    @Output()
    onFilter = new EventEmitter<string>();

    filterUserOptions!: any[];

    @Input() emitOnFilterAfterInit: boolean = true;

    constructor(
        public userService: UserService,

    ) {}

    ngOnInit() {
            this.filterUserOptions = this.userService.getFamilyUsers().map(user => ({ name: user.name, value: user.name }));
            if(this.filterUserOptions.length > 1)
                this.filterUserOptions.push({ name: 'Todos' });

            this.userParameter = this.userService.currentUser?.name ?? '';
            console.log(this.userService.currentUser, "on user filter Init");
            if(this.emitOnFilterAfterInit){
                this.onFilter.emit(this.userService.currentUser?.name ?? '');
            }
    }

    protected filter() {
        this.onFilter.emit(this.userParameter);
        console.log(this.userParameter, "user filter");
    }
}
