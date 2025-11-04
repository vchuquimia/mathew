import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Income } from '@/models/income';
import { IncomeBudgetMontlySummaryDto } from '@/models/income-budget-montly-summary-dto';

@Injectable({
    providedIn: 'root'
})
export class IncomeService {
    constructor(private http: HttpClient) {}

    getData(): Observable<Income[]> {
        return this.http.get<Income[]>(environment.apiUrl + 'income');
    }

    save(data: Income) {
        return this.http.post<Income>(environment.apiUrl + 'income', data);
    }

    delete(income: Income) {
        return this.http.delete<Income>(environment.apiUrl + 'income', { body: income });
    }

    getIncomeBudgetMontlySummaryDto(year:number, month:number): Observable<IncomeBudgetMontlySummaryDto> {
        return this.http.get<IncomeBudgetMontlySummaryDto>(`${environment.apiUrl}income/getincomebudgetsummary/${year}/${month}`);
    }
}
