// frontend/src/app/app.routing.ts
import { Route } from '@angular/router';

import { HomeComponent }               from './public/home/home.component';
import { LoginComponent }              from './login/login.component';
import { RegisterComponent }           from './register/register.component';

import { UserManagementComponent }     from './admin/user-management.component';
import { DoctorManagementComponent }   from './admin/doctor-management.component';
import { PieceListComponent }          from './admin/piece-list/piece-list.component';
import { PieceFormComponent }          from './admin/piece-form/piece-form.component';

import { WorkListComponent }           from './tech/work-list.component';
import { WorkFormComponent }           from './tech/work-form.component';
import { CalendarComponent }           from './tech/calendar.component';
import { DeliveryListComponent }       from './tech/delivery-list.component';

import { AuthGuard }                   from './guards/auth.guard';
import { RoleGuard }                   from './guards/role.guard';

import { ProfileComponent }            from './profile/profile.component';

/* --- Catálogo público --- */
import { CatalogComponent }            from './catalog/catalog.component';
import { PieceDetailComponent }        from './catalog/piece-detail.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  /* ---------- Panel de administración ---------- */
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: 'users',          component: UserManagementComponent },
      { path: 'doctors',        component: DoctorManagementComponent },
      { path: 'pieces',         component: PieceListComponent },
      { path: 'pieces/new',     component: PieceFormComponent },
      { path: 'pieces/edit/:id',component: PieceFormComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },

  /* ---------- Panel técnico / repartidor ---------- */
  {
    path: 'tech',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'technician', 'delivery'] },
    children: [
      { path: 'works',          component: WorkListComponent },
      { path: 'works/new',      component: WorkFormComponent },
      { path: 'works/edit/:id', component: WorkFormComponent },
      { path: 'calendar',       component: CalendarComponent },
      { path: 'deliveries',     component: DeliveryListComponent },
      { path: '', redirectTo: 'works', pathMatch: 'full' }
    ]
  },

  /* ---------- Perfil ---------- */
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  /* ---------- Catálogo público ---------- */
  { path: 'catalog',      component: CatalogComponent },
  { path: 'catalog/:id',  component: PieceDetailComponent },

  /* ---------- Wildcard ---------- */
  { path: '**', redirectTo: '' }
];
