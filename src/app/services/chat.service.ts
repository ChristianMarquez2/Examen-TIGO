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

  // Iniciar chat para un cliente concreto (filtrado)
  async iniciarChat(clienteId: string) {
    // Limpiar canal previo si existe
    if (this.chatChannel) {
      try { await this.supabase.removeChannel(this.chatChannel); } catch(e) { /* ignore */ }
      this.chatChannel = null;
    }

    // Obtener historial solo del cliente
    await this.obtenerHistorial(clienteId);

    // Crear canal y escuchar inserts (filtramos en el handler para asegurar compatibilidad)
    this.chatChannel = this.supabase.channel(`public:chat:${clienteId}`);

    this.chatChannel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'mensajes_chat' },
      (payload) => {
        const nuevoMensaje = payload.new as MensajeChat;

        // Solo procesar si el mensaje pertenece a ESTE hilo (clienteId)
        if (nuevoMensaje.user_id !== clienteId) return;

        // Si existe un mensaje local (optimistic) que coincida, reemplazarlo
        const listaActual = this._mensajes.value.slice();
        const localIndex = listaActual.findIndex(m =>
          m.local === true &&
          m.user_id === nuevoMensaje.user_id &&
          m.contenido === nuevoMensaje.contenido &&
          m.es_asesor === nuevoMensaje.es_asesor
        );

        if (localIndex !== -1) {
          // Reemplazar el mensaje local por el mensaje real del servidor
          listaActual[localIndex] = nuevoMensaje;
        } else {
          listaActual.push(nuevoMensaje);
        }

        this._mensajes.next(listaActual);
        this._usuarioEscribiendo.next(false);
      }
    );

    // Broadcast typing - lo dejamos igual
    this.chatChannel.on('broadcast', { event: 'typing' }, (payload) => {
      const data = payload['payload'];
      if (data && data.isTyping) {
        this._usuarioEscribiendo.next(true);
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
          this._usuarioEscribiendo.next(false);
        }, 3000);
      }
    });

    await this.chatChannel.subscribe();
  }

  // Obtener historial filtrado por cliente
  async obtenerHistorial(clienteId: string) {
    const { data } = await this.supabase
      .from('mensajes_chat')
      .select('*')
      .eq('user_id', clienteId)
      .order('created_at', { ascending: true });

    if (data) {
      this._mensajes.next(data as MensajeChat[]);
    } else {
      this._mensajes.next([]);
    }
  }

  // Enviar mensaje con optimistic update
  async enviarMensaje(contenido: string, userId: string, esAsesor: boolean) {
    // Optimistic: crear objeto local marcado como local:true
    const mensajeLocal: MensajeChat = {
      user_id: userId,
      contenido,
      es_asesor: esAsesor,
      created_at: new Date().toISOString(),
      local: true
    };

    // Añadir inmediatamente a la lista local
    this._mensajes.next([...this._mensajes.value, mensajeLocal]);

    // Intentar insertar en Supabase (cuando llegue el INSERT, el realtime lo reemplazará)
    try {
      await this.supabase.from('mensajes_chat').insert({
        user_id: userId,
        contenido,
        es_asesor: esAsesor
      });
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      // Opcional: marcar fallo o eliminar mensaje local
    }
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

  async desconectar() {
    if (this.chatChannel) {
      try { await this.supabase.removeChannel(this.chatChannel); } catch(e) { /* ignore */ }
      this.chatChannel = null;
    }
    // Limpiar mensajes locales al desconectar (opcional)
    this._mensajes.next([]);
  }
}