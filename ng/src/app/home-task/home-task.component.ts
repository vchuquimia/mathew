import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { RatingModule } from 'primeng/rating';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { HomeTaskService } from '@/service/home-task.service';
import { HomeTask } from '@/models/home-task';
import { UserService } from '@/service/user.service';
import { User } from '@/models/user';
import { PeriodFilterComponent } from '@/shared/period-filter/period-filter.component';
import { UserFilterComponent } from '@/shared/user-filter/user-filter.component';

@Component({
    selector: 'app-home-task',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        DialogModule,
        ConfirmDialogModule,
        DataViewModule,
        TagModule,
        CheckboxModule,
        RatingModule,
        DatePickerModule,
        DividerModule,
        UserFilterComponent
    ],
    templateUrl: './home-task.component.html',
    providers: [MessageService, ConfirmationService]
})
export class HomeTaskComponent implements OnInit {
    taskDialog: boolean = false;
    tasks: HomeTask[] = [];
    task: HomeTask = {} as HomeTask;
    submitted: boolean = false;
    users: User[] = [];
    currentUserName = '';

    constructor(
        private homeTaskService: HomeTaskService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.currentUserName = this.userService.CurrentUser.value?.name || 'Todos';
        this.loadData();
        this.loadUsers();
    }

    loadData() {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        if (familyId) {
            this.homeTaskService.getTasks(familyId, undefined, this.currentUserName).subscribe((data) => {
                this.tasks = data;
                // Ensure dates are Date objects
                this.tasks.forEach((t) => (t.dueDate = new Date(t.dueDate)));
            });
        }
    }

    loadUsers() {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        if (familyId) {
            this.userService.getUsers(familyId).subscribe((data) => {
                this.users = data;
            });
        }
    }

    openNew() {
        this.task = <HomeTask>{
            id: 0,
            description: '',
            done: false,
            dueDate: new Date(),
            rating: 0,
            ratingComment: '',
            userName: '',
            familyId: this.userService.CurrentUser.value?.familyId || 0
        };
        this.submitted = false;
        this.taskDialog = true;
    }

    editTask(task: HomeTask) {
        this.task = { ...task };
        // Ensure date is Date object for DatePicker
        if (this.task.dueDate) {
            this.task.dueDate = new Date(this.task.dueDate);
        }
        this.taskDialog = true;
    }

    deleteTask(task: HomeTask) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres eliminar esta tarea?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.homeTaskService.deleteTask(task.id).subscribe(() => {
                    this.tasks = this.tasks.filter((val) => val.id !== task.id);
                    this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Tarea Eliminada', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.taskDialog = false;
        this.submitted = false;
    }

    saveTask() {
        this.submitted = true;

        if (this.task.description?.trim()) {
            if (this.task.id) {
                this.homeTaskService.updateTask(this.task).subscribe((data) => {
                    const index = this.tasks.findIndex((t) => t.id === data.id);
                    data.dueDate = new Date(data.dueDate); // Ensure date object
                    this.tasks[index] = data;
                    this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Tarea Actualizada', life: 3000 });
                    this.taskDialog = false;
                });
            } else {
                this.homeTaskService.createTask(this.task).subscribe((data) => {
                    data.dueDate = new Date(data.dueDate); // Ensure date object
                    this.tasks.push(data);
                    this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Tarea Creada', life: 3000 });
                    this.taskDialog = false;
                });
            }
        }
    }

    toggleDone(task: HomeTask) {
        this.homeTaskService.updateTask(task).subscribe((data) => {
            const index = this.tasks.findIndex((t) => t.id === data.id);
            data.dueDate = new Date(data.dueDate);
            this.tasks[index] = data;
        });
    }

    isOverdue(task: HomeTask): boolean {
        return !task.done && new Date(task.dueDate) < new Date();
    }

    protected userFilter($event: string) {
        this.loadData();
    }
}

