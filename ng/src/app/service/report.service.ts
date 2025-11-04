import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@/models/category';
import { environment } from '../../environments/environment';
import { Expense } from '@/models/expense';
import { Budget } from '@/models/budget';
import { ExpenseSummaryDto } from '@/models/expense-summary-dto';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    constructor(private http: HttpClient) {}

    getExpenseSummaryByDateRange(startDate: Date, endDate: Date): Observable<Budget[]> {
        var params = new HttpParams();
        params = params.append('startDate', startDate.toISOString());
        params = params.append('endDate', endDate.toISOString());
        return this.http.get<ExpenseSummaryDto[]>(environment.apiUrl + 'report/', { params: params });
    }

    getSummaryByDateRangeAndCategory(startDate: Date, endDate: Date, categoryId: number): Observable<ExpenseSummaryDto> {
        var params = new HttpParams();
        params = params.append('startDate', startDate.toISOString());
        params = params.append('endDate', endDate.toISOString());
        params = params.append('categoryId', categoryId);
        return this.http.get<ExpenseSummaryDto>(environment.apiUrl + 'report/SummaryByDateRangeAndCategory', { params: params });
    }
}
