import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../enviornments/environments';

export interface Resume {
  _id?: string;
  user?: string;
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Resume {
  _id?: string;
  user?: string;
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Experience {
  title: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  skills?: string[];
}

export interface Education {
  degree: string;
  school?: string;
  graduationYear?: string;
  courses?: string[];
}

interface ResumeResponse {
  success: boolean;
  message?: string;
  resume?: Resume;
  resumes?: Resume[];
  count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = `${environment.apiUrl}/resumes`;

  constructor(private http: HttpClient) {}

  /**
   * Get all resumes for current user
   */
  getResumes(): Observable<ResumeResponse> {
    return this.http.get<ResumeResponse>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get single resume by ID
   */
  getResume(id: string): Observable<ResumeResponse> {
    return this.http.get<ResumeResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Create new resume
   */
  createResume(resume: Resume): Observable<ResumeResponse> {
    return this.http.post<ResumeResponse>(this.apiUrl, resume)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update existing resume
   */
  updateResume(id: string, resume: Resume): Observable<ResumeResponse> {
    return this.http.put<ResumeResponse>(`${this.apiUrl}/${id}`, resume)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete resume
   */
  deleteResume(id: string): Observable<ResumeResponse> {
    return this.http.delete<ResumeResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
