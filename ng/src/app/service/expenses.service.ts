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
        const queryString = param.userName ? `?registeredBy=${param.userName}` : '';
        return this.http.get<Expense[]>(`${environment.apiUrl}expense/${param.year}/${param.period.value}${queryString}`);
    }

    save(data: Expense) {
        data.registeredBy = this.userService.currentUser?.name;
        data.date = new Date(data.date.toISOString());
        return this.http.post<Expense>(environment.apiUrl + 'expense', data);
    }

    delete(expense: Expense) {
        return this.http.delete<Expense>(environment.apiUrl + 'expense/', { body: expense });
    }

    getByDateRangeAndCategory(categoryId: number, startDate: Date, endDate: Date): Observable<Expense[]> {
        let formattedStartDate = formatDate(startDate, 'yyyy-MM-ddTHH:mm:ss.sssZ', 'en-US');
        let formattedEndDate = formatDate(endDate, 'yyyy-MM-ddTHH:mm:ss.sssZ', 'en-US');
        return this.http.get<Expense[]>(`${environment.apiUrl}expense/by-date-category/${formattedStartDate}/${formattedEndDate}/${categoryId}`);
    }
}
