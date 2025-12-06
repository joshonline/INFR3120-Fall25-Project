import { Component } from '@angular/core';

@Component({
  selector: 'app-resume-list',
  imports: [],
  templateUrl: './resume-list.html',
  styleUrl: './resume-list.css',
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
