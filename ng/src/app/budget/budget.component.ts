import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Category } from '@/models/category';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryService } from '@/service/category.service';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { CurrencyPipe, NgClass, NgForOf } from '@angular/common';
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
import { FinantialSummaryDto } from '@/models/finantial-summary-dto';
import { BudgetCopyComponent } from '@/budget/budget-copy/budget-copy.component';
import { UserPeriodParameter } from '@/models/user-period-parameter';
import { UserFilterComponent } from '@/shared/user-filter/user-filter.component';
import { CategorySelectComponent } from '@/shared/category-select/category-select.component';
import { CategoryViewerComponent } from '@/shared/category-viewer/category-viewer.component';
import { DataView } from 'primeng/dataview';
import { TimeagoModule } from 'ngx-timeago';
import { UserAvatarComponent } from '@/shared/user-avatar/user-avatar.component';
import { PeriodFilterComponent } from '@/shared/period-filter/period-filter.component';

import { Panel } from 'primeng/panel';
import { FinancialSummaryComponent } from '@/shared/financial-summary/financial-summary.component';
import { UserPeriodFilterComponent } from '@/shared/user-period-filter/user-period-filter.component';

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
        CurrencyPipe,
        Toast,
        BudgetCopyComponent,
        CategorySelectComponent,
        CategoryViewerComponent,
        DataView,
        NgForOf,
        TimeagoModule,
        UserAvatarComponent,
        FinancialSummaryComponent,
        UserPeriodFilterComponent
    ],
    providers: [BudgetService, MessageService, ConfirmationService, CategoryService],
    templateUrl: './budget.component.html',
    styleUrl: './budget.component.css'
})
export class BudgetComponent implements OnInit {
    get showBudgetCopyDialog(): boolean {
        return this._showBudgetCopyDialog;
    }

    set showBudgetCopyDialog(value: boolean) {
        if (!value) {
            this.loadBudget(this.currentUserPeriodParameter)
        }
        this._showBudgetCopyDialog = value;
    }
    @ViewChild('financialSummaryComponent') financialSummaryComponent!: FinancialSummaryComponent;

    get currentUserPeriodParameter(): UserPeriodParameter {
        return this._currentUserPeriodParameter;
    }
    @Input()
    set currentUserPeriodParameter(value: UserPeriodParameter) {
        this._currentUserPeriodParameter = value;
        this.currentUserPeriodParameterChange.emit(value);
    }
    @Output() currentUserPeriodParameterChange = new EventEmitter<UserPeriodParameter>();

    productDialog: boolean = false;

    public categories = new Array<Category>();
    category!: Category;

    budget!: Budget;
    budgets = new Array<Budget>();
    submitted: boolean = false;

    statuses!: any[];

    incomeBudgetSummary!: FinantialSummaryDto[];

    private _showBudgetCopyDialog: boolean = false;

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

    private _currentUserPeriodParameter: UserPeriodParameter = new UserPeriodParameter();

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
        console.log(this._currentUserPeriodParameter);
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete budget for ' + budget.category?.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.budgetService.delete(budget).subscribe((data) => {
                    this.budget = {};
                    this.currentUserPeriodParameter = { ...this._currentUserPeriodParameter };
                    this.loadBudget(this._currentUserPeriodParameter);
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
            this.currentUserPeriodParameter = { ...this._currentUserPeriodParameter };
            this.loadBudget(this._currentUserPeriodParameter);
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
        this._showBudgetCopyDialog = true;
    }

    loadBudget(param: UserPeriodParameter) {
        this.currentUserPeriodParameter = { ...this.currentUserPeriodParameter };
        console.log(param, 'LOAD BUDGETS');
        this.budgetService.getData(param).subscribe((data) => {
            this.budgets = data;
        });
        // this.financialSummaryComponent.load();
    }
}
