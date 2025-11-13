import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryService } from '@/service/category.service';
import { Category } from '@/models/category';
import { Select, SelectChangeEvent } from 'primeng/select';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'category-select',
    imports: [NgClass, Select, FormsModule],
    templateUrl: './category-select.component.html',
    standalone: true
})
export class CategorySelectComponent {
    private _currenCategory!: Category | undefined;
    get currenCategory(): Category|undefined {
        return this._currenCategory;
    }
    @Input()
    set currenCategory(value: Category|undefined) {
        this._currenCategory = value;
        this.currenCategoryChange.emit(value);
    }
    @Output() currenCategoryChange = new EventEmitter<Category>();

    categories!: Category[];

    @Output() onChange = new EventEmitter<SelectChangeEvent>();

    constructor(private categoryService: CategoryService) {
        this.categoryService.getData().subscribe((c) => (this.categories = c));
    }

    protected onChanged($event: SelectChangeEvent) {
        this.onChange.emit($event);
    }
}
