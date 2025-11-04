import { Component, OnInit, ViewChild } from '@angular/core';
import { Category } from '@/models/category';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryService } from '@/service/category.service';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { CurrencyPipe, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { Toolbar } from 'primeng/toolbar';
import { BudgetService } from '@/service/budget.service';
import { Budget } from '@/models/budget';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { PeriodService } from '@/service/period.service';
import { from } from 'linq-to-typescript';
import { SelectButton } from 'primeng/selectbutton';
import { Period } from '@/models/period';
import { Tooltip } from 'primeng/tooltip';
import { IncomeService } from '@/service/income.service';
import { IncomeBudgetMontlySummaryDto } from '@/models/income-budget-montly-summary-dto';

@Component({
    selector: 'budget',
    standalone: true,
    imports: [Button, ConfirmDialog, Dialog, IconField, InputIcon, InputText, ReactiveFormsModule, TableModule, Textarea, Toolbar, NgClass, FormsModule, Select, CurrencyPipe, Toast, Tooltip],
    providers: [BudgetService, MessageService, ConfirmationService, CategoryService],
    templateUrl: './budget.component.html',
    styleUrl: './budget.component.css'
})
export class BudgetComponent implements OnInit {
    productDialog: boolean = false;

    public categories = new Array<Category>();
    category!: Category;

    budget!: Budget;
    budgets = new Array<Budget>();
    submitted: boolean = false;

    statuses!: any[];

    periods!: Period[];
    currentPeriod!: Period;
    incomeBudgetSummary!:IncomeBudgetMontlySummaryDto

    @ViewChild('dt') dt!: Table;

    constructor(
        private budgetService: BudgetService,
        private incomeService: IncomeService,
        private messageService: MessageService,
        private periodService: PeriodService,
        private confirmationService: ConfirmationService,
        private categoryService: CategoryService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.categoryService.getData().subscribe((data) => {
            this.categories = data;
        });

        this.periods = this.periodService.getMonths();
        const period = new Date().getMonth() + 1;
        this.currentPeriod = { ...from(this.periods).first((i) => i.value == period) };

        this.loadBudget();
    }

    loadBudget() {
        this.budgetService.getData(2025, this.currentPeriod.value).subscribe((data) => {
            this.budgets = data;
        });
        this.incomeService.getIncomeBudgetMontlySummaryDto(2025, this.currentPeriod.value).subscribe(
            (data) => {
                this.incomeBudgetSummary = data;
            }
        )
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.budget = { year: new Date().getFullYear() };
        this.submitted = false;
        this.productDialog = true;
    }

    edit(budget: Budget) {
        this.budget = { ...budget };
        this.productDialog = true;
    }

    deleteSelected() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.categoryService.delete(this.category).subscribe((data) => {
                    // this.selectedProducts = null;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Products Deleted',
                        life: 3000
                    });
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    delete(budget: Budget) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete budget for ' + budget.category?.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.budgetService.delete(this.budget).subscribe((data) => {
                    this.budget = {};
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
        this.budgetService.save(this.budget).subscribe((data) => {
            this.loadData();
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Budget Saved',
                life: 3000
            });
        });
        this.productDialog = false;
        this.budget = {};
    }
}
