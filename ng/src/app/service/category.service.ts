import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '@/models/category';
import { UserService } from '@/service/user.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private http: HttpClient, private userService: UserService) {}

    getData(): Observable<Category[]> {
        const familyId = this.userService.currentUser?.familyId || 0;
        return this.http.get<Category[]>(`${environment.apiUrl}category?familyId=${familyId}`);
    }

    save(data: Category) {
        const familyId = this.userService.currentUser?.familyId || 0;
        data.familyId = familyId;
        return this.http.post<Category>(`${environment.apiUrl}category`, data);
    }

    delete(category: Category) {
        const familyId = this.userService.currentUser?.familyId || 0;
        category.familyId = familyId;
        return this.http.delete<Category>(`${environment.apiUrl}category`, {
            body: category
        });
    }
}
