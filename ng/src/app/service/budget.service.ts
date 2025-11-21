import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@/models/category';
import { environment } from '../../environments/environment';
import { Expense } from '@/models/expense';
import { Budget } from '@/models/budget';
import { BudgetCopyParameter } from '@/models/budget-copy-parameter';
import { UserPeriodParameter } from '@/models/user-period-parameter';
import { UserService } from '@/service/user.service';

@Injectable({
    providedIn: 'root'
})
export class BudgetService {
    constructor(private http: HttpClient, private userService: UserService) {}

    getData(param: UserPeriodParameter): Observable<Budget[]> {
        console.log(param,'GET Budget');
        const familyId = this.userService.currentUser?.familyId || 0;
        const queryString = param.userName ? `&userName=${param.userName}` : '';
        return this.http.get<Budget[]>(`${environment.apiUrl}budget/${param.year}/${param.period?.number}?familyId=${familyId}${queryString}`);
    }

    save(data: Budget) {
        const familyId = this.userService.currentUser?.familyId || 0;
        data.userName = this.userService.currentUser?.name;
        data.familyId = familyId;
        return this.http.post<Budget>(`${environment.apiUrl}budget`, data);
    }

    delete(budget: Budget) {
        const familyId = this.userService.currentUser?.familyId || 0;
        budget.familyId = familyId;
        return this.http.delete<Budget>(`${environment.apiUrl}budget`, { body: budget });
    }

    copyBudget(copyParams: BudgetCopyParameter): Observable<number> {
        const familyId = this.userService.currentUser?.familyId || 0;
        copyParams.familyId = familyId;
        return this.http.post<number>(`${environment.apiUrl}budget/copy`, copyParams);
    }
}
