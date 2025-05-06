import { Injectable }                   from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService }                  from '../services/auth.service';
import { map }                          from 'rxjs/operators';
import { Observable }                   from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const allowedRoles = route.data['roles'] as string[] || [];

    return this.auth.user$.pipe(
      map(user => {
        if (user && allowedRoles.includes(user.role)) {
          return true;
        }
        // Si no está autorizado, redirige al home
        this.router.navigate(['/']);
        return false;
      })
    );
  }
}
