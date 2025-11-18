import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private supabase: SupabaseService, private router: Router) {}

  canActivate() {
    return this.supabase.currentUser$.pipe(
      take(1),
      map(user => {
        if (user) return true;
        
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}