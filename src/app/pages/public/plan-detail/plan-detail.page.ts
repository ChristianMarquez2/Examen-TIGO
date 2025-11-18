import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { PlanMovil } from 'src/app/models/interfaces';

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.page.html',
  styleUrls: ['./plan-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class PlanDetailPage implements OnInit {
  plan: PlanMovil | null = null;
  isLoggedIn = false;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    // 1. Obtener ID del plan de la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.cargarPlan(id);

    // 2. Verificar si hay usuario logueado
    const user = this.supabase.getCurrentUser();
    if (user) {
      this.isLoggedIn = true;
      this.userId = user.id;
    }
  }

  async cargarPlan(id: string) {
    const { data } = await this.supabase.getPlanById(id);
    this.plan = data as PlanMovil;
  }

  async contratar() {
    if (!this.isLoggedIn) {
      // Redirigir al login, pero guardar intención de retorno podría ser buena idea futura
      this.router.navigate(['/login']);
      return;
    }

    const loading = await this.loadingCtrl.create({ 
      message: 'Procesando contratación...',
      spinner: 'crescent'
    });
    await loading.present();

    // Insertar en tabla contrataciones
    // Nota: Asegúrate que tu función contratarPlan en el servicio acepte (userId, planId)
    const { error } = await this.supabase.contratarPlan(this.userId!, this.plan!.id!);

    await loading.dismiss();

    if (error) {
      const alert = await this.alertCtrl.create({ 
        header: 'Hubo un problema', 
        message: error.message, 
        buttons: ['Entendido'] 
      });
      await alert.present();
    } else {
      const alert = await this.alertCtrl.create({ 
        header: '¡Felicidades!', 
        subHeader: 'Plan Activado',
        message: `Has contratado el plan ${this.plan?.nombre} exitosamente.`, 
        buttons: ['Ir a Mis Planes'],
        cssClass: 'custom-alert'
      });
      await alert.present();
      
      alert.onDidDismiss().then(() => {
        this.router.navigate(['/my-plans']);
      });
    }
  }
}