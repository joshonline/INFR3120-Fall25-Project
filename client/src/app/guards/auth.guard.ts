import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    // Check if token is expired
    if (authService.isTokenExpired()) {
      console.log('Token expired, redirecting to login');
      authService.logout();
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    return true;
  }
  
  // Not authenticated, redirect to login
  console.log('Not authenticated, redirecting to login');
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    router.navigate(['/resumes']);
    return false;
  }
  
  return true;
};