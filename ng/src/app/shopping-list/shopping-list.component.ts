import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataView } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { ShoppingListService } from '@/service/shopping-list.service';
import { ShoppingList } from '@/models/shopping-list';
import { ShoppingListItem } from '@/models/shopping-list-item';
import { UserService } from '@/service/user.service';
import { CategorySelectComponent } from '@/shared/category-select/category-select.component';
import { Category } from '@/models/category';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-shopping-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        ConfirmDialogModule,
        DataView,
        DialogModule,
        InputTextModule,
        ToastModule,
        ToolbarModule,
        CheckboxModule,
        CategorySelectComponent,
        TooltipModule,
        InputNumberModule,
        DragDropModule
    ],
    templateUrl: './shopping-list.component.html',
    providers: [ConfirmationService, ShoppingListService]
})
export class ShoppingListComponent implements OnInit {
    shoppingListDialog: boolean = false;
    itemDialog: boolean = false;
    showCompleted: boolean = false;
    shoppingLists: ShoppingList[] = [];
    visibleShoppingLists = signal<ShoppingList[]>([]) ;
    shoppingList!: ShoppingList;
    shoppingListItem!: ShoppingListItem;
    submitted: boolean = false;

    constructor(
        private shoppingListService: ShoppingListService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        if (familyId) {
            this.shoppingListService.getLists(familyId).subscribe((data) => {
                this.shoppingLists = data;
                this.refreshVisibleShoppingLists();
            });
        }
    }

    openNew() {
        this.shoppingList = {
            id: 0,
            name: '',
            familyId: this.userService.CurrentUser.value?.familyId || 0,
            createdDate: new Date().toISOString(),
            items: [],
            done: false
        };
        this.submitted = false;
        this.shoppingListDialog = true;
    }

    edit(list: ShoppingList) {
        this.shoppingList = { ...list };
        this.shoppingListDialog = true;
    }

    hideDialog() {
        this.shoppingListDialog = false;
        this.itemDialog = false;
        this.submitted = false;
    }

    delete(list: ShoppingList) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres eliminar ' + list.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.shoppingListService.deleteList(list).subscribe(() => {
                    this.loadData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Exito',
                        detail: 'Lista eliminada',
                        life: 3000
                    });
                });
            }
        });
    }

    deleteItem(item: ShoppingListItem) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres eliminar ' + item.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.shoppingListService.deleteItem(item.id).subscribe(() => {
                    this.loadData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Exito',
                        detail: 'Ítem eliminado',
                        life: 3000
                    });
                });
            }
        });
    }

    saveShoppingList() {
        this.submitted = true;

        if (this.shoppingList.name?.trim()) {
            if (this.shoppingList.id) {
                this.shoppingListService.updateList(this.shoppingList).subscribe(() => {
                    this.loadData();
                    this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Lista de compras actualizada', life: 3000 });
                });
            } else {
                this.shoppingListService.createList(this.shoppingList).subscribe(() => {
                    this.loadData();
                    this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Lista de compras creada', life: 3000 });
                });
            }

            this.shoppingListDialog = false;
            this.shoppingList = {} as ShoppingList;
        }
    }

    toggleListDone(list: ShoppingList) {
        this.refreshVisibleShoppingLists();
        this.shoppingListService.updateList(list).subscribe(() => {
             this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Estado actualizado', life: 3000 });
        });
    }

    toggleItemDone(item: ShoppingListItem) {
        this.refreshVisibleShoppingLists();
        this.shoppingListService.updateItem(item).subscribe(() => {
             this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Estado del ítem actualizado', life: 3000 });
        });
    }

    openNewItem(list: ShoppingList) {
        this.shoppingList = list;
        this.shoppingListItem = {
            id: 0,
            name: '',
            budgetAmount: 0,
            categoryId: 0,
            shoppingListId: list.id,
            isBought: false,
            done: false,
            order: list.items.length
        };
        this.submitted = false;
        this.itemDialog = true;
    }

    editItem(item: ShoppingListItem) {
        const list = this.shoppingLists.find(l => l.id === item.shoppingListId);
        this.shoppingList = <ShoppingList>list;
        this.shoppingListItem = { ...item };
        this.itemDialog = true;
    }

    saveItem() {
        this.submitted = true;

        if (this.shoppingListItem.name?.trim()) {
            if (this.shoppingListItem.id) {
                this.shoppingListService.updateItem(this.shoppingListItem).subscribe(() => {
                    this.loadData();
                    this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Ítem actualizado', life: 3000 });
                    this.itemDialog = false;
                    this.shoppingListItem = {} as ShoppingListItem;
                });
            } else {
                this.shoppingListService.addItem(this.shoppingListItem).subscribe(() => {
                    this.itemDialog = false;
                    this.shoppingListItem = {} as ShoppingListItem;
                    this.loadData();
                    this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Ítem agregado', life: 3000 });
                });
            }
        }
    }

    onCategoryChange(category: Category) {
        if (category && category.id) {
            this.shoppingListItem.categoryId = category.id;
            this.shoppingListItem.category = category;
        }
    }

    drop(event: CdkDragDrop<ShoppingListItem[]>, list: ShoppingList) {
        moveItemInArray(list.items, event.previousIndex, event.currentIndex);

        // Update order property for all items in the list
        list.items.forEach((item, index) => {
            item.order = index;
        });

        // Save the new order
        this.shoppingListService.reorderItems(list.items).subscribe(() => {
             // Optional: Show success message or just silent update
        });
    }

    getVisibleLists(): ShoppingList[] {
        if (this.showCompleted) {
            return this.shoppingLists;
        }

        return this.shoppingLists.filter((list) => !list.done);
    }

    onShowCompletedChange() {
        this.refreshVisibleShoppingLists();
    }

    refreshVisibleShoppingLists() {
        this.visibleShoppingLists.set(this.getVisibleLists());
    }

    getVisibleItems(list: ShoppingList): ShoppingListItem[] {
        if (this.showCompleted) {
            return list.items;
        }

        return list.items.filter((item) => !item.done);
    }
}
