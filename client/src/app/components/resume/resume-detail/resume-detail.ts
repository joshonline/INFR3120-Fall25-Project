import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ResumeService, Resume } from '../../../services/resume';
@Component({
  selector: 'app-resume-detail',
  imports: [
    CommonModule,
    // RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './resume-detail.html',
  styleUrl: './resume-detail.css',
})
export class ResumeDetail implements OnInit {
  resume = signal<Resume | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  constructor(
    private resumeService: ResumeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadResume(id);
    } else {
      this.error.set('No resume ID provided');
      this.loading.set(false);
    }
  }
  loadResume(id: string): void {
    this.loading.set(true);
    this.resumeService.getResume(id).subscribe({
      next: (response) => {
        if (response.success && response.resume) {
          this.resume.set(response.resume);
        } else {
          this.error.set('Resume not found');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading resume:', err);
        this.error.set(err.message || 'Failed to load resume');
        this.loading.set(false);
      },
    });
  }

  editResume(): void {
    const resume = this.resume();
    if (resume && resume._id) {
      this.router.navigate(['/resumes', resume._id, 'edit']);
    }
  }
  deleteResume(): void {
    const resume = this.resume();
    if (!resume || !resume._id) return;
    if (!confirm(`Are you sure you want to delete ${resume.fullName}'s resume?`)) {
      return;
    }

    this.resumeService.deleteResume(resume._id).subscribe({
      next: (response) => {
        console.log('Resume deleted:', response);
        this.router.navigate(['/resumes']);
      },
      error: (err) => {
        console.error('Delete error:', err);
        alert('Failed to delete resume: ' + err.message);
      },
    });
  }
  goBack(): void {
    this.router.navigate(['/resumes']);
  }
  printResume(): void {
    window.print();
  }
}
