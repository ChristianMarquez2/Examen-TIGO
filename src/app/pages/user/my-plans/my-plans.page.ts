import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MyPlansPage implements OnInit {
  contrataciones: any[] = [];

  constructor(private supabase: SupabaseService, private router: Router) {}

  async ngOnInit() {
    const user = this.supabase.getCurrentUser();
    if (user) {
      // Join 'mágico' de Supabase para traer datos de tablas relacionadas
      const { data } = await this.supabase.getClient()
        .from('contrataciones')
        .select('*, planes_moviles(*)') // Trae los detalles del plan asociado
        .eq('user_id', user.id);
      
      this.contrataciones = data || [];
    }
  }

  irAlChat() {
    this.router.navigate(['/chat-user']);
  }
}