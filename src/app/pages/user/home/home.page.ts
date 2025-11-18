import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { PlanMovil } from 'src/app/models/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class HomePage implements OnInit {
  planes: PlanMovil[] = [];
  textoBuscar: string = '';
  segmentoFiltro: string = 'todos';
  isGuest: boolean = true; // Por defecto asumimos invitado

  constructor(private supabase: SupabaseService) {}

  ngOnInit() {
    // Verificar si hay usuario real
    const user = this.supabase.getCurrentUser();
    this.isGuest = !user; // Si no hay usuario, es invitado

    this.cargarPlanes();
  }

  async cargarPlanes() {
    // Reutilizamos la lógica: los planes son públicos en la BD
    const { data } = await this.supabase.getPlanes({
      texto: this.textoBuscar,
      segmento: this.segmentoFiltro
    });
    
    if (data) {
      this.planes = data as PlanMovil[];
    }
  }

  filtrar() {
    this.cargarPlanes();
  }
}