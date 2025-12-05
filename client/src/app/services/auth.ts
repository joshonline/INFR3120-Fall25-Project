import { Injectable } from '@angular/core';
import { signal } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Interface for User object
export interface User {
  id: string;
  username: string;
  email: string;
}

// Interface for API responses
interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // API URL
  // TASK: change 'http://localhost:3000' to backend url for production
  private apiUrl = 'http://localhost:3000/api/users';
  
  // BehaviorSubject to track authentication state
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Signal for reactive state
  public isAuthenticated = signal<boolean>(false);
  
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
    this.checkAuth();
    }
  }
  
  // Check if user is authenticated by validating stored token
  private checkAuth(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const token = this.getToken();
    const userStr = localStorage.getItem('currentUser');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticated.set(true);
      } catch (err) {
        // Invalid stored data, clear it
        this.clearAuth();
      }
    }
  }
  
  // Get stored JWT token
  getToken(): string | null {
  if (isPlatformBrowser(this.platformId)) {
    return localStorage.getItem('token');
  }
  return null;
}

  
  // Get current user value (not observable)
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  // Register new user
  register(username: string, email: string, password: string, password2: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      username,
      email,
      password,
      password2
    }).pipe(
      tap(response => {
        if (response.success && response.token && response.user) {
          this.setAuth(response.token, response.user);
        }
      }),
      catchError(this.handleError)
    );
  }
  
  // Login user
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        if (response.success && response.token && response.user) {
          this.setAuth(response.token, response.user);
        }
      }),
      catchError(this.handleError)
    );
  }
  
  // Logout user
  logout(): void {
    // Call backend logout endpoint
    this.http.post<AuthResponse>(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {
        console.log('Logged out from server');
      },
      error: (err) => {
        console.error('Logout error:', err);
      }
    });
    
    // Clear local storage and state
    this.clearAuth();
    
    // Redirect to home
    this.router.navigate(['/']);
  }
  
  // Set authentication data
  private setAuth(token: string, user: User): void {
    if (!isPlatformBrowser(this.platformId)) {
    // Store token and user in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    }
    // Update state
    this.currentUserSubject.next(user);
    this.isAuthenticated.set(true);
  }
  
  //Clear authentication data

  private clearAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
  }
  
  //Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  
  // Check token expiry
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      // Basic JWT structure check
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() > expiry;
    } catch (err) {
      return true;
    }
  }
}
