import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@/models/category';
import { environment } from '../../environments/environment';
import { Expense } from '@/models/expense';
import { Budget } from '@/models/budget';
import { ExpenseSummaryDto } from '@/models/expense-summary-dto';
import { formatDate } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ExpensesService {
    constructor(private http: HttpClient) {}

    getData(): Observable<Expense[]> {
        return this.http.get<Expense[]>(environment.apiUrl + 'expense');
    }

    save(data: Expense) {
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
