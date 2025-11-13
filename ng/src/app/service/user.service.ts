import { Injectable } from '@angular/core';
import { User } from '@/models/user';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    constructor(private cookieService: CookieService) {
      if (this.cookieService.check('user')){
        this._currentUser = this.users.find((user) => user.name === this.cookieService.get('user'))?? new User();
      }
    }

    public users: Array<User> = [
        { name: 'vh', password: '1611', colorClass:'bg-yellow-100!' },
        { name: 'mp', password: '0910' ,colorClass:'bg-pink-100!'}
    ];

    public getColorClass(user:string):string{
        return this.users.find((u) => u.name === user)?.colorClass ?? '';
    }
    private _currentUser = new User();

    set currentUser(user: User) {
        this._currentUser = user;
    }

    get currentUser(): User {
        return this._currentUser;

    }

    public setCurrentUser(user: User) {
        this.currentUser = user;
        this.cookieService.set('user', this.currentUser.name ?? '' , 600, '/', '', false, 'Strict');
    }
    public clearCurrentUser() {
        this.currentUser = new User();
        this.cookieService.delete('user');
    }
}
