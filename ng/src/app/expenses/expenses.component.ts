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
import { Avatar } from 'primeng/avatar';
import { UserService } from '@/service/user.service';
import { User } from '@/models/user';
import { SelectButton } from 'primeng/selectbutton';
import { CategoryViewerComponent } from '@/shared/category-viewer/category-viewer.component';
import { UserAvatarComponent } from '@/shared/user-avatar/user-avatar.component';
import { UserFilterComponent } from '@/shared/user-filter/user-filter.component';
import { UserPeriodParameter } from '@/models/user-period-parameter';
import { PeriodFilterComponent } from '@/shared/period-filter/period-filter.component';
import { Period } from '@/models/period';

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
        TimeagoModule,
        CategoryViewerComponent,
        UserAvatarComponent,
        UserFilterComponent,
        PeriodFilterComponent
    ],
    templateUrl: './expenses.component.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class ExpensesComponent implements OnInit {
    showDialog: boolean = false;

    category!: Category;
    expense!: Expense;
    expenses = new Array<Expense>();

    submitted: boolean = false;
    @ViewChild('dt') dt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,

        private expenseService: ExpensesService,
        public userService: UserService
    ) {}

    currentUserPeriodParameter = new  UserPeriodParameter();

    ngOnInit() {}

    loadData(parameter: UserPeriodParameter) {
        this.expenseService.getData(parameter).subscribe((data) => {
            this.expenses = data;
        });
    }

    openNew() {
        this.expense = new Expense();
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
                    this.loadData(this.currentUserPeriodParameter);
                });
            }
        });
    }

    protected hideDialog() {
        this.loadData(this.currentUserPeriodParameter);
        this.showDialog = false;
    }

    protected filter(parameter: string) {
        this.currentUserPeriodParameter.userName = parameter;
        this.loadData(this.currentUserPeriodParameter);
    }

    protected filterPeriod(parameter: Period) {
        this.currentUserPeriodParameter.period = parameter;
        this.loadData(this.currentUserPeriodParameter);
    }
}
