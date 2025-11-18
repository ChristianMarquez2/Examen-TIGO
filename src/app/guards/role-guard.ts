import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private supabase: SupabaseService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const user = this.supabase.getCurrentUser();
    if (!user) return false;

    const perfil = await this.supabase.getUserProfile(user.id);
    
    if (perfil?.rol === 'asesor_comercial') {
      return true;
    } else {
      // CORRECCIÓN: Redirigir a la nueva ruta dentro de tabs
      this.router.navigate(['/tabs/home']); 
      return false;
    }
  }
}