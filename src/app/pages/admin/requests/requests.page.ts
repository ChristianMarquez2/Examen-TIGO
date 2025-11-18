import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-requests',
  template: `
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-title>Solicitudes Nuevas</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item *ngFor="let req of solicitudes">
          <ion-label>
            <h2>Plan ID: {{ req.plan_id }}</h2>
            <p>Usuario: {{ req.user_id }}</p>
            <ion-badge color="warning">{{ req.estado }}</ion-badge>
          </ion-label>
        </ion-item>
        <div *ngIf="solicitudes.length === 0" class="ion-text-center ion-padding">
          <p>No hay solicitudes pendientes.</p>
        </div>
      </ion-list>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class RequestsPage implements OnInit {
  solicitudes: any[] = [];
  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    // Traer todas las contrataciones (simulación de bandeja de entrada)
    const { data } = await this.supabase.getClient().from('contrataciones').select('*');
    this.solicitudes = data || [];
  }
}