import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '@/models/category';
import { Expense } from '@/models/expense';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Select, SelectChangeEvent } from 'primeng/select';
import { Button } from 'primeng/button';
import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { DatePicker } from 'primeng/datepicker';
import { ExpensesService } from '@/service/expenses.service';
import { MessageService } from 'primeng/api';
import { Textarea } from 'primeng/textarea';
import { InputText } from 'primeng/inputtext';
import { ReportService } from '@/service/report.service';
import { ExpenseSummaryDto } from '@/models/expense-summary-dto';
import { CategorySelectComponent } from '@/shared/category-select/category-select.component';
import { CategoryService } from '@/service/category.service';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Reimbursement } from '@/models/reimbursement';
import { ReimbursementService } from '@/service/reimbursement.service';
import { data } from 'autoprefixer';

@Component({
    standalone: true,
    selector: 'app-expense-dialog',
    imports: [Dialog, FormsModule, InputGroup, InputGroupAddon, Select, Button, NgClass, DatePicker, Textarea, InputText, CurrencyPipe, CategorySelectComponent, ToggleSwitch, NgIf],
    templateUrl: './expense-dialog.component.html',
    styleUrl: './expense-dialog.component.css'
})
export class ExpenseDialogComponent {
    get isReimbursment(): boolean {
        return this._isReimbursment;
    }

    set isReimbursment(value: boolean) {
        this._isReimbursment = value;
        if (value) {
            this.reimbursment = new Reimbursement();
        }
    }
    private _expense: Expense = new Expense();
    get expense(): Expense {
        return this._expense;
    }
    @Input()
    set expense(value: Expense) {
        this._expense = value;
        if (this.expense !== undefined) this.loadReimbursement();
    }

    @Output() onClose = new EventEmitter<Category>();
    private _isReimbursment = false;
    reimbursment: Reimbursement = new Reimbursement();

    @Input() showDialog: boolean = false;
    @Output() showDialogChange = new EventEmitter<boolean>();
    expenseSummary!: ExpenseSummaryDto | undefined;
    public categories = new Array<Category>();

    hideDialog() {
        this.showDialogChange.emit(false);
    }

    constructor(
        private expenseService: ExpensesService,
        private messageService: MessageService,
        private categoryService: CategoryService,
        private reportService: ReportService,
        private reimbursementService: ReimbursementService
    ) {
        this.categoryService.getData().subscribe((data) => {
            this.categories = data;
        });
    }

    loadReimbursement() {
        this._isReimbursment = false;
        this.reimbursementService.getByExpense(this.expense.id).subscribe((reimbursement: Reimbursement) => {
            this.reimbursment = reimbursement;
            this._isReimbursment = reimbursement !== null;
        });
    }

    saveExpense() {
        // this.submitted = true;
        this.expenseService.save(this._expense).subscribe((data) => {
            if (this._isReimbursment) {
                this.reimbursment.expenseId = data.id;
                this.reimbursment.expense = data;
                this.reimbursementService.save(this.reimbursment).subscribe((reimbursement) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Guardado',
                        detail: 'Reembolso guardado con exito.',
                        life: 3000
                    });
                    this.reimbursment = new Reimbursement();
                });
            } else {
            }
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Gasto guardado con exito.',
                life: 3000
            });
            this._expense = new Expense();
            this._isReimbursment = false;
            this.showDialogChange.emit(false);
            this.onClose.emit();
        });
    }

    onDatePreviousClick() {
        this._expense.date = new Date(this._expense.date.setDate(this._expense.date.getDate() - 1));
    }

    onDateNextClick() {
        this._expense.date = new Date(this._expense.date.setDate(this._expense.date.getDate() + 1));
    }

    protected onCategoryChange($event: SelectChangeEvent) {
        const startDate = new Date(this._expense.date.getFullYear(), this._expense.date.getMonth(), 1);
        const endDate = new Date(this._expense.date.getFullYear(), this._expense.date.getMonth() + 1, 0);
        this.reportService.getSummaryByDateRangeAndCategory(startDate, endDate, $event.value.id).subscribe((data) => {
            this.expenseSummary = data;
        });
    }

    protected reimbursmentPercentageChange() {
        if (this._isReimbursment) {
            this.reimbursment.amount = ((this.reimbursment.percentage ?? 1) / 100) * (this._expense.amount ?? 1 ?? 1);
        }
    }
}
