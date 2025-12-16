import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@/models/category';
import { environment } from '../../environments/environment';
import { Expense } from '@/models/expense';
import { Budget } from '@/models/budget';
import { BudgetCopyParameter } from '@/models/budget-copy-parameter';
import { UserPeriodParameter } from '@/models/user-period-parameter';
import { UserService } from '@/service/user.service';
import { Reimbursement } from '@/models/reimbursement';
import { ReimbursementTemplate } from '@/models/reimbursement-template';
import { FixedAmountReimbursement } from '@/models/fixed-amount-reimbursement';

@Injectable({
    providedIn: 'root'
})
export class ReimbursementService {
    constructor(private http: HttpClient, private userService: UserService) {}

    getData(userName: string, pending?:boolean): Observable<Reimbursement[]> {
        console.log(userName, 'rembursement service call GET');
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        let params = new HttpParams();
        params = params.append('familyId', familyId);
        if(pending!== undefined)
            params = params.append('pending', pending);

        if (userName !== undefined)
            params = params.append('userName', userName);
        return this.http.get<Reimbursement[]>(`${environment.apiUrl}reimbursement/`, {params: params});
    }

    getByExpense(expenseId: number): Observable<Reimbursement> {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        return this.http.get<Reimbursement>(`${environment.apiUrl}reimbursement/getbyexpenseid/${expenseId}?familyId=${familyId}`);
    }

    save(data: Reimbursement) {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        data.userName = this.userService.CurrentUser.value?.name??'';
        data.familyId = familyId;
        return this.http.post<Reimbursement>(`${environment.apiUrl}reimbursement`, data);
    }

    delete(data: Reimbursement) {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        data.familyId = familyId;
        return this.http.delete<Reimbursement>(`${environment.apiUrl}reimbursement`, { body: data });
    }

    reimburseExpense(data: Reimbursement) {

        return this.http.post<Reimbursement>(`${environment.apiUrl}reimbursement/reimburse-expense`, data);
    }

    getFixedAmountReimbursementForIcloud(){
        const result = new FixedAmountReimbursement();
        result.fixedAmount = 53.1;
        result.numberOfPayments = 3;
        return result;
    }

    getReimbursementTemplateForIcloud(expense:Expense): ReimbursementTemplate {

        let result = new ReimbursementTemplate();
        result.fixedAmountReimbursement = this.getFixedAmountReimbursementForIcloud();

        const reimbursements:Reimbursement[] = [];
        const reimbursement = new Reimbursement();
        reimbursement.expenseId = expense.id;
        reimbursement.expense = expense;
        reimbursement.pending = true;
        reimbursement.amount = result.fixedAmountReimbursement.fixedAmount;
        reimbursement.percentage = result.fixedAmountReimbursement.fixedAmount / (expense.amount ?? 1)*100;
        reimbursement.description = `Cuota [ 1 de 3] Juan`;
        reimbursements.push({ ...reimbursement });

        reimbursement.description = `Cuota [ 2 de 3] Mois`;
        reimbursements.push({ ...reimbursement });

        reimbursement.description = `Cuota [ 3 de 3] Benjamin`;
        reimbursements.push({ ...reimbursement });
        result.reimbursements = reimbursements;
        return result;
    }
}
