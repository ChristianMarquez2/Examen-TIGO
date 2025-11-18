import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Definimos una interfaz para el dato que vamos a recibir (con los JOINs)
interface SolicitudDetalle {
  id: number;
  user_id: string; 
  estado: string;
  created_at: string;
  profiles: { nombre_completo: string | null }; 
  planes_moviles: { nombre: string }; 
}

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink] 
})
export class RequestsPage implements OnInit {
  solicitudes: SolicitudDetalle[] = [];
  
  // Cambiamos el valor inicial a 'PENDIENTE'
  filtroEstado: 'PENDIENTE' | 'TODOS' | 'APROBADO' | 'RECHAZADO' = 'PENDIENTE'; 

  constructor(
    private supabase: SupabaseService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.cargarSolicitudes();
  }

  /**
   * Carga todas las solicitudes con JOINs y aplica el filtro de estado actual.
   */
  async cargarSolicitudes() {
    const { data, error } = await this.supabase.getClient()
      .from('contrataciones')
      // Ajustamos el filtro en la consulta si no es 'TODOS' para mejor rendimiento
      .select('id, user_id, estado, created_at, profiles(nombre_completo), planes_moviles(nombre)') 
      .order('created_at', { ascending: false }); 
    
    if (error) {
      this.presentAlert('Error de Carga', `No se pudieron cargar las solicitudes: ${error.message}`);
      return;
    }

    // CORRECCIÓN CLAVE: Castear a 'unknown' primero. 
    // Esto resuelve el error de incompatibilidad de tipos en las uniones de Supabase.
    let loadedSolicitudes = (data as unknown as SolicitudDetalle[] || []);

    // Filtramos si el estado no es TODOS (usamos .toUpperCase() para asegurar la comparación)
    if (this.filtroEstado !== 'TODOS') {
      loadedSolicitudes = loadedSolicitudes.filter(s => s.estado.toUpperCase() === this.filtroEstado);
    }
    
    this.solicitudes = loadedSolicitudes;
  }

  /**
   * Llama al servicio para actualizar el estado de la solicitud.
   */
  async actualizarEstado(solicitudId: number, nuevoEstado: 'aprobado' | 'rechazado') {
    const { error } = await this.supabase.updateContratacionEstado(solicitudId, nuevoEstado);

    if (error) {
      this.presentAlert('Error de Actualización', `No se pudo actualizar la solicitud: ${error.message}`);
    } else {
      // Mensaje de éxito más específico
      const estadoDisplay = nuevoEstado === 'aprobado' ? 'Aprobada' : 'Rechazada';
      this.presentAlert('Éxito', `Solicitud ${estadoDisplay} con éxito.`);
      
      // Recarga la lista para reflejar el cambio
      this.cargarSolicitudes();
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}