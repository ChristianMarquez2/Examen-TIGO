import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { MensajeChat, Profile } from 'src/app/models/interfaces';

@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.page.html',
  styleUrls: ['./chat-admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChatAdminPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content!: IonContent;

  mensajes: MensajeChat[] = [];
  nuevoMensaje = '';
  clienteEscribiendo = false; // Bonus
  
  // ID del CLIENTE con el que estamos hablando (viene de la URL)
  clienteId: string = '';
  clientePerfil: Profile | null = null;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private supabase: SupabaseService
  ) {}

  async ngOnInit() {
    // 1. Obtener el ID del cliente de la URL (ej: /chat-admin/uuid-del-cliente)
    this.clienteId = this.route.snapshot.paramMap.get('id') || '';

    if (this.clienteId) {
      // Cargar nombre del cliente para el título
      this.clientePerfil = await this.supabase.getUserProfile(this.clienteId);

      // 2. Iniciar conexión Realtime
      this.chatService.iniciarChat(this.clienteId);

      // 3. Suscribirse a los mensajes
      this.chatService.mensajes$.subscribe(msgs => {
        // FILTRO CRÍTICO: Solo mostrar mensajes de ESTE cliente específico (conversación)
        this.mensajes = msgs.filter(m => m.user_id === this.clienteId);
        this.scrollToBottom();
      });

      // 4. Bonus: Detectar si el cliente escribe
      this.chatService.usuarioEscribiendo$.subscribe(isTyping => {
        this.clienteEscribiendo = isTyping;
      });
    }
  }

  enviar() {
    if (!this.nuevoMensaje.trim()) return;

    // AQUÍ ESTÁ LA CLAVE: pasamos 'true' porque somos el ASESOR
    // El mensaje se guarda asociado al ID del cliente para mantener el hilo
    this.chatService.enviarMensaje(this.nuevoMensaje, this.clienteId, true);
    
    this.nuevoMensaje = '';
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