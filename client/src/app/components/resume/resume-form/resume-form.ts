import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ResumeService, Resume, Experience, Education } from '../../../services/resume';

@Component({
  selector: 'app-resume-form',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule],
  templateUrl: './resume-form.html',
  styleUrl: './resume-form.css',
})
export class ResumeForm implements OnInit {
  isEditMode = false;
  resumeId: string | null = null;
  
  // Form data
  fullName = '';
  email = '';
  phone = '';
  location = '';
  summary = '';
  skills: string[] = [];
  skillInput = '';
  experience: Experience[] = [];
  education: Education[] = [];
  
  // UI state
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private resumeService: ResumeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if we're in edit mode
    this.resumeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.resumeId;

    if (this.isEditMode && this.resumeId) {
      this.loadResume(this.resumeId);
    } else {
      // Initialize with one empty entry for each array
      this.addExperience();
      this.addEducation();
    }
  }

  loadResume(id: string): void {
    this.loading.set(true);
    
    this.resumeService.getResume(id).subscribe({
      next: (response) => {
        if (response.success && response.resume) {
          const resume = response.resume;
          
          // Populate form fields
          this.fullName = resume.fullName;
          this.email = resume.email || '';
          this.phone = resume.phone || '';
          this.location = resume.location || '';
          this.summary = resume.summary || '';
          this.skills = resume.skills || [];
          this.experience = resume.experience.length > 0 ? resume.experience : [];
          this.education = resume.education.length > 0 ? resume.education : [];
          
          // Ensure at least one entry
          if (this.experience.length === 0) this.addExperience();
          if (this.education.length === 0) this.addEducation();
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading resume:', err);
        this.error.set(err.message || 'Failed to load resume');
        this.loading.set(false);
      }
    });
  }

  // Experience methods
  addExperience(): void {
    this.experience.push({
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
      skills: []
    });
  }

  removeExperience(index: number): void {
    if (this.experience.length > 1) {
      this.experience.splice(index, 1);
    }
  }

  // Education methods
  addEducation(): void {
    this.education.push({
      degree: '',
      school: '',
      graduationYear: '',
      courses: []
    });
  }

  removeEducation(index: number): void {
    if (this.education.length > 1) {
      this.education.splice(index, 1);
    }
  }

  // Skills methods
  addSkill(): void {
    if (this.skillInput.trim()) {
      this.skills.push(this.skillInput.trim());
      this.skillInput = '';
    }
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }

  onSubmit(): void {
    this.error.set(null);

    // Validation
    if (!this.fullName.trim()) {
      this.error.set('Full name is required');
      return;
    }

    // Check if at least one experience has title
    const hasValidExperience = this.experience.some(exp => exp.title.trim());
    if (!hasValidExperience) {
      this.error.set('At least one work experience with a title is required');
      return;
    }

    // Check if at least one education has degree
    const hasValidEducation = this.education.some(edu => edu.degree.trim());
    if (!hasValidEducation) {
      this.error.set('At least one education entry with a degree is required');
      return;
    }

    this.loading.set(true);

    // Build resume object
    const resume: Resume = {
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      location: this.location.trim(),
      summary: this.summary.trim(),
      skills: this.skills,
      experience: this.experience.filter(exp => exp.title.trim()),
      education: this.education.filter(edu => edu.degree.trim())
    };

    const operation = this.isEditMode && this.resumeId
      ? this.resumeService.updateResume(this.resumeId, resume)
      : this.resumeService.createResume(resume);

    operation.subscribe({
      next: (response) => {
        console.log('Resume saved:', response);
        this.loading.set(false);
        
        // Redirect to resume detail or list
        if (response.resume && response.resume._id) {
          this.router.navigate(['/resumes', response.resume._id]);
        } else {
          this.router.navigate(['/resumes']);
        }
      },
      error: (err) => {
        console.error('Save error:', err);
        this.loading.set(false);
        this.error.set(err.message || 'Failed to save resume');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/resumes']);
  }
}
