import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Category{
    id: number;
    name: string;
}

@Injectable()
export class CategoryService {

    constructor(private http: HttpClient) { }

    getData():Observable<Category[]> {
        return this.http.get<Category[]>('http://localhost:5147/category');
    }
}

