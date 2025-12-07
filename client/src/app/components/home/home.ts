import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    // RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ]
})
export class Home implements OnInit {

  private resumeService = inject(ResumeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // --- STATE ---
  resumes = signal<Resume[]>([]);
  filteredResumes = signal<Resume[]>([]);
  searchTerm = '';
  loading = signal(false);
  error = signal<string | null>(null);

  isLoggedIn = this.authService.isAuthenticated;

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.loadResumes();
    }
  }

  loadResumes() {
    this.loading.set(true);
    this.error.set(null);

    this.resumeService.getResumes().subscribe({
      next: (response) => {
        if (response.success && response.resumes) {
          this.resumes.set(response.resumes);
          this.filteredResumes.set(response.resumes);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to load resumes.');
        this.loading.set(false);
      }
    });
  }

  // --- SEARCH FILTER ---
  filter() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredResumes.set(this.resumes());
      return;
    }

    const filtered = this.resumes().filter(resume => {
      const name = resume.fullName?.toLowerCase() || '';
      const email = resume.email?.toLowerCase() || '';
      const skills = resume.skills?.join(' ').toLowerCase() || '';

      return name.includes(term) || email.includes(term) || skills.includes(term);
    });

    this.filteredResumes.set(filtered);
  }

  // --- NAVIGATION ---
  createNew() {
    this.router.navigate(['/resumes/new']);
  }

  viewResume(id: string) {
    this.router.navigate(['/resumes', id]);
  }

  editResume(id: string) {
    this.router.navigate(['/resumes', id, 'edit']);
  }
}
