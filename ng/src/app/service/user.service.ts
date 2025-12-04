import { Injectable } from '@angular/core';
import { User } from '@/models/user';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(
        private cookieService: CookieService,
        private http: HttpClient
    ) {
        this.getUsers()
            .pipe(
                map((users) => {
                    this.allUsers = users;
                    console.log(users, 'Loaded users in UserService');
                    console.log('checking cookie for user', this.cookieService.check('user'));
                    if (this.cookieService.check('user')) {
                        console.log('User cookie found');
                        this.CurrentUser.next(this.allUsers.find((user) => user.name === this.cookieService.get('user')) ?? new User());
                        console.log(this.CurrentUser.value, 'Current user set in UserService Constructor from cookie:');
                    } else console.log('No user cookie found');
                })
            )
            .subscribe();
        console.log('End of UserService constructor');
    }

    public allUsers = new Array<User>();
    //     = [
    //     { name: 'vh', password: '1611', colorClass:'bg-yellow-100!', familyId : 1 },
    //     { name: 'mp', password: '0910',colorClass:'bg-pink-100!', familyId : 1}
    // ];

    public getColorClass(user: string): string {
        return this.allUsers.find((u) => u.name === user)?.colorClass ?? '';
    }
    //private _currentUser = new User();

    public CurrentUser: BehaviorSubject<User|null> = new BehaviorSubject<User|null>(null);
    // set currentUser(user: User) {
    //     this._currentUser = user;
    // }
    //
    // get currentUser(): User {
    //     return this._currentUser;
    // }

    public getFamilyUsers(): Observable<User[]> {
        if (this.allUsers.length > 0) {
            console.log('Users found in AllUsers array, returning from there.');
            return of(this.allUsers.filter((u) => u.familyId === this.CurrentUser.value?.familyId));
        } else {
            console.log(this.CurrentUser.value, 'No users found in AllUsers array, getting from API instead.');
            return this.getUsers(this.CurrentUser.value?.familyId);
        }
    }

    public setCurrentUser(user: User) {
        this.CurrentUser.next(user);
        this.cookieService.set('user', this.CurrentUser.value?.name ?? '', 1300, '/', '', false, 'Strict');
    }
    public clearCurrentUser() {
        this.CurrentUser.next(null);
        this.cookieService.delete('user');
    }

    // --- API methods similar to IncomeService ---
    getUsers(familyId?: number): Observable<User[]> {
        return this.http.get<User[]>(`${environment.apiUrl}user?familyId=${familyId ?? ''}`);
    }

    save(user: User): Observable<User> {
        return this.http.post<User>(`${environment.apiUrl}user`, user);
    }

    delete(user: User): Observable<User> {
        return this.http.delete<User>(`${environment.apiUrl}user`, { body: user });
    }

    getAllUsers(): Observable<User[]> {
        console.log('get All Users User Service');
        if (this.allUsers.length > 0) return of(this.allUsers);
        return this.getUsers();
    }

    isAdmin() {
        return this.CurrentUser.value?.name === 'vh';
    }
}
