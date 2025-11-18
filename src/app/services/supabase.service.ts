import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlanMovil, Profile } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private _currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.key);

    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this._currentUser.next(session?.user ?? null);
    });

    this.supabase.auth.onAuthStateChange((_, session) => {
      this._currentUser.next(session?.user ?? null);
    });
  }

  // === AUTENTICACIÓN ===
  get currentUser$(): Observable<User | null> {
    return this._currentUser.asObservable();
  }

  getCurrentUser(): User | null {
    return this._currentUser.value;
  }

  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({ email, password });
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data as Profile;
  }

  async updateUserProfile(userId: string, updates: Partial<Profile>) {
    return await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
  }

  // === GESTIÓN DE PLANES ===

  // CORRECCIÓN IMPORTANTE: Acepta boolean (para Admin) u objeto (para Filtros)
  async getPlanes(param: boolean | { texto?: string, segmento?: string } = true) {
    let query = this.supabase
      .from('planes_moviles')
      .select('*')
      .order('precio', { ascending: true });

    if (typeof param === 'boolean') {
      // MODO ADMIN: Si es false, trae todo (activos e inactivos). Si es true, solo activos.
      if (param === true) {
        query = query.eq('activo', true);
      }
    } else {
      // MODO USUARIO (Filtros): Siempre solo activos
      query = query.eq('activo', true);

      if (param.texto) {
        query = query.ilike('nombre', `%${param.texto}%`);
      }
      if (param.segmento && param.segmento !== 'todos') {
        query = query.eq('segmento', param.segmento);
      }
    }
    return await query;
  }

  async getPlanById(id: string) {
    return await this.supabase.from('planes_moviles').select('*').eq('id', id).single();
  }

  async createPlan(plan: PlanMovil, imagenFile?: File) {
    let imagenUrl = null;
    if (imagenFile) {
      const { data, error } = await this.uploadImage(imagenFile);
      if (!error) {
        const urlData = this.supabase.storage.from('planes-imagenes').getPublicUrl(data.path);
        imagenUrl = urlData.data.publicUrl;
      }
    }
    return await this.supabase.from('planes_moviles').insert({ ...plan, imagen_url: imagenUrl });
  }

  async updatePlan(id: number, plan: Partial<PlanMovil>) {
    return await this.supabase.from('planes_moviles').update(plan).eq('id', id);
  }

  async togglePlanStatus(id: number, estadoActual: boolean) {
    return await this.supabase.from('planes_moviles').update({ activo: !estadoActual }).eq('id', id);
  }

  // === CONTRATACIÓN ===
  async contratarPlan(userId: string, planId: number) {
    return await this.supabase.from('contrataciones').insert({
      user_id: userId,
      plan_id: planId,
      estado: 'activo'
    });
  }

  // === STORAGE ===
  private async uploadImage(file: File) {
    const fileName = `${Date.now()}_${file.name}`;
    return await this.supabase.storage.from('planes-imagenes').upload(fileName, file);
  }

  getClient() {
    return this.supabase;
  }
}