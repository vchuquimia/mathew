import { Component, Input } from '@angular/core';
import { UserService } from '@/service/user.service';
import { Avatar } from 'primeng/avatar';

@Component({
    standalone: true,
    selector: 'user-avatar',
    imports: [Avatar],
    templateUrl: './user-avatar.component.html',
})
export class UserAvatarComponent {
    @Input()
    disableUserFilter = false;
    get userName(): string {
        return this._userName;
    }
    @Input()
    set userName(value: string) {
        this._userName = value;
    }

    private _userName!: string;

    constructor(public userService: UserService) {}
}
