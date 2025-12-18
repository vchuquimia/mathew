import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HomeProject } from '@/models/home-project';
import { HomeProjectLog } from '@/models/home-project-log';
import { HomeProjectTask } from '@/models/home-project-task';

@Injectable({
    providedIn: 'root'
})
export class HomeProjectService {
    constructor(private http: HttpClient) {}

    getProjects(familyId: number): Observable<HomeProject[]> {
        return this.http.get<HomeProject[]>(`${environment.apiUrl}HomeProject/${familyId}`);
    }

    createProject(project: HomeProject): Observable<HomeProject> {
        return this.http.post<HomeProject>(`${environment.apiUrl}HomeProject`, project);
    }

    updateProject(project: HomeProject): Observable<HomeProject> {
        return this.http.put<HomeProject>(`${environment.apiUrl}HomeProject`, project);
    }

    deleteProject(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}HomeProject/${id}`);
    }

    addLog(log: HomeProjectLog): Observable<HomeProjectLog> {
        return this.http.post<HomeProjectLog>(`${environment.apiUrl}HomeProject/log`, log);
    }

    addTask(task: HomeProjectTask): Observable<HomeProjectTask> {
        return this.http.post<HomeProjectTask>(`${environment.apiUrl}HomeProject/task`, task);
    }

    updateTask(task: HomeProjectTask): Observable<HomeProjectTask> {
        return this.http.put<HomeProjectTask>(`${environment.apiUrl}HomeProject/task`, task);
    }

    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}HomeProject/task/${id}`);
    }
}

