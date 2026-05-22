import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dialog } from "primeng/dialog";

import { Button } from "primeng/button";
import { BudgetCopyParameter } from '@/models/budget-copy-parameter';
import { BudgetService } from '@/service/budget.service';
import { MessageService } from 'primeng/api';
import { Checkbox } from "primeng/checkbox";
import { FormsModule } from '@angular/forms';

import { Textarea } from 'primeng/textarea';
import { InputText } from 'primeng/inputtext';
import { UserService } from '@/service/user.service';

@Component({
    selector: 'budget-copy',
    imports: [Dialog, Button, Checkbox, FormsModule, Textarea],
    templateUrl: './budget-copy.component.html',
    styleUrl: './budget-copy.component.css'
})
export class BudgetCopyComponent {
    private _visible: boolean = false;

    public get visible(): boolean {
        return this._visible;
    }
    @Input()
    public set visible(value: boolean) {
        this._visible = value;
    }
    @Output()
    public visibleChange = new EventEmitter<boolean>();

    budgetCopyParams: BudgetCopyParameter;

    constructor(
        private budgetService: BudgetService,
        private messageService: MessageService,
        private userService: UserService
    ) {
        this.budgetCopyParams = {
            sourceMonth: new Date().getMonth(),
            sourceYear: new Date().getFullYear(),
            targetMonth: new Date().getMonth() + 1,
            targetYear: new Date().getFullYear(),
            overwriteExisting: true,
            familyId: this.userService.CurrentUser.value?.familyId??-1,
        };
    }

    copyBudget() {
        this.budgetService.copyBudget(this.budgetCopyParams).subscribe((data) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: ` budget items copied successfully.` });
            this.hideDialog();
        });
    }

    protected hideDialog() {
        this.visible = false;
        this.visibleChange.emit(false);
    }
}
