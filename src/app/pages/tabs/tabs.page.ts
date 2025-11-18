import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';
import { addIcons } from 'ionicons';
import { 
  home, 
  cart, 
  chatbubble, 
  person, 
  layers, 
  clipboard, 
  chatbubbles 
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TabsPage implements OnInit {
  isAsesor: boolean = false;

  constructor(private supabase: SupabaseService) {
    // Registramos los iconos para que puedan ser usados en el HTML
    addIcons({ 
      home, 
      cart, 
      chatbubble, 
      person, 
      layers, 
      clipboard, 
      chatbubbles 
    });
  }

  async ngOnInit() {
    const user = this.supabase.getCurrentUser();
    if (user) {
      const perfil = await this.supabase.getUserProfile(user.id);
      this.isAsesor = perfil?.rol === 'asesor_comercial';
    }
  }
}