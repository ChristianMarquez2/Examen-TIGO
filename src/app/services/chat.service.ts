import { Injectable } from '@angular/core';
import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { MensajeChat } from '../models/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private supabase: SupabaseClient;
  private chatChannel: RealtimeChannel | null = null;

  private _mensajes = new BehaviorSubject<MensajeChat[]>([]);
  public mensajes$ = this._mensajes.asObservable();

  private _usuarioEscribiendo = new BehaviorSubject<boolean>(false);
  public usuarioEscribiendo$ = this._usuarioEscribiendo.asObservable();

  private typingTimeout: any;

  constructor() {
    // SOLUCIÓN ERROR 1: Casteamos environment a 'any' para que TS no reclame por la propiedad supabase
    this.supabase = createClient((environment as any).supabase.url, (environment as any).supabase.key);
  }

  iniciarChat(clienteId: string) { 
    this.obtenerHistorial();

    this.chatChannel = this.supabase.channel('public:chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensajes_chat' },
        (payload) => {
          const nuevoMensaje = payload.new as MensajeChat;
          const listaActual = this._mensajes.value;
          this._mensajes.next([...listaActual, nuevoMensaje]);
          this._usuarioEscribiendo.next(false);
        }
      )
      .on('broadcast', { event: 'typing' }, (payload) => {
        // SOLUCIÓN ERROR 2: Usamos notación de corchetes ['payload'] como pide el error TS4111
        const data = payload['payload']; 
        
        if (data && data.isTyping) {
          this._usuarioEscribiendo.next(true);
          clearTimeout(this.typingTimeout);
          this.typingTimeout = setTimeout(() => {
            this._usuarioEscribiendo.next(false);
          }, 3000);
        }
      })
      .subscribe();
  }

  async obtenerHistorial() {
    const { data } = await this.supabase
      .from('mensajes_chat')
      .select('*')
      .order('created_at', { ascending: true });

    if (data) {
      this._mensajes.next(data as MensajeChat[]);
    }
  }

  async enviarMensaje(contenido: string, userId: string, esAsesor: boolean) {
    await this.supabase.from('mensajes_chat').insert({
      user_id: userId,
      contenido,
      es_asesor: esAsesor
    });
  }

  notificarEscribiendo() {
    if (this.chatChannel) {
      this.chatChannel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { isTyping: true },
      });
    }
  }

  desconectar() {
    if (this.chatChannel) {
      this.supabase.removeChannel(this.chatChannel);
    }
  }
}