import { Injectable } from '@angular/core';
import { User } from '@/models/user';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    constructor(private cookieService: CookieService, private http: HttpClient) {
        this.getUsers().subscribe((users) => {
          this.allUsers = users;
          if (this.cookieService.check('user')){
            this._currentUser = this.allUsers.find((user) => user.name === this.cookieService.get('user'))?? new User();
          }
        });

    }

    public allUsers = new Array<User>();
    //     = [
    //     { name: 'vh', password: '1611', colorClass:'bg-yellow-100!', familyId : 1 },
    //     { name: 'mp', password: '0910' ,colorClass:'bg-pink-100!', familyId : 1}
    // ];

    public getColorClass(user:string):string{
        return this.allUsers.find((u) => u.name === user)?.colorClass ?? '';
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
        this.cookieService.set('user', this.currentUser.name ?? '' , 1300, '/', '', false, 'Strict');
    }
    public clearCurrentUser() {
        this.currentUser = new User();
        this.cookieService.delete('user');
    }

    // --- API methods similar to IncomeService ---
    getUsers(familyId?:number): Observable<User[]> {
        return this.http.get<User[]>(`${environment.apiUrl}user?familyId=${familyId??''}`);
    }


    save(user: User): Observable<User> {
        return this.http.post<User>(`${environment.apiUrl}user`, user);
    }

    delete(user: User): Observable<User> {
        return this.http.delete<User>(`${environment.apiUrl}user`, { body: user });
    }

    getAllUsers():Observable<User[]>{
        if(this.allUsers.length > 0) return of(this.allUsers);
        return this.getUsers();
    }
}
