import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private supabase: SupabaseService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    // Esperar a que la sesión haya sido restaurada (evita falsos negativos en reload)
    await this.supabase.waitForSessionRestore();

    const user = this.supabase.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const perfil = await this.supabase.getUserProfile(user.id);
    
    if (perfil?.rol === 'asesor_comercial') {
      localStorage.setItem('lastRoute', this.router.url); // Guardar la última ruta visitada
      return true;
    } else {
      this.router.navigate(['/tabs/home']); 
      return false;
    }
  }
}