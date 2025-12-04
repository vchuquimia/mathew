import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@/models/category';
import { environment } from '../../environments/environment';
import { Expense } from '@/models/expense';
import { Budget } from '@/models/budget';
import { ExpenseSummaryDto } from '@/models/expense-summary-dto';
import { formatDate } from '@angular/common';
import { UserService } from '@/service/user.service';
import { UserPeriodParameter } from '@/models/user-period-parameter';

@Injectable({
    providedIn: 'root'
})
export class ExpensesService {
    constructor(private http: HttpClient, private userService: UserService) {}

    getData(param:UserPeriodParameter): Observable<Expense[]> {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        const queryString = param.userName ? `&registeredBy=${param.userName}` : '';
        return this.http.get<Expense[]>(`${environment.apiUrl}expense/${param.year}/${param.period?.number}?familyId=${familyId}${queryString}`);
    }

    save(data: Expense) {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        data.registeredBy = this.userService.CurrentUser.value?.name??'none';
        data.familyId = familyId;
        data.date = new Date(data.date.toISOString());
        return this.http.post<Expense>(`${environment.apiUrl}expense`, data);
    }

    delete(expense: Expense) {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        expense.familyId = familyId;
        return this.http.delete<Expense>(`${environment.apiUrl}expense`, { body: expense });
    }

    getByDateRangeAndCategory(categoryId: number, startDate: Date, endDate: Date): Observable<Expense[]> {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        let formattedStartDate = formatDate(startDate, 'yyyy-MM-ddTHH:mm:ss.sssZ', 'en-US');
        let formattedEndDate = formatDate(endDate, 'yyyy-MM-ddTHH:mm:ss.sssZ', 'en-US');
        return this.http.get<Expense[]>(`${environment.apiUrl}expense/by-date-category/${formattedStartDate}/${formattedEndDate}/${categoryId}?familyId=${familyId}`);
    }
}
