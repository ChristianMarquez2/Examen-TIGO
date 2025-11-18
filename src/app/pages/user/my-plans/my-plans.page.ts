import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router'; // <-- Importar RouterModule
import { SupabaseService } from 'src/app/services/supabase.service';
import { ChatListPage } from '../../admin/chat-list/chat-list.page';

@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.page.html',
  styleUrls: ['./my-plans.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    RouterModule, // <-- Aseguramos RouterLink esté disponible
    DatePipe, 
    UpperCasePipe,
    ChatListPage
  ]
})
export class MyPlansPage implements OnInit {
  contrataciones: any[] = [];
  userId: string = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  async ngOnInit() {
    const user = this.supabase.getCurrentUser();
    if (user) {
      this.userId = user.id;
      const { data } = await this.supabase.getClient()
        .from('contrataciones')
        .select('*, planes_moviles(*)') 
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false });
      
      this.contrataciones = data || [];
    }
  }

  irAlChat() {
    this.router.navigate(['/tabs/chat-user']);
  }
}
