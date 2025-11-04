import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@/models/category';
import { environment } from '../../environments/environment';
import { Expense } from '@/models/expense';
import { Budget } from '@/models/budget';
import { IncomeSource } from '@/models/income-source';

@Injectable({
    providedIn: 'root',
})
export class IncomeSourceService {

    constructor(private http: HttpClient) { }

    getData():Observable<IncomeSource[]> {
        return this.http.get<IncomeSource[]>(environment.apiUrl+'incomesource');
    }

    save(data:IncomeSource){
        return this.http.post<IncomeSource>(environment.apiUrl+'incomesource',data);
    }

    delete(incomesource:IncomeSource){
        return this.http.delete<IncomeSource>(environment.apiUrl+'incomesource', {body: incomesource});
    }
}
