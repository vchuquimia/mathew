import { Component, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { CurrencyPipe, DatePipe, NgClass, NgForOf } from '@angular/common';
import { DataView } from 'primeng/dataview';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Reimbursement } from '@/models/reimbursement';
import { ReimbursementService } from '@/service/reimbursement.service';
import { ExpenseDialogComponent } from '@/expenses/expense-dialog/expense-dialog.component';
import { Expense } from '@/models/expense';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { from } from 'linq-to-typescript';
import { PeriodFilterComponent } from '@/shared/period-filter/period-filter.component';
import { UserFilterComponent } from '@/shared/user-filter/user-filter.component';
import { Checkbox } from 'primeng/checkbox';
import { UndoIcon } from 'primeng/icons';
import { SelectButton } from 'primeng/selectbutton';

@Component({
    selector: 'app-reimbursement.component',
    imports: [
        Button,
        ConfirmDialog,
        CurrencyPipe,
        DataView,
        Dialog,
        FormsModule,
        InputText,
        NgForOf,
        Textarea,
        Toast,
        Toolbar,
        NgClass,
        DatePipe,
        ExpenseDialogComponent,
        ToggleSwitch,
        PeriodFilterComponent,
        UserFilterComponent,
        Checkbox,
        SelectButton
    ],
    templateUrl: './reimbursement.component.html',
    providers: [ReimbursementService, MessageService, ConfirmationService]
})
export class ReimbursementComponent {
    showDialog: boolean = false;

    reimbursement: Reimbursement = new Reimbursement();
    reimbursements = new Array<Reimbursement>();
    submitted: boolean = false;
    showExpenseDialog = false;
    totalReimbursement!: number;

    currentUser!: string;
    pendingOnly? = true;

    constructor(
        private reimbursementService: ReimbursementService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.reimbursement.expense = new Expense();
        this.filterOptions = [
            { name: 'Pendientes', value: true },
            { name: 'Reembolsados', value: false },
            { name: 'Todos', value: undefined }
        ];
    }

    filterOptions!: any[];

    loadData() {
        console.log(this.currentUser, 'loading Reimbursements');
        this.reimbursementService.getData(this.currentUser, this.pendingOnly).subscribe((data) => {
            this.reimbursements = data;
            this.totalReimbursement = from(this.reimbursements).sum((i) => i.amount ?? 0);
        });
    }

    openNew() {
        this.reimbursement = new Reimbursement();
        this.submitted = false;
        this.showDialog = true;
    }

    hideDialog() {
        this.showDialog = false;
        this.showExpenseDialog = false;
        this.submitted = false;
        this.loadData();
    }

    delete(reimbursement: Reimbursement) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete incomeSource for ' + reimbursement.amount + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.reimbursementService.delete(reimbursement).subscribe((data) => {
                    this.reimbursement = new Reimbursement();
                    this.loadData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Deleted',
                        life: 3000
                    });
                });
            }
        });
    }

    save() {
        this.submitted = true;
        this.reimbursementService.save(this.reimbursement).subscribe((data) => {
            this.loadData();
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'incomeSource Saved',
                life: 3000
            });
        });
        this.showDialog = false;
        this.reimbursement = new Reimbursement();
    }

    protected edit(reim: Reimbursement) {
        this.reimbursement = { ...reim };
        if (this.reimbursement.expense !== undefined) {
            this.reimbursement.expense.date = new Date(this.reimbursement?.expense?.date ?? new Date());
        }
        this.showDialog = true;
    }

    protected editExpense(reim: Reimbursement) {
        this.reimbursement = { ...reim };
        if (this.reimbursement.expense !== undefined) {
            this.reimbursement.expense.date = new Date(this.reimbursement?.expense?.date ?? new Date());
        }
        this.showExpenseDialog = true;
    }

    protected readonly Expense = Expense;

    protected percentChange() {
        // if(this.reimbursement !== undefined) {
        this.reimbursement.amount = ((this.reimbursement.percentage ?? 1) / 100) * (this.reimbursement.expense?.amount ?? 1 ?? 1);
        // }
    }

    protected userFilter(param: string) {
        console.log('userFilter', param);
        this.currentUser = param;
        this.loadData();
    }

    protected filterPending() {
        console.log('filterPending', this.pendingOnly);
        this.loadData();
    }

    protected reimburseExpense(reim: any) {
        this.reimbursementService.reimburseExpense(reim).subscribe((data) => {
            this.loadData();
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Reembolso procesado, una ingreso fué generado por el valor total.',
                life: 3000
            });
        });
    }
}
