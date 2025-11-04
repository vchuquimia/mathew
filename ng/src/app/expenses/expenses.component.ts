import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '@/pages/service/product.service';
import { CategoryService } from '@/service/category.service';
import { Expense } from '@/models/expense';
import { ExpensesService } from '@/service/expenses.service';
import { Category } from '@/models/category';
import { FluidModule } from 'primeng/fluid';

import { DataView } from 'primeng/dataview';



import { ExpenseDialogComponent } from '@/expenses/expense-dialog/expense-dialog.component';
import { TimeagoFormatter, TimeagoModule } from 'ngx-timeago';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

class test {
    constructor() {
        this.dateProperty = new Date(2020, 10, 20);
    }
    dateProperty: Date;
}

@Component({
    selector: 'expenses',
    // standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        FluidModule,
        DataView,
        ExpenseDialogComponent,
        ToastModule,
        TimeagoModule
    ],
    templateUrl: './expenses.component.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class ExpensesComponent extends test implements OnInit {
    // test: test = new test();
    showDialog: boolean = false;

    public categories = new Array<Category>();
    category!: Category;
    expense!: Expense;
    expenses = new Array<Expense>();

    selectedExpenses!: Expense[] | null;
    submitted: boolean = false;
    @ViewChild('dt') dt!: Table;


    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private categoryService: CategoryService,
        private expenseService: ExpensesService
    ) {
        super();
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadData();
        this.categoryService.getData().subscribe((data) => {
            this.categories = data;
        });
    }

    loadData() {
        this.expenseService.getData().subscribe((data) => {
            this.expenses = data;
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.expense = new Expense({});
        this.expense.date = new Date();
        this.submitted = false;
        this.showDialog = true;
    }

    editExpense(expense: Expense) {
        console.log(expense);
        this.expense = { ...expense };
        this.expense.date = new Date(expense.date);

        // this.test.dateProperty = new Date(this.expense.date);K
        this.showDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //call to delete
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    deleteExpense(expense: Expense) {
        this.confirmationService.confirm({
            message: 'Estas seguro que quieres borrar el gasto ' + expense.description + '?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.expenseService.delete(expense).subscribe((i) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Gasto borrado',
                        life: 3000
                    });
                    this.loadData();
                });
            }
        });
    }

    protected hideDialog() {
        this.loadData();
        this.showDialog = false;
    }
}
