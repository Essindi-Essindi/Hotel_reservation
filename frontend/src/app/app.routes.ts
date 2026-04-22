import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { AdminLayoutComponent } from './admin/layout/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';

export const routes: Routes = [
  // ── Public pages ──
  { path: '',        component: LandingComponent },
  { path: 'sign-in', component: SignInComponent  },
  { path: 'sign-up', component: SignUpComponent  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
    ],
  },

  // ── Fallback ──
  { path: '**', redirectTo: '' },
];