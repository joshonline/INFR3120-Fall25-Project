import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private apiUrl = 'http://localhost:3000/api/resumes';

  constructor(private http: HttpClient) {}

  getAllResumes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getResume(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createResume(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateResume(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteResume(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
