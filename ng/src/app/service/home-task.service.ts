import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HomeTask } from '@/models/home-task';

@Injectable({
    providedIn: 'root'
})
export class HomeTaskService {
    constructor(private http: HttpClient) {}

    getTasks(familyId: number, status: string = 'all', userName?: string): Observable<HomeTask[]> {
        let params = new HttpParams().set('status', status);
        if (userName) {
            params = params.set('userName', userName);
        }
        return this.http.get<HomeTask[]>(`${environment.apiUrl}HomeTask/${familyId}`, { params });
    }

    createTask(task: HomeTask): Observable<HomeTask> {
        return this.http.post<HomeTask>(`${environment.apiUrl}HomeTask`, task);
    }

    updateTask(task: HomeTask): Observable<HomeTask> {
        return this.http.put<HomeTask>(`${environment.apiUrl}HomeTask`, task);
    }

    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}HomeTask/${id}`);
    }
}
