import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@/models/category';
import { environment } from '../../environments/environment';
import { Expense } from '@/models/expense';
import { Budget } from '@/models/budget';
import { IncomeSource } from '@/models/income-source';
import { UserService } from '@/service/user.service';

@Injectable({
    providedIn: 'root',
})
export class IncomeSourceService {

    constructor(private http: HttpClient, private userService: UserService) { }

    getData():Observable<IncomeSource[]> {
        const familyId = this.userService.currentUser?.familyId || 0;
        return this.http.get<IncomeSource[]>(`${environment.apiUrl}incomesource?familyId=${familyId}`);
    }

    save(data:IncomeSource){
        const familyId = this.userService.currentUser?.familyId || 0;
        data.familyId = familyId;
        return this.http.post<IncomeSource>(`${environment.apiUrl}incomesource`, data);
    }

    delete(incomesource:IncomeSource){
        const familyId = this.userService.currentUser?.familyId || 0;
        incomesource.familyId = familyId;
        return this.http.delete<IncomeSource>(`${environment.apiUrl}incomesource`, {body: incomesource});
    }
}
