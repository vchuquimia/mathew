import { Component, OnInit, ViewChild } from '@angular/core';
import { Category } from '@/models/category';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryService } from '@/service/category.service';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';

import { CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf, PercentPipe } from '@angular/common';
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
import { CategoryViewerComponent } from '@/shared/category-viewer/category-viewer.component';
import { TimeagoModule } from 'ngx-timeago';
import { UserAvatarComponent } from '@/shared/user-avatar/user-avatar.component';
import { ChartModule, UIChart } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';
import { Toast } from 'primeng/toast';
import { PeriodFilterComponent } from '@/shared/period-filter/period-filter.component';
import { Period } from '@/models/period';
import { from } from 'linq-to-typescript';
import { PeriodParameter } from '@/models/period-parameter';

@Component({
    selector: 'report',
    standalone: true,
    imports: [
        Button,
        ConfirmDialog,
        Dialog,
        ReactiveFormsModule,
        Toolbar,
        NgClass,
        FormsModule,
        CurrencyPipe,
        DataView,
        DatePipe,
        NgForOf,
        Avatar,
        DecimalPipe,
        CategoryViewerComponent,
        TimeagoModule,
        UserAvatarComponent,
        PercentPipe,
        ChartModule,
        FluidModule,
        Toast,
        PeriodFilterComponent
    ],
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
    protected barOptions: any;
    protected barData: any;

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

        this.initChart();
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
            this.initChart();
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
    public initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const filteredData = from(this.itemsSource).where((s) => s.totalAmount != undefined && s.totalAmount > 0).toArray();

        this.barData = {
            labels: filteredData.map((s) => s.category?.name ?? 'Sin categoría'),
            datasets: [
                {
                    label: 'Realizado',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                    borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                    data: filteredData.map((s) => s.totalAmount)
                },
                {
                    label: 'Presupuesto',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                    borderColor: documentStyle.getPropertyValue('--p-primary-200'),
                    data: filteredData.map((i) => i.budgetAmount)
                }
            ]
        };

        this.barOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    protected onPeriodFilter(param: PeriodParameter) {
        this.startDate = new Date(param.year, param.period.number-1, 1);
        this.endDate = new Date(param.year, param.period.number, 0);
        this.loadReport();
    }
}
