import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ResumeService, Resume } from '../../services/resume';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class Home implements OnInit {
  // Use inject() instead of constructor injection
  private resumeService = inject(ResumeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  resumes = signal<Resume[]>([]);
  filteredResumes = signal<Resume[]>([]);
  searchTerm = '';
  loading = signal(false);

  // Expose auth state to template
  isLoggedIn = this.authService.isAuthenticated;

  ngOnInit() {
    // Only load resumes if logged in
    if (this.isLoggedIn()) {
      this.loadResumes();
    }
  }

  loadResumes() {
    this.loading.set(true);

    this.resumeService.getResumes().subscribe({
      next: (response) => {
        if (response.success && response.resumes) {
          this.resumes.set(response.resumes);
          this.filteredResumes.set(response.resumes);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading resumes:', err);
        this.loading.set(false);
      }
    });
  }

  filter() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredResumes.set(this.resumes());
      return;
    }

    const filtered = this.resumes().filter(resume => {
      const nameMatch = resume.fullName.toLowerCase().includes(term);
      const emailMatch = resume.email?.toLowerCase().includes(term);
      const skillsMatch = resume.skills?.some(skill =>
      skill.toLowerCase().includes(term)
      );

      return nameMatch || emailMatch || skillsMatch;
    });

    this.filteredResumes.set(filtered);
  }

  navigateToResumes() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/resumes']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}