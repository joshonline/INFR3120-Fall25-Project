import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ResumeService, Resume } from '../../../services/resume';

@Component({
  selector: 'app-resume-list',
  standalone: true,
  imports: [
    CommonModule,
    // RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './resume-list.html',
  styleUrl: './resume-list.css'
})
export class ResumeList implements OnInit {
  resumes = signal<Resume[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private resumeService: ResumeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadResumes();
  }

  loadResumes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.resumeService.getResumes().subscribe({
      next: (response) => {
        if (response.success && response.resumes) {
          this.resumes.set(response.resumes);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading resumes:', err);
        this.error.set(err.message || 'Failed to load resumes');
        this.loading.set(false);
      }
    });
  }

  viewResume(id: string): void {
    this.router.navigate(['/resumes', id]);
  }

  editResume(id: string): void {
    this.router.navigate(['/resumes', id, 'edit']);
  }

  deleteResume(id: string, name: string): void {
    if (!confirm(`Are you sure you want to delete ${name}'s resume?`)) {
      return;
    }

    this.resumeService.deleteResume(id).subscribe({
      next: (response) => {
        console.log('Resume deleted:', response);
        // Reload the list
        this.loadResumes();
      },
      error: (err) => {
        console.error('Delete error:', err);
        alert('Failed to delete resume: ' + err.message);
      }
    });
  }

  createNew(): void {
    this.router.navigate(['/resumes/new']);
  }
}
