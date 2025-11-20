import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '@/service/user.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const loginGuard: CanActivateFn = (route, state) => {
    const cookieService = inject(CookieService);
    const router = inject(Router);
    const userService = inject(UserService);

    if (!cookieService.check('user')) {
        return of(router.parseUrl('/login'));
    }

    const username = cookieService.get('user');
    console.log('User name from guard:', username);
    // return userService.getAllUsers().subscribe()?true:of(router.parseUrl('/login'));
    //
    return userService.getAllUsers().pipe(
        map(users => {
            return users.some(user => user.name === username)
                ? true
                : router.parseUrl('/login');
        }),
        catchError(() => of(router.parseUrl('/login')))
    );
};
