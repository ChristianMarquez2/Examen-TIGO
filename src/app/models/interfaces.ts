// src/app/models/interfaces.ts

export interface Profile {
  id: string; // uuid de Supabase Auth
  email: string;
  rol: 'usuario_registrado' | 'asesor_comercial';
  nombre_completo?: string; // Nuevo: opcional
  telefono?: string;       // Nuevo: opcional
  avatar_url?: string;
}

export interface PlanMovil {
  id: number;
  nombre: string;
  precio: number;
  segmento: string;
  datos: string;
  minutos: string;
  sms: string;
  velocidad?: string;
  redes_sociales?: string;
  whatsapp?: string;
  llamadas_internacionales?: string;
  roaming?: string;
  descripcion?: string;
  imagen_url?: string;
  activo: boolean; // Para borrado lógico
}

export interface MensajeChat {
  id?: number;
  created_at?: string;
  user_id: string;
  contenido: string;
  es_asesor: boolean;
  local?: boolean; // Mensaje creado localmente (optimistic update) — no persistido aún
}

export interface Contratacion {
  id?: number;
  user_id: string;
  plan_id: number;
  estado: 'activo' | 'cancelado';
  fecha_inicio: string;
  // Join opcional: Para cuando traigamos la contratación con los detalles del plan
  planes_moviles?: PlanMovil; 
  profiles?: Profile;
}