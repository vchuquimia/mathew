import { Injectable } from '@angular/core';
import { User } from '@/models/user';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    constructor(private cookieService: CookieService, private http: HttpClient) {
      if (this.cookieService.check('user')){
        this._currentUser = this.users.find((user) => user.name === this.cookieService.get('user'))?? new User();
      }
    }

    public users: Array<User> = [
        { name: 'vh', password: '1611', colorClass:'bg-yellow-100!', familyId : 1 },
        { name: 'mp', password: '0910' ,colorClass:'bg-pink-100!', familyId : 1}
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

    // --- API methods similar to IncomeService ---
    getUsers(): Observable<User[]> {
        const familyId = this.currentUser?.familyId || 0;
        return this.http.get<User[]>(`${environment.apiUrl}user?familyId=${familyId}`);
    }

    save(user: User): Observable<User> {
        const familyId = this.currentUser?.familyId || 0;
        user.familyId = familyId;
        return this.http.post<User>(`${environment.apiUrl}user`, user);
    }

    delete(user: User): Observable<User> {
        const familyId = this.currentUser?.familyId || 0;
        user.familyId = familyId;
        return this.http.delete<User>(`${environment.apiUrl}user`, { body: user });
    }

    getUserByName(name: string): Observable<User> {
        const familyId = this.currentUser?.familyId || 0;
        return this.http.get<User>(`${environment.apiUrl}user/byname?name=${name}&familyId=${familyId}`);
    }
}
