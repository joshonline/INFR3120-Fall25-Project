import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // User data
  username = '';
  email = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // UI state
  loading = signal(false);
  loadingProfile = signal(true);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  isEditingPassword = signal(false);

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loadingProfile.set(true);

    this.authService.getProfile().subscribe({
      next: (response) => {
        if (response.success && response.user) {
          this.username = response.user.username;
          this.email = response.user.email;
        }
        this.loadingProfile.set(false);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.error.set('Failed to load profile');
        this.loadingProfile.set(false);
      },
    });
  }

  onUpdateEmail(): void {
    this.error.set(null);
    this.success.set(null);

    // Validation
    if (!this.email) {
      this.error.set('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error.set('Please enter a valid email address');
      return;
    }

    this.loading.set(true);

    // Call update profile endpoint
    this.authService.updateProfile({ email: this.email }).subscribe({
      next: (response) => {
        console.log('Profile updated:', response);
        this.loading.set(false);
        this.success.set('Email updated successfully!');
      },
      error: (err) => {
        console.error('Update error:', err);
        this.loading.set(false);
        this.error.set(err.message || 'Failed to update email');
      },
    });
  }

  onChangePassword(): void {
    this.error.set(null);
    this.success.set(null);

    // Validation
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.error.set('All password fields are required');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error.set('New passwords do not match');
      return;
    }

    if (this.newPassword.length < 6) {
      this.error.set('Password must be at least 6 characters');
      return;
    }

    if (this.currentPassword === this.newPassword) {
      this.error.set('New password must be different from current password');
      return;
    }

    this.loading.set(true);

    // Call change password endpoint
    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (response) => {
        console.log('Password changed:', response);
        this.loading.set(false);
        this.success.set('Password changed successfully!');

        // Clear password fields
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.isEditingPassword.set(false);
      },
      error: (err) => {
        console.error('Password change error:', err);
        this.loading.set(false);
        this.error.set(err.message || 'Failed to change password');
      },
    });
  }

  togglePasswordEdit(): void {
    this.isEditingPassword.set(!this.isEditingPassword());
    this.error.set(null);
    this.success.set(null);

    // Clear password fields when canceling
    if (!this.isEditingPassword()) {
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }
  }

  goBack(): void {
    this.router.navigate(['/resumes']);
  }
}
