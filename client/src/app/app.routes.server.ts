import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static routes (safe to prerender)
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'register',
    renderMode: RenderMode.Prerender
  },

  // Dynamic routes (MUST be client-side rendered)
  {
    path: 'resumes',
    renderMode: RenderMode.Client
  },
  {
    path: 'resumes/new',
    renderMode: RenderMode.Client
  },
  {
    path: 'resumes/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'resumes/:id/edit',
    renderMode: RenderMode.Client
  },
  {
    path: 'profile',
    renderMode: RenderMode.Client
  },

  // Wildcard fallback
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];