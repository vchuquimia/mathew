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
import { CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { Toolbar } from 'primeng/toolbar';

import { Toast } from 'primeng/toast';
import { IncomeSource } from '@/models/income-source';
import { IncomeSourceService } from '@/service/income-source.service';

@Component({
    selector: 'income-source',
    standalone: true,
    imports: [Button, ConfirmDialog, Dialog, IconField, InputIcon, InputText, ReactiveFormsModule, TableModule, Textarea, Toolbar, FormsModule, CurrencyPipe, Toast],
    providers: [IncomeSourceService, MessageService, ConfirmationService, CategoryService],
    templateUrl: './income-source.component.html',
    styleUrl: './income-source.component.css'
})
export class IncomeSourceComponent implements OnInit {
    showDialog: boolean = false;

    incomeSource!: IncomeSource;
    incomeSources = new Array<IncomeSource>();
    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    constructor(
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
        this.incomeSourceService.getData().subscribe((data) => {
            this.incomeSources = data;
        });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.incomeSource = {};
        this.submitted = false;
        this.showDialog = true;
    }

    edit(incomeSource: IncomeSource) {
        this.incomeSource = { ...incomeSource };
        this.showDialog = true;
    }

    deleteSelected() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.incomeSourceService.delete(this.incomeSource).subscribe((data) => {
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
        this.showDialog = false;
        this.submitted = false;
    }

    delete(incomeSource: IncomeSource) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete incomeSource for ' + incomeSource.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.incomeSourceService.delete(incomeSource).subscribe((data) => {
                    this.incomeSource = {};
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
        this.incomeSourceService.save(this.incomeSource).subscribe((data) => {
            this.loadData();
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'incomeSource Saved',
                life: 3000
            });
        });
        this.showDialog = false;
        this.incomeSource = {};
    }
}
