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

@Injectable({
    providedIn: 'root'
})
export class ReimbursementService {
    constructor(private http: HttpClient, private userService: UserService) {}

    getData(userName: string, pending:boolean): Observable<Reimbursement[]> {
        let params = new HttpParams();
        params = params.append('pending', pending);
        if (userName !== undefined)
            params = params.append('username', userName);
        return this.http.get<Reimbursement[]>(`${environment.apiUrl}reimbursement/`, {params: params});
    }

    getByExpense(expenseId: number): Observable<Reimbursement> {

        return this.http.get<Reimbursement>(`${environment.apiUrl}reimbursement/getbyexpenseid/${expenseId}`);
    }

    save(data: Reimbursement) {
        data.userName = this.userService.currentUser?.name??'';
        return this.http.post<Reimbursement>(environment.apiUrl + 'reimbursement', data);
    }

    delete(data: Reimbursement) {
        return this.http.delete<Reimbursement>(environment.apiUrl + 'reimbursement', { body: data });
    }
}
