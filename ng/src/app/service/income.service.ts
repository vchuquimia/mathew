import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Income } from '@/models/income';
import { IncomeBudgetMontlySummaryDto } from '@/models/income-budget-montly-summary-dto';
import { UserService } from '@/service/user.service';
import { UserPeriodParameter } from '@/models/user-period-parameter';

@Injectable({
    providedIn: 'root'
})
export class IncomeService {
    constructor(private http: HttpClient, private userService: UserService) {}

    getData(parameter:UserPeriodParameter): Observable<Income[]> {
        const queryString = parameter.userName ? `?username=${parameter.userName}` : '';
        return this.http.get<Income[]>(`${environment.apiUrl}income/${parameter.year}/${parameter.period.value}${queryString}`);
    }

    save(data: Income) {
        data.userName = this.userService.currentUser?.name;
        return this.http.post<Income>(environment.apiUrl + 'income', data);
    }

    delete(income: Income) {
        return this.http.delete<Income>(environment.apiUrl + 'income', { body: income });
    }

    getIncomeBudgetMontlySummaryDto(param:UserPeriodParameter): Observable<IncomeBudgetMontlySummaryDto[]> {
        const queryString = param.userName ? `?username=${param.userName}` : '';
        return this.http.get<IncomeBudgetMontlySummaryDto[]>(`${environment.apiUrl}income/getincomebudgetsummary/${param.year}/${param.period.value}${queryString}`);
    }

    getIncomeBudgetMontlySummaryByDateAndUser(year:number, month:number, userName: string): Observable<IncomeBudgetMontlySummaryDto> {
        const queryString = userName ? `?username=${userName}` : '';
        return this.http.get<IncomeBudgetMontlySummaryDto>(`${environment.apiUrl}income/getincomebudgetsummary-by-date-and-user/${year}/${month}${queryString}`);
    }
}
