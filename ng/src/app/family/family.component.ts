import { Component, OnInit } from '@angular/core';
import { Family } from '@/models/family';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { DatePipe, NgForOf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import { DataView } from 'primeng/dataview';
import { Dialog } from 'primeng/dialog';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputText } from 'primeng/inputtext';
import { FamilyService } from '@/service/family.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-family',
    templateUrl: './family.component.html',
    standalone: true,
    imports: [CommonModule, Toolbar, Button, DataView, NgClass, Dialog, FormsModule, ConfirmDialog, NgForOf, InputText, DatePipe],
    providers: [ConfirmationService, DatePipe]
})
export class FamilyComponent implements OnInit {
    families: Family[] = [];
    family: Family = new Family();
    showDialog = false;
    submitted = false;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private familyService: FamilyService
    ) {}

    ngOnInit() {
        this.loadFamilies();
    }

    loadFamilies() {
        this.familyService.getFamilies().subscribe((families) => {
            this.families = families;
        });
    }

    openNew() {
        this.family = new Family();
        this.showDialog = true;
        this.submitted = false;
    }

    edit(selectedFamily: Family) {
        this.family = { ...selectedFamily };
        this.showDialog = true;
        this.submitted = false;
    }

    delete(selectedFamily: Family) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete family ' + selectedFamily.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.familyService.delete(selectedFamily).subscribe(() => {
                    this.loadFamilies();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Family Deleted',
                        life: 3000
                    });
                });
            }
        });
    }

    save() {
        this.submitted = true;
        if (this.family.name) {
            this.familyService.save(this.family).subscribe(() => {
                this.loadFamilies();
                this.showDialog = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: this.familyHasId(this.family) ? 'Family Updated' : 'Family Saved',
                    life: 3000
                });
            });
        }
    }

    familyHasId(family: Family): boolean {
        return !!family.name && this.families.some((f) => f.name === family.name);
    }

    hideDialog() {
        this.showDialog = false;
        this.submitted = false;
    }
}
