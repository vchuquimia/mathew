import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Income } from '@/models/income';
import { FinantialSummaryDto } from '@/models/finantial-summary-dto';
import { UserService } from '@/service/user.service';
import { UserPeriodParameter } from '@/models/user-period-parameter';

@Injectable({
    providedIn: 'root'
})
export class IncomeService {
    constructor(private http: HttpClient, private userService: UserService) {}

    getData(parameter:UserPeriodParameter): Observable<Income[]> {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        const queryString = parameter.userName ? `&userName=${parameter.userName}` : '';
        return this.http.get<Income[]>(`${environment.apiUrl}income/${parameter.periodParameter.year}/${parameter.periodParameter.period?.number}?familyId=${familyId}${queryString}`);
    }

    save(data: Income) {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        data.userName = this.userService.CurrentUser.value?.name;
        data.familyId = familyId;
        return this.http.post<Income>(`${environment.apiUrl}income`, data);
    }

    delete(income: Income) {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        income.familyId = familyId;
        return this.http.delete<Income>(`${environment.apiUrl}income`, { body: income });
    }

    getIncomeBudgetMontlySummaryDto(param:UserPeriodParameter): Observable<FinantialSummaryDto[]> {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        const queryString = param.userName ? `&userName=${param.userName}` : '';
        return this.http.get<FinantialSummaryDto[]>(`${environment.apiUrl}income/getincomebudgetsummary/${param.periodParameter.year}/${param.periodParameter.period?.number}?familyId=${familyId}${queryString}`);
    }

    getIncomeBudgetMontlySummaryByDateAndUser(year:number, month:number, userName: string): Observable<FinantialSummaryDto> {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        const queryString = userName ? `&userName=${userName}` : '';
        return this.http.get<FinantialSummaryDto>(`${environment.apiUrl}income/getincomebudgetsummary-by-date-and-user/${year}/${month}?familyId=${familyId}${queryString}`);
    }
}
