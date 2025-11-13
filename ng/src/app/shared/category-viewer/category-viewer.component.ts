import { Component, Input } from '@angular/core';
import { Category } from '@/models/category';
import { NgClass, NgStyle } from '@angular/common';

@Component({
    selector: 'category-viewer',
    imports: [NgClass, NgStyle],
    templateUrl: './category-viewer.component.html'
})
export class CategoryViewerComponent {
    @Input() public category!: Category;
}
