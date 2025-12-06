import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';   // for *ngFor and date pipe
import { FormsModule } from '@angular/forms';     // for ngModel
import { RouterModule } from '@angular/router';   // for routerLink

import { ResumeService } from '../../services/resume';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class Home implements OnInit {

  resumes: any[] = [];
  filteredResumes: any[] = [];
  searchTerm = '';

  constructor(
    private resumeService: ResumeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadResumes();
  }

  loadResumes() {
    this.resumeService.getAllResumes().subscribe({
      next: (data) => {
        this.resumes = data;
        this.filteredResumes = data;
      },
      error: (err) => console.error(err)
    });
  }

  filter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredResumes = this.resumes.filter(r =>
      r.fullName.toLowerCase().includes(term) ||
      r.skills.some((s: string) => s.toLowerCase().includes(term))
    );
  }
}
