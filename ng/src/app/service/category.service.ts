import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '@/models/category';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private http: HttpClient) {}

    getData(): Observable<Category[]> {
        return this.http.get<Category[]>(environment.apiUrl + 'category');
    }

    save(data: Category) {
        return this.http.post<Category>(environment.apiUrl + 'category', data);
    }

    delete(category: Category) {
        return this.http.delete<Category>(environment.apiUrl + 'category/', {
            body: category
        });
    }
}
