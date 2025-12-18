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
import { DividerModule } from 'primeng/divider';
import { RatingModule } from 'primeng/rating';
import { HomeProjectService } from '@/service/home-project.service';
import { HomeProject} from '@/models/home-project';
import { ProjectStatus } from '@/models/project-status';
import { ProjectFeedback } from '@/models/project-feedback';
import { HomeProjectTask } from '@/models/home-project-task';
import { HomeProjectLog } from '@/models/home-project-log';
import { UserService } from '@/service/user.service';

@Component({
    selector: 'app-home-project',
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
        DividerModule,
        RatingModule
    ],
    templateUrl: './home-project.component.html',
    providers: [MessageService, ConfirmationService]
})
export class HomeProjectComponent implements OnInit {
    projectDialog: boolean = false;
    feedbackDialog: boolean = false;
    projects: HomeProject[] = [];
    project: HomeProject = {} as HomeProject;
    submitted: boolean = false;

    statuses = [
        { label: 'Nuevo', value: ProjectStatus.New },
        { label: 'En Progreso', value: ProjectStatus.InProgress },
        { label: 'Completado', value: ProjectStatus.Completed },
        { label: 'En Espera', value: ProjectStatus.OnHold }
    ];


    newTaskDescription: string = '';
    newLogDescription: string = '';

    constructor(
        private homeProjectService: HomeProjectService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;

        if (familyId) {
            this.homeProjectService.getProjects(familyId).subscribe(data => {
                this.projects = data;
            });
        }
    }

    openNew() {
        this.project = {
            id: 0,
            name: '',
            familyId: this.userService.CurrentUser.value?.familyId || 0,
            status: ProjectStatus.New,
            description: '',
            feedback: ProjectFeedback.None,
            comment: '',
            creationDate: new Date(),
            logs: [],
            tasks: []
        };
        this.submitted = false;
        this.projectDialog = true;
    }

    editProject(project: HomeProject) {
        this.project = { ...project };
        this.projectDialog = true;
    }

    openFeedback(project: HomeProject) {
        this.project = { ...project };
        this.feedbackDialog = true;
    }

    deleteProject(project: HomeProject) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres eliminar ' + project.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.homeProjectService.deleteProject(project.id).subscribe(() => {
                    this.projects = this.projects.filter(val => val.id !== project.id);
                    this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Proyecto Eliminado', life: 3000 });
                });
            }
        });
    }

    hideDialog() {
        this.projectDialog = false;
        this.feedbackDialog = false;
        this.submitted = false;
    }

    saveProject() {
        this.submitted = true;

        if (this.project.name?.trim()) {
            if (this.project.id) {
                this.homeProjectService.updateProject(this.project).subscribe(data => {
                    const index = this.projects.findIndex(p => p.id === data.id);
                    this.projects[index] = data;
                    this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Proyecto Actualizado', life: 3000 });
                    this.projectDialog = false;
                });
            } else {
                this.homeProjectService.createProject(this.project).subscribe(data => {
                    this.projects.push(data);
                    this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Proyecto Creado', life: 3000 });
                    this.projectDialog = false;
                });
            }
        }
    }

    saveFeedback() {
        this.homeProjectService.updateProject(this.project).subscribe(data => {
            const index = this.projects.findIndex(p => p.id === data.id);
            this.projects[index] = data;
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Feedback Guardado', life: 3000 });
            this.feedbackDialog = false;
        });
    }

    addTask() {
        if (!this.newTaskDescription.trim()) return;

        const task: HomeProjectTask = {
            id: 0,
            homeProjectId: this.project.id,
            description: this.newTaskDescription,
            creationDate: new Date(),
            done: false
        };

        if (this.project.id) {
            this.homeProjectService.addTask(task).subscribe(data => {
                this.project.tasks.push(data);
                this.newTaskDescription = '';
            });
        } else {
            // If project is not saved yet, we can't add tasks to DB.
            // For simplicity, let's require saving project first or handle it in memory if needed.
            // But the requirement says "add tasks", usually implies immediate action or part of the form.
            // If it's part of the form, we should just add to the array and save all together?
            // The backend API for createProject doesn't seem to handle nested logs/tasks creation automatically unless configured.
            // Let's assume we add to array and if project exists we save, if not we just keep in array?
            // But the service calls `addTask` which hits the API. So project must exist.
            // I will disable adding tasks/logs if project is new.
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Guarda el proyecto antes de agregar tareas' });
        }
    }

    toggleTask(task: HomeProjectTask) {
        this.homeProjectService.updateTask(task).subscribe();
    }

    deleteTask(task: HomeProjectTask) {
        this.homeProjectService.deleteTask(task.id).subscribe(() => {
            this.project.tasks = this.project.tasks.filter(t => t.id !== task.id);
        });
    }

    addLog() {
        if (!this.newLogDescription.trim()) return;

        const log: HomeProjectLog = {
            id: 0,
            homeProjectId: this.project.id,
            description: this.newLogDescription,
            creationDate: new Date()
        };

        if (this.project.id) {
            this.homeProjectService.addLog(log).subscribe(data => {
                this.project.logs.push(data);
                this.newLogDescription = '';
            });
        } else {
             this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Guarda el proyecto antes de agregar registros' });
        }
    }

    getStatusLabel(status: ProjectStatus) {
        return this.statuses.find(s => s.value === status)?.label;
    }
}
