import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { ResumeList } from './components/resume/resume-list/resume-list';
import { ResumeDetail } from './components/resume/resume-detail/resume-detail';
import { ResumeForm } from './components/resume/resume-form/resume-form';
import { Profile } from './components/profile/profile';

import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },

  // Auth
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },

  // Resumes
  { path: 'resumes', component: ResumeList, canActivate: [authGuard] },
  { path: 'resumes/new', component: ResumeForm, canActivate: [authGuard] },       
  { path: 'resumes/:id', component: ResumeDetail, canActivate: [authGuard] },    
  { path: 'resumes/:id/edit', component: ResumeForm, canActivate: [authGuard] },

  // Profile
  { path: 'profile', component: Profile, canActivate: [authGuard] },

  // Wildcard - home redirect
  { path: '**', redirectTo:''}
];
