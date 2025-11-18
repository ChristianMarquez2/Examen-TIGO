import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ViewWillEnter } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { PlanMovil } from 'src/app/models/interfaces';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class DashboardPage implements ViewWillEnter {
  planes: PlanMovil[] = [];

  constructor(
    private supabase: SupabaseService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  // Se ejecuta cada vez que entras a la página (útil si vienes de editar un plan)
  async ionViewWillEnter() {
    this.cargarPlanes();
  }

  async cargarPlanes() {
    // false = traer todos (activos e inactivos) para el admin
    const { data, error } = await this.supabase.getPlanes({});

    if (data) {
      this.planes = data as PlanMovil[];
    }
  }

  editarPlan(plan: PlanMovil) {
    // Navegamos a la pantalla de edición pasando el objeto o ID
    this.router.navigate(['/manage-plan', { id: plan.id }]);
  }

  async confirmarCambioEstado(plan: PlanMovil) {
    const alert = await this.alertCtrl.create({
      header: plan.activo ? '¿Desactivar Plan?' : '¿Reactivar Plan?',
      message: `El plan ${plan.nombre} dejará de ser visible para los usuarios.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, cambiar',
          handler: async () => {
            await this.supabase.togglePlanStatus(plan.id!, plan.activo);
            this.cargarPlanes(); // Recargar lista
          }
        }
      ]
    });
    await alert.present();
  }
  
  logout() {
    this.supabase.signOut();
    this.router.navigate(['/login']);
  }
}