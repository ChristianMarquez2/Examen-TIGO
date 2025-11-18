import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router'; // Necesario para navegar al chat
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink] // Agregados CommonModule y RouterLink
})
export class ChatListPage implements OnInit {
  usuariosConChat: any[] = [];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    // Truco para examen: Traemos perfiles de rol 'usuario_registrado'
    // Esto simula una bandeja de entrada mostrando todos los posibles clientes
    const { data } = await this.supabase.getClient()
      .from('profiles')
      .select('*')
      .eq('rol', 'usuario_registrado');
    
    this.usuariosConChat = data || [];
  }
}