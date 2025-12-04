import { Component } from '@angular/core';
import { signal } from '@angular/core'
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
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  username = '';
  email = '';
  password = '';
  password2 = '';
  
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
    if (!this.username || !this.email || !this.password || !this.password2) {
      this.error.set('Please fill in all fields');
      return;
    }
    
    if (this.password !== this.password2) {
      this.error.set('Passwords do not match');
      return;
    }
    
    if (this.password.length < 6) {
      this.error.set('Password must be at least 6 characters');
      return;
    }
    
    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error.set('Please enter a valid email address');
      return;
    }
    
    // Show loading spinner
    this.loading.set(true);
    
    // Call auth service
    this.authService.register(this.username, this.email, this.password, this.password2).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.loading.set(false);
        
        // Redirect to resumes page
        this.router.navigate(['/resumes']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.loading.set(false);
        this.error.set(err.message || 'Registration failed. Please try again.');
      }
    });
  }
}
