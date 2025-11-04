import { Component, OnInit, ViewChild } from '@angular/core';
import { Category } from '@/models/category';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryService } from '@/service/category.service';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';


import { InputText } from 'primeng/inputtext';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Toolbar } from 'primeng/toolbar';
import { BudgetService } from '@/service/budget.service';

import { ExpenseSummaryDto } from '@/models/expense-summary-dto';
import { ReportService } from '@/service/report.service';
import { DatePicker } from 'primeng/datepicker';
import { DataView } from 'primeng/dataview';
import { Expense } from '@/models/expense';
import { ExpensesService } from '@/service/expenses.service';
import { Avatar } from 'primeng/avatar';

@Component({
    selector: 'report',
    standalone: true,
    imports: [Button, ConfirmDialog, Dialog, ReactiveFormsModule, TableModule, Toolbar, NgClass, FormsModule, CurrencyPipe, DatePicker, DataView, DatePipe, NgForOf, Avatar, DecimalPipe],
    providers: [BudgetService, MessageService, ConfirmationService, CategoryService],
    templateUrl: './report.component.html',
    styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
    productDialog: boolean = false;

    public categories = new Array<Category>();

    itemsSource = new Array<ExpenseSummaryDto>();
    currentSummaryDto!: ExpenseSummaryDto;
    expenses!: Expense[];
    startDate!: Date;
    endDate!: Date;
    showExpenseDetail: boolean = false;

    constructor(
        private reportService: ReportService,
        private confirmationService: ConfirmationService,
        private expenseService: ExpensesService,
        private messageService: MessageService,
        private categoryService: CategoryService
    ) {}

    ngOnInit() {
        this.loadData();
        const now = new Date();
        this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    loadData() {
        this.categoryService.getData().subscribe((data) => {
            this.categories = data;
        });
    }

    loadReport() {
        this.reportService.getExpenseSummaryByDateRange(this.startDate, this.endDate).subscribe((data) => {
            this.itemsSource = data;

            const categoryMap = new Map(this.categories.map((c) => [c.id, c]));

            this.itemsSource.forEach((exp) => {
                exp.category = categoryMap.get(exp.categoryId) || undefined;
            });

            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Report Generated',
                life: 3000
            });
        });
    }

    openExpensesDetail(summaryDto: ExpenseSummaryDto, startDate: Date, endDate: Date) {
        this.currentSummaryDto = { ...summaryDto };
        this.showExpenseDetail = true;
        this.expenseService.getByDateRangeAndCategory(summaryDto.categoryId ?? 0, startDate, endDate).subscribe((data) => {
            this.expenses = data;
        });
    }
}
