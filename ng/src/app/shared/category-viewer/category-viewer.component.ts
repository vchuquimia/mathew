import { Component, Input } from '@angular/core';
import { Category } from '@/models/category';
import { NgClass } from '@angular/common';

@Component({
    selector: 'category-viewer',
    imports: [NgClass],
    templateUrl: './category-viewer.component.html'
})
export class CategoryViewerComponent {
    @Input() public category!: Category;
}
