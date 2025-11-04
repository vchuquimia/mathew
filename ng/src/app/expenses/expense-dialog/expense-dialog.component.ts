import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '@/models/category';
import { Expense } from '@/models/expense';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Select, SelectChangeEvent } from 'primeng/select';
import { Button } from 'primeng/button';
import { CurrencyPipe, NgClass } from '@angular/common';
import { DatePicker } from 'primeng/datepicker';
import { ExpensesService } from '@/service/expenses.service';
import { MessageService } from 'primeng/api';
import { Textarea } from 'primeng/textarea';
import { InputText } from 'primeng/inputtext';
import { ReportService } from '@/service/report.service';
import { ExpenseSummaryDto } from '@/models/expense-summary-dto';

@Component({
    standalone: true,
    selector: 'app-expense-dialog',
    imports: [Dialog, FormsModule, InputGroup, InputGroupAddon, Select, Button, NgClass, DatePicker, Textarea, InputText, CurrencyPipe],
    templateUrl: './expense-dialog.component.html',
    styleUrl: './expense-dialog.component.css'
})
export class ExpenseDialogComponent {
    @Output() onClose = new EventEmitter<Category>();
    @Input() categories!: Category[];

    @Input() expense!: Expense;

    @Input() showDialog: boolean = false;
    @Output() showDialogChange = new EventEmitter<boolean>();
    expenseSummary!: ExpenseSummaryDto |undefined;

    hideDialog() {
        this.showDialogChange.emit(false);
    }

    constructor(
        private expenseService: ExpensesService,
        private messageService: MessageService,
        private reportService: ReportService
    ) {}

    saveExpense() {
        // this.submitted = true;
        this.expenseService.save(this.expense).subscribe((data) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Expense Saved',
                life: 3000
            });
            // this.showDialog = false;
            this.expense = new Expense({});
            this.showDialogChange.emit(false);
            this.onClose.emit();
        });
    }

    onDatePreviousClick() {
        this.expense.date = new Date(this.expense.date.setDate(this.expense.date.getDate() - 1));
    }

    onDateNextClick() {
       this.expense.date = new Date(this.expense.date.setDate(this.expense.date.getDate() + 1));
    }

    protected onCategoryChange($event: SelectChangeEvent) {
        const startDate = new Date(this.expense.date.getFullYear(), this.expense.date.getMonth(), 1);
        const endDate = new Date(this.expense.date.getFullYear(), this.expense.date.getMonth() + 1, 0);
        this.reportService.getSummaryByDateRangeAndCategory(startDate, endDate, $event.value.id).subscribe((data) => {
            this.expenseSummary = data;
        });
    }
}
