import { Component, OnInit, signal, ViewChild } from '@angular/core';
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
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '@/pages/service/product.service';
import { CategoryService } from '@/service/category.service';
import { Category } from '@/models/category';
import { CategoryViewerComponent } from '@/shared/category-viewer/category-viewer.component';
import { DataView } from 'primeng/dataview';
import { TimeagoModule } from 'ngx-timeago';
import { UserAvatarComponent } from '@/shared/user-avatar/user-avatar.component';
import { ColorPicker } from 'primeng/colorpicker';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'income-search',
    standalone: true,
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
        CategoryViewerComponent,
        DataView,
        TimeagoModule,
        ColorPicker
    ],
    templateUrl: './category.component.html',
    providers: [MessageService, ProductService, ConfirmationService]
})
export class CategoryComponent implements OnInit {
    productDialog: boolean = false;

    public categories = new Array<Category>();
    category!: Category;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
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
    }

    openNew() {
        this.category = {};
        this.submitted = false;
        this.productDialog = true;
    }

    edit(category: Category) {
        this.category = { ...category };
        this.productDialog = true;
    }


    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    delete(cat: Category) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + cat.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.categoryService.delete(cat).subscribe((data) => {
                    this.category = {};
                    this.loadData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Category Deleted',
                        life: 3000
                    });
                });
            }
        });
    }

    saveCategory() {
        this.submitted = true;
        this.categoryService.save(this.category).subscribe((data) => {
            this.loadData();
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Category Saved',
                life: 3000
            });
        });
        this.productDialog = false;
        this.category = {};
    }
}
