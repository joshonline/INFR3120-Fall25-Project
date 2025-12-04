import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,    
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Form data
  username = '';
  password = '';
  
  // UI state
  loading = signal(false);
  error = signal<string | null>(null);
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  onSubmit(): void {
    // Clear previous errors
    this.error.set(null);
    
    // Validation
    if (!this.username || !this.password) {
      this.error.set('Please fill in all fields');
      return;
    }
    
    // Show loading spinner
    this.loading.set(true);
    
    // Call auth service
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.loading.set(false);
        
        // Redirect to resumes page
        this.router.navigate(['/resumes']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.loading.set(false);
        this.error.set(err.message || 'Login failed. Please try again.');
      }
    });
  }
}
