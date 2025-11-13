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
import { CurrencyPipe, DatePipe, NgClass, NgForOf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { Toolbar } from 'primeng/toolbar';
import { BudgetService } from '@/service/budget.service';
import { Budget } from '@/models/budget';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { PeriodService } from '@/service/period.service';
import { Tooltip } from 'primeng/tooltip';
import { IncomeService } from '@/service/income.service';
import { IncomeBudgetMontlySummaryDto } from '@/models/income-budget-montly-summary-dto';
import { BudgetCopyComponent } from '@/budget/budget-copy/budget-copy.component';
import { UserPeriodParameter } from '@/models/user-period-parameter';
import { UserFilterComponent } from '@/shared/user-filter/user-filter.component';
import { CategorySelectComponent } from '@/shared/category-select/category-select.component';
import { CategoryViewerComponent } from '@/shared/category-viewer/category-viewer.component';
import { DataView } from 'primeng/dataview';
import { TimeagoModule } from 'ngx-timeago';
import { UserAvatarComponent } from '@/shared/user-avatar/user-avatar.component';
import { PeriodFilterComponent } from '@/shared/period-filter/period-filter.component';
import { Period } from '@/models/period';

@Component({
    selector: 'budget',
    standalone: true,
    imports: [
        Button,
        ConfirmDialog,
        Dialog,
        ReactiveFormsModule,
        TableModule,
        Textarea,
        Toolbar,
        NgClass,
        FormsModule,
        Select,
        CurrencyPipe,
        Toast,
        Tooltip,
        BudgetCopyComponent,
        UserFilterComponent,
        CategorySelectComponent,
        CategoryViewerComponent,
        DataView,
        NgForOf,
        TimeagoModule,
        UserAvatarComponent,
        PeriodFilterComponent
    ],
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

    incomeBudgetSummary!: IncomeBudgetMontlySummaryDto[];

    showBudgetCopyDialog: boolean = false;

    @ViewChild('dt') dt!: Table;

    constructor(
        private budgetService: BudgetService,
        private incomeService: IncomeService,
        private messageService: MessageService,
        private periodService: PeriodService,
        private confirmationService: ConfirmationService,
        private categoryService: CategoryService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.categoryService.getData().subscribe((data) => {
            this.categories = data;
        });
    }

    currentUserPeriodParameter: UserPeriodParameter = new UserPeriodParameter();

    loadBudget(param: UserPeriodParameter) {
        this.budgetService.getData(param).subscribe((data) => {
            this.budgets = data;
        });
        this.incomeService.getIncomeBudgetMontlySummaryDto(param).subscribe((data) => {
            this.incomeBudgetSummary = data;
        });
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

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    delete(budget: Budget) {
        console.log(this.currentUserPeriodParameter);
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete budget for ' + budget.category?.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.budgetService.delete(budget).subscribe((data) => {
                    this.budget = {};
                    this.loadBudget(this.currentUserPeriodParameter);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Budget Deleted',
                        life: 3000
                    });
                });
            }
        });
    }

    save() {
        this.submitted = true;
        this.budgetService.save(this.budget).subscribe((data) => {
            this.loadBudget(this.currentUserPeriodParameter);
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

    protected openCopy() {
        this.showBudgetCopyDialog = true;
    }

    protected filter(param: string) {
        this.currentUserPeriodParameter.userName = param;
        this.loadBudget(this.currentUserPeriodParameter);
    }

    protected filterPeriod($event: Period) {
        this.currentUserPeriodParameter.period = $event;
        this.loadBudget(this.currentUserPeriodParameter);
    }
}
