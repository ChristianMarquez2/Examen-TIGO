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

  // Indicador de que la restauración inicial de sesión ya se completó
  private _sessionRestored = new BehaviorSubject<boolean>(false);
  public sessionRestored$ = this._sessionRestored.asObservable();

  constructor() {
    this.supabase = createClient((environment as any).supabase.url, (environment as any).supabase.key);

    // Restaurar sesión al iniciar la app
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this._currentUser.next(session?.user ?? null);
      if (session) {
        localStorage.setItem('supabaseSession', JSON.stringify(session));
      }
      this._sessionRestored.next(true);
    }).catch(() => {
      this._sessionRestored.next(true);
    });

    this.supabase.auth.onAuthStateChange((_, session) => {
      this._currentUser.next(session?.user ?? null);
      if (session) {
        localStorage.setItem('supabaseSession', JSON.stringify(session));
      } else {
        localStorage.removeItem('supabaseSession');
      }
      this._sessionRestored.next(true);
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

  // === PERFILES ===
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

  // === PLANES ===
  async getPlanes(param: boolean | { texto?: string, segmento?: string } = true) {
    let query = this.supabase
      .from('planes_moviles')
      .select('*')
      .order('precio', { ascending: true });

    if (typeof param === 'boolean') {
      if (param) query = query.eq('activo', true); // Solo activos
    } else {
      query = query.eq('activo', true);
      if (param.texto) query = query.ilike('nombre', `%${param.texto}%`);
      if (param.segmento && param.segmento !== 'todos') query = query.eq('segmento', param.segmento);
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

  // === CONTRATACIONES ===
  async contratarPlan(userId: string, planId: number) {
    return await this.supabase.from('contrataciones').insert({
      user_id: userId,
      plan_id: planId,
      estado: 'pendiente'
    });
  }

  async updateContratacionEstado(id: number, nuevoEstado: 'aprobado' | 'rechazado') {
    return await this.supabase.from('contrataciones').update({ estado: nuevoEstado }).eq('id', id);
  }

  // === STORAGE ===
  private async uploadImage(file: File) {
    const fileName = `${Date.now()}_${file.name}`;
    return await this.supabase.storage.from('planes-imagenes').upload(fileName, file);
  }

  // === OTROS ===
  getClient() {
    return this.supabase;
  }

  restoreSession() {
    const session = localStorage.getItem('supabaseSession');
    if (session) {
      const parsedSession = JSON.parse(session);
      this._currentUser.next(parsedSession.user ?? null);
    }
    this._sessionRestored.next(true);
  }

  waitForSessionRestore(): Promise<void> {
    if (this._sessionRestored.value) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const sub = this._sessionRestored.subscribe(v => {
        if (v) {
          sub.unsubscribe();
          resolve();
        }
      });
    });
  }
}
