import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { map, take, filter, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private supabase: SupabaseService, private router: Router) {}

  canActivate() {
    // Espera a que la restauración inicial de sesión termine y luego decide
    return this.supabase.sessionRestored$.pipe(
      filter(restored => restored === true),
      take(1),
      switchMap(() => this.supabase.currentUser$),
      take(1),
      map(user => {
        if (user) {
          // Guardar la última ruta visitada
          localStorage.setItem('lastRoute', this.router.url);
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}