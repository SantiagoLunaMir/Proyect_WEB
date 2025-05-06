import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../services/auth.service';
import { Observable } from 'rxjs';

interface MenuItem {
  label: string;
  path:  string;
  roles: string[];
}

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
  host: { class: 'nav-menu' }
})
export class NavMenuComponent {
  user$: Observable<User|null>;
  open = false;                       // controla el despliegue

  menu: MenuItem[] = [
    { label: 'Home',           path: '/',                roles: ['admin','technician','delivery','guest'] },
    { label: 'Piezas',         path: '/',                roles: ['admin','technician','delivery','guest'] },
    { label: 'Admin Usuarios', path: '/admin/users',     roles: ['admin'] },
    { label: 'Admin Doctores', path: '/admin/doctors',   roles: ['admin'] },
    { label: 'Trabajos',       path: '/tech/works',      roles: ['admin','technician'] },
    { label: 'Calendario',     path: '/tech/calendar',   roles: ['admin','technician'] },
    { label: 'Entregas',       path: '/tech/deliveries', roles: ['admin','delivery'] },
    { label: 'Perfil',         path: '/profile',         roles: ['admin','technician','delivery'] }
  ];

  constructor(private auth: AuthService) {
    this.user$ = this.auth.user$;
  }

  toggle(): void {
    this.open = !this.open;
  }

  allowedItems(user: User|null): MenuItem[] {
    const role = user?.role ?? 'guest';
    return this.menu.filter(m => m.roles.includes(role));
  }

  logout(): void {
    this.auth.logout();
    this.open = false;
  }
}
