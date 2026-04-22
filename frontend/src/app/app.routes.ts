import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AdminLayoutComponent } from './admin/layout/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import {  ReservationComponent } from './user/reservation/reservation';
import { History } from './user/history/history';

export const routes: Routes = [
  { path: '', component: LandingComponent },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent }
    ]
  },

   { path: 'history', component: History
   },

    { path: 'reservation', component: ReservationComponent
     },
];