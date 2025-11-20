import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Family } from '@/models/family';
import { environment } from '../../environments/environment';
import { UserService } from '@/service/user.service';

@Injectable({
    providedIn: 'root',
})
export class FamilyService {
    constructor(private http: HttpClient, private userService: UserService) { }

    getFamilies(): Observable<Family[]> {
        return this.http.get<Family[]>(`${environment.apiUrl}family`);
    }

    save(family: Family) {
        // Only set id if updating, not for new families
        return this.http.post<Family>(`${environment.apiUrl}family`, family);
    }

    delete(family: Family) {
        return this.http.delete<Family>(`${environment.apiUrl}family`, { body: family });
    }
}
