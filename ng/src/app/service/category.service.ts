import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category{
    id: number;
    name: string;
}

@Injectable({
    // declares that this service should be created
    // by the root application injector.
    providedIn: 'root',
})
export class CategoryService {

    constructor(private http: HttpClient) { }

    getData():Observable<Category[]> {
        return this.http.get<Category[]>('http://localhost:5147/category');
    }
}

