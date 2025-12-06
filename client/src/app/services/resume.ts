import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private apiUrl = 'https://your-backend-url.com/api/resumes';

  constructor(private http: HttpClient) {}

  getAllResumes() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getResume(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createResume(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateResume(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
