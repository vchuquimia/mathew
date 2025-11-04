import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@/models/category';
import { environment } from '../../environments/environment';
import { Expense } from '@/models/expense';
import { Budget } from '@/models/budget';

@Injectable({
    providedIn: 'root'
})
export class BudgetService {
    constructor(private http: HttpClient) {}

    getData(year:number, period:number): Observable<Budget[]> {
        return this.http.get<Budget[]>(`${environment.apiUrl}budget/${year}/${period}`);
    }

    save(data: Budget) {
        return this.http.post<Budget>(environment.apiUrl + 'budget', data);
    }

    delete(budget: Budget) {
        return this.http.delete<Budget>(environment.apiUrl + 'budget/', { body: budget });
    }
}
