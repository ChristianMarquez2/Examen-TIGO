import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private supabase: SupabaseService, private router: Router) {
    this.initializeApp();
  }

  // Hacer async para esperar restauración de sesión antes de navegar
  async initializeApp() {
    // Restaurar sesión al cargar la app
    this.supabase.restoreSession();

    // Esperar a que la restauración inicial se complete
    await this.supabase.waitForSessionRestore();

    // Redirigir a la última página visitada si hay sesión activa
    const lastRoute = localStorage.getItem('lastRoute');
    const currentUser = this.supabase.getCurrentUser();
    if (currentUser && lastRoute) {
      this.router.navigateByUrl(lastRoute);
    }
  }
}