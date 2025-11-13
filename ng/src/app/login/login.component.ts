import { Component ,ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Button } from 'primeng/button';
import { UserService } from '@/service/user.service';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoFocus } from 'primeng/autofocus';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';

@Component({
    selector: 'app-login.component',
    providers: [CookieService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    imports: [FormsModule, ReactiveFormsModule, AutoFocus, Button, Checkbox, InputText, Password, RouterLink]
})
export class LoginComponent {
    codeForm: FormGroup;

    constructor(
        private userService: UserService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private location: Location
    ) {
        this.codeForm = this.fb.group({
            digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
            digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
            digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
            digit4: ['', [Validators.required, Validators.pattern('[0-9]')]]
        });
    }

    onInput(event: any, nextInput: HTMLInputElement | null): void {
        if (event.target.value.length === 1) {
            if (nextInput) nextInput.focus();
            else this.onSubmit();
        }
    }

    // Handle backspace to move focus to the previous input field
    onKeyUp(event: KeyboardEvent, prevInput: HTMLInputElement | null, currentInput: HTMLInputElement): void {
        if (event.key === 'Backspace' && currentInput.value.length === 0 && prevInput) {
            prevInput.focus();
        }
    }

    onSubmit(): void {
        const code = Object.values(this.codeForm.value).join('');

        if (this.userService.users.some((user) => user.password == code.toString())) {
            const user = this.userService.users.find((user) => user.password == code.toString());
            if (user != undefined) {
                this.userService.setCurrentUser(user);
                this.location.back();
            }
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Code' });
        }
    }
}
