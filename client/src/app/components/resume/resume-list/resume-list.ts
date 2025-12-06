import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-resume-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './resume-list.html',
  styleUrls: ['./resume-list.css'],
})
export class ResumeList {
  resumes: any[] = [];
  filteredResumes: any[] = [];
  searchTerm = '';

  filter() {
    this.filteredResumes = this.resumes.filter(r =>
      r.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
