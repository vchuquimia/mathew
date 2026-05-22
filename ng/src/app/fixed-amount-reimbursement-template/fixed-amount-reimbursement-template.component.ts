import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { CurrencyPipe, NgClass, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { Toolbar } from 'primeng/toolbar';
import { Toast } from 'primeng/toast';
import { DataView } from 'primeng/dataview';
import { UserAvatarComponent } from '@/shared/user-avatar/user-avatar.component';
import { UserPeriodParameter } from '@/models/user-period-parameter';
import { FixedAmountReimbursementTemplateService } from '@/service/fixed-amount-reimbursement-template.service';
import { FixedAmountReimbursementTemplate } from '@/models/fixed-amount-reimbursement-template';

@Component({
    selector: 'fixed-amount-reimbursement-template',
    standalone: true,
    imports: [Button, ConfirmDialog, Dialog, FormsModule, Textarea, Toolbar, NgClass, CurrencyPipe, Toast, DataView, NgForOf, UserAvatarComponent],
    providers: [FixedAmountReimbursementTemplateService, MessageService, ConfirmationService],
    templateUrl: './fixed-amount-reimbursement-template.component.html',
    styleUrl: './fixed-amount-reimbursement-template.component.css'
})
export class FixedAmountReimbursementTemplateComponent implements OnInit {

    @Output() currentUserPeriodParameterChange = new EventEmitter<UserPeriodParameter>();

    showDialog: boolean = false;
    template: FixedAmountReimbursementTemplate = {};
    templates = new Array<FixedAmountReimbursementTemplate>();
    submitted: boolean = false;

    constructor(
        private templateService: FixedAmountReimbursementTemplateService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadTemplates();
    }

    openNew() {
        this.template = {
            numberOfPayments: 1,
            fixedAmount: 0
        };
        this.submitted = false;
        this.showDialog = true;
    }

    edit(template: FixedAmountReimbursementTemplate) {
        this.template = { ...template };
        this.showDialog = true;
    }

    hideDialog() {
        this.showDialog = false;
        this.submitted = false;
    }

    delete(template: FixedAmountReimbursementTemplate) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete template ' + template.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.templateService.delete(template).subscribe(() => {
                    this.template = {};
                    this.loadTemplates();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Template Deleted',
                        life: 3000
                    });
                });
            }
        });
    }

    save() {
        this.submitted = true;
        this.templateService.save(this.template).subscribe(() => {
            this.loadTemplates();
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Template Saved',
                life: 3000
            });
        });
        this.showDialog = false;
        this.template = {};
    }

    loadTemplates() {
        this.templateService.getAll().subscribe((data) => {
            this.templates = data;
        });
    }
}

