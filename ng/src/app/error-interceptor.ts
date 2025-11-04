import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unknown error occurred!';
            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side error
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                // You can add more specific handling based on error.status here
                // e.g., redirect to login for 401, show a specific message for 404
            }
            console.error(errorMessage);
            messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage, sticky: true });
            // You might want to display a user-friendly message using a service (e.g., a Toastr service)
            return throwError(() => new Error(errorMessage)); // Re-throw the error to propagate it
        })
    );
};
