import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private supabase: SupabaseService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    // PASO CLAVE: Esperar a que Supabase termine de revisar si hay una sesión activa en caché.
    // Esto evita la redirección a /login durante la recarga.
    await this.supabase.waitForSessionRestore(); 

    // Después de la restauración, chequeamos el valor actual del usuario.
    const user = this.supabase.getCurrentUser();

    if (user) {
      return true;
    } else {
      // Redirigir si no hay usuario después de esperar la restauración
      this.router.navigate(['/login']); 
      return false;
    }
  }
}