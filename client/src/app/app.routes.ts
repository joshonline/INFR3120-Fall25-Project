import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { ResumeList } from './components/resume/resume-list/resume-list';
import { ResumeDetail } from './components/resume/resume-detail/resume-detail';
import { ResumeForm } from './components/resume/resume-form/resume-form';

export const routes: Routes = [
  { path: '', component: Home },

  // Auth
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Resumes
  { path: 'resumes', component: ResumeList },
  { path: 'resumes/new', component: ResumeForm },       
  { path: 'resumes/:id', component: ResumeDetail },    
  { path: 'resumes/:id/edit', component: ResumeForm }, 
];
