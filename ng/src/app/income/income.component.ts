import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryService } from '@/service/category.service';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
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

@Component({
    selector: 'income',
    standalone: true,
    imports: [Button, ConfirmDialog, Dialog, IconField, InputIcon, InputText, ReactiveFormsModule, TableModule, Textarea, Toolbar, NgClass, FormsModule, Select, CurrencyPipe, Toast, DatePicker, InputGroup, InputGroupAddon, DatePipe, Tag],
    providers: [IncomeService, MessageService, ConfirmationService, CategoryService],
    templateUrl: './income.component.html',
    styleUrl: './income.component.css'
})
export class IncomeComponent implements OnInit {
    showDialog: boolean = false;
    incomeSources!: IncomeSource[];

    income!: Income;
    incomes = new Array<Income>();
    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    constructor(
        private incomeService: IncomeService,
        private incomeSourceService: IncomeSourceService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.incomeService.getData().subscribe((data) => {
            this.incomes = data;
        });
        this.incomeSourceService.getData().subscribe((data) => {
            this.incomeSources = data;
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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
        this.incomeService.save(this.income).subscribe((data) => {
            this.loadData();
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
}
