import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '@/service/user.service';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const userService = inject(UserService);
    const messageService = inject(MessageService);

    if (userService.isAdmin()) {
        return of(true);
    } else {
        messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No tienes permisos para ingresar a esta página.'
        })
        return of(false);
    }
};

