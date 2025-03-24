// src/app/app.routes.ts
import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {GymMapComponent} from './components/gym-map/gym-map.component';
import {SignupComponent} from './components/signup/signup.component';
import {AuthGuard} from './guards/auth.guard';
import {AdminDashboardComponent} from './components/admin-dashboard/admin-dashboard.component';
import {adminGuard} from './guards/admin.guard';
import {GymListComponent} from './components/gym-list/gym-list.component';
import {GymDetailComponent} from './components/gym-detail/gym-detail.component';
import {AdminGymListComponent} from './components/admin-gym-list/admin-gym-list.component';


// src/app/app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: 'gyms', component: AdminGymListComponent },
      { path: 'gyms/create', component: AdminDashboardComponent },
      { path: 'gyms/edit/:id', component: AdminDashboardComponent }
    ]
  },
  {
    path: 'map',
    component: GymMapComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'gyms',
    component: GymListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'gym/:id',
    component: GymDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [adminGuard]  // This is correct
  },
  {
    path: 'admin/gyms',
    component: AdminGymListComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/gyms/edit/:id',
    component: AdminDashboardComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/gyms/create',
    component: AdminDashboardComponent,
    canActivate: [adminGuard]
  }
];
