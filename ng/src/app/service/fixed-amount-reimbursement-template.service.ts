import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from '@/service/user.service';
import { UserPeriodParameter } from '@/models/user-period-parameter';
import { FixedAmountReimbursementTemplate } from '@/models/fixed-amount-reimbursement-template';

@Injectable({
    providedIn: 'root'
})
export class FixedAmountReimbursementTemplateService {
    constructor(private http: HttpClient, private userService: UserService) {}

    getAll(): Observable<FixedAmountReimbursementTemplate[]> {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        const queryString = `&userName=${this.userService.CurrentUser.value?.name}`;
        return this.http.get<FixedAmountReimbursementTemplate[]>(
            `${environment.apiUrl}FixedAmountReimbursementTemplate?familyId=${familyId}${queryString}`
        );
    }

    save(data: FixedAmountReimbursementTemplate) {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        data.userName = this.userService.CurrentUser.value?.name;
        data.familyId = familyId;
        return this.http.post<FixedAmountReimbursementTemplate>(`${environment.apiUrl}FixedAmountReimbursementTemplate`, data);
    }

    delete(data: FixedAmountReimbursementTemplate) {
        const familyId = this.userService.CurrentUser.value?.familyId || 0;
        return this.http.delete<number>(`${environment.apiUrl}FixedAmountReimbursementTemplate/${data.id}?familyId=${familyId}`);
    }
}

