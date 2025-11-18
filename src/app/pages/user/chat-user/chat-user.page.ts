import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { 
  IonicModule, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonFooter, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonButtons, 
  IonBackButton, 
  IonSpinner,
  IonItem
} from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { MensajeChat } from 'src/app/models/interfaces';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.page.html',
  styleUrls: ['./chat-user.page.scss'],
  standalone: true,
  imports: [
    IonicModule, // Importa todo el módulo o los componentes individuales abajo
    CommonModule, 
    FormsModule
    // Si IonicModule da error en standalone estricto, importa:
    // IonContent, IonHeader, IonToolbar, IonTitle, IonFooter, IonInput, IonButton, IonIcon, IonButtons, IonBackButton, IonSpinner
  ]
})
export class ChatUserPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content!: IonContent;
  
  mensajes: MensajeChat[] = [];
  nuevoMensaje = '';
  asesorEscribiendo = false; 
  userId: string = '';

  constructor(
    private chatService: ChatService,
    private supabase: SupabaseService
  ) {}

  ngOnInit() {
    const user = this.supabase.getCurrentUser();
    if(user) {
      this.userId = user.id;
      // El usuario se suscribe a "su propia sala" (su ID)
      this.chatService.iniciarChat(this.userId); 
    }

    // Suscribirse a mensajes
    this.chatService.mensajes$.subscribe(msgs => {
      // Filtramos para ver solo mensajes donde user_id sea el mío
      this.mensajes = msgs.filter(m => m.user_id === this.userId);
      this.scrollToBottom();
    });

    // Suscribirse a "Escribiendo..."
    this.chatService.usuarioEscribiendo$.subscribe(isTyping => {
      this.asesorEscribiendo = isTyping; 
      if (isTyping) this.scrollToBottom();
    });
  }

  enviar() {
    if (!this.nuevoMensaje.trim()) return;
    // false = No es asesor
    this.chatService.enviarMensaje(this.nuevoMensaje, this.userId, false); 
    this.nuevoMensaje = '';
    this.scrollToBottom();
  }

  onTyping() {
    this.chatService.notificarEscribiendo();
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content?.scrollToBottom(300);
    }, 100);
  }

  ngOnDestroy() {
    this.chatService.desconectar();
  }
}