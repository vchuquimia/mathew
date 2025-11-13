import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '@/service/user.service';

export const loginGuard: CanActivateFn = (route, state) => {
    const cookieService = inject(CookieService);

    const router = inject(Router);
    const userService = inject(UserService);
    if (cookieService.check('user')) {
        if (userService.users.some((user) => user.name === cookieService.get('user')))
            return true;
        else
            return router.parseUrl('/login');
    }
    else {
        return router.parseUrl('/login');
    }
};
