import { Component, OnInit } from '@angular/core';
import { User } from '@/models/user';
import { UserService } from '@/service/user.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { NgClass, NgForOf } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
    standalone: true,
    imports: [Toolbar, Button, DataView, NgClass, Dialog, FormsModule, ConfirmDialog, NgForOf, InputText],
    providers: [UserService, ConfirmationService]
})
export class UserComponent implements OnInit {
    users: User[] = [];
    user: User = new User();
    showDialog = false;
    submitted = false;

    constructor(
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getUsers().subscribe((users) => {
            this.users = users;
        });
    }

    openNew() {
        this.user = new User();
        this.showDialog = true;
        this.submitted = false;
    }

    edit(selectedUser: User) {
        this.user = { ...selectedUser };
        this.showDialog = true;
        this.submitted = false;
    }

    delete(selectedUser: User) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete user ' + selectedUser.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userService.delete(selectedUser).subscribe(() => {
                    this.loadUsers();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'User Deleted',
                        life: 3000
                    });
                });
            }
        });
    }

    save() {
        this.submitted = true;
        if (this.user.name && this.user.password) {
            if (this.userHasId(this.user)) {
                this.userService.save(this.user).subscribe(() => {
                    this.loadUsers();
                    this.showDialog = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'User Updated',
                        life: 3000
                    });
                });
            } else {
                this.userService.save(this.user).subscribe(() => {
                    this.loadUsers();
                    this.showDialog = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'User Saved',
                        life: 3000
                    });
                });
            }
        }
    }

    userHasId(user: User): boolean {
        // If your User model has an id property, check for it here
        // Otherwise, use a unique property (e.g., name)
        return !!user.name && this.users.some((u) => u.name === user.name);
    }

    hideDialog() {
        this.showDialog = false;
        this.submitted = false;
    }
}
