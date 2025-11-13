import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryService } from '@/service/category.service';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { CurrencyPipe, DatePipe, NgClass, NgForOf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { Toolbar } from 'primeng/toolbar';
import { Select, SelectChangeEvent } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { Income } from '@/models/income';
import { IncomeService } from '@/service/income.service';
import { IncomeSource } from '@/models/income-source';
import { IncomeSourceService } from '@/service/income-source.service';
import { DatePicker } from 'primeng/datepicker';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Tag } from 'primeng/tag';
import { UserFilterComponent } from '@/shared/user-filter/user-filter.component';
import { DataView } from 'primeng/dataview';
import { TimeagoModule } from 'ngx-timeago';
import { UserAvatarComponent } from '@/shared/user-avatar/user-avatar.component';
import { UserFinancialSummaryComponent } from '@/shared/user-financial-summary/user-financial-summary.component';
import { UserPeriodParameter } from '@/models/user-period-parameter';
import { PeriodFilterComponent } from '@/shared/period-filter/period-filter.component';
import { Period } from '@/models/period';

@Component({
    selector: 'income',
    standalone: true,
    imports: [
        Button,
        ConfirmDialog,
        Dialog,
        InputText,
        ReactiveFormsModule,
        TableModule,
        Textarea,
        Toolbar,
        NgClass,
        FormsModule,
        Select,
        CurrencyPipe,
        Toast,
        DatePicker,
        InputGroup,
        InputGroupAddon,
        DatePipe,
        Tag,
        UserFilterComponent,
        DataView,
        TimeagoModule,
        UserAvatarComponent,
        UserFinancialSummaryComponent,
        NgForOf,
        PeriodFilterComponent
    ],
    providers: [IncomeService, MessageService, ConfirmationService, CategoryService],
    templateUrl: './income.component.html',
    styleUrl: './income.component.css'
})
export class IncomeComponent {
    showDialog: boolean = false;
    incomeSources!: IncomeSource[];

    income!: Income;
    incomes = new Array<Income>();
    submitted: boolean = false;

    currentUserPeriodParameter = new UserPeriodParameter();

    @ViewChild('dt') dt!: Table;

    constructor(
        private incomeService: IncomeService,
        private incomeSourceService: IncomeSourceService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    loadData(param: UserPeriodParameter) {
        this.incomeService.getData(param).subscribe((data) => {
            this.incomes = data;
        });
        this.incomeSourceService.getData().subscribe((data) => {
            this.incomeSources = data;
        });
    }

    openNew() {
        this.income = new Income({});
        this.income.date = new Date();
        this.submitted = false;
        this.showDialog = true;
    }

    edit(income: Income) {
        this.income = { ...income };
        this.income.date = new Date(income.date);
        this.showDialog = true;
    }

    hideDialog() {
        this.showDialog = false;
        this.submitted = false;
    }

    delete(income: Income) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete income for ' + income.description + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.incomeService.delete(income).subscribe((data) => {
                    this.income = new Income({});
                    this.loadData(this.currentUserPeriodParameter);
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
        this.incomeService.save(this.income).subscribe((data) => {
            this.loadData(this.currentUserPeriodParameter);
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'incomeSource Saved',
                life: 3000
            });
        });
        this.showDialog = false;
        this.income = new Income({});
    }

    onDatePreviousClick() {
        this.income.date = new Date(this.income.date.setDate(this.income.date.getDate() - 1));
    }

    onDateNextClick() {
        this.income.date = new Date(this.income.date.setDate(this.income.date.getDate() + 1));
    }

    protected onIncomeSourceChange($event: SelectChangeEvent) {
        this.income.amount = $event.value.projectedIncome;
    }

    protected userFilter(param: string) {
        this.currentUserPeriodParameter.userName = param;
        this.loadData(this.currentUserPeriodParameter);
    }

    protected periodFilter(parameter: Period) {
        this.currentUserPeriodParameter.period = parameter;
        this.loadData(this.currentUserPeriodParameter);
    }
}
