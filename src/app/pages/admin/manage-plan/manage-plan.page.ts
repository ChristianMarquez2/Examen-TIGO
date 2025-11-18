import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { PhotoService } from 'src/app/services/photo.service'; // IMPORTANTE: Importar el servicio
import { PlanMovil } from 'src/app/models/interfaces';

@Component({
  selector: 'app-manage-plan',
  templateUrl: './manage-plan.page.html',
  styleUrls: ['./manage-plan.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class ManagePlanPage implements OnInit {
  planForm: FormGroup;
  planId: number | null = null;
  imagenSeleccionada: any = null; // Para mostrar preview
  archivoImagen: File | null = null; // Para enviar a Supabase

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private photoService: PhotoService, // Inyección del servicio de fotos
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    // Formulario con TODOS los campos del examen
    this.planForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      segmento: ['Básico / Entrada', Validators.required],
      datos: ['', Validators.required],
      minutos: ['', Validators.required],
      sms: ['Ilimitados'],
      velocidad: [''],
      redes_sociales: [''],
      whatsapp: [''],
      llamadas_internacionales: [''],
      roaming: ['No incluido'],
      descripcion: ['']
    });
  }

  async ngOnInit() {
    // Verificar si estamos editando (viene un ID en la URL)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.planId = +id;
      await this.cargarDatosPlan(id);
    }
  }

  async cargarDatosPlan(id: string) {
    const { data, error } = await this.supabase.getPlanById(id);
    if (data) {
      const plan = data as PlanMovil;
      this.planForm.patchValue(plan);
      this.imagenSeleccionada = plan.imagen_url; // Mostrar imagen existente
    }
  }

  // === CÁMARA (ARQUITECTURA MODERNA) ===
  // Ahora usamos el servicio en lugar de llamar a Camera directamente
  async tomarFoto() {
    const result = await this.photoService.tomarFoto();
    
    if (result) {
      this.imagenSeleccionada = result.webPath; // Para visualizar
      this.archivoImagen = result.file;         // Para subir
    }
  }

  // === GUARDAR ===
  async guardarPlan() {
    if (this.planForm.invalid) return;

    const loading = await this.loadingCtrl.create({ message: 'Guardando plan...' });
    await loading.present();

    const datosPlan: PlanMovil = this.planForm.value;

    try {
      if (this.planId) {
        // MODO EDICIÓN
        // Nota: Si quisieras actualizar imagen en edit, implementa la lógica aquí
        await this.supabase.updatePlan(this.planId, datosPlan);
      } else {
        // MODO CREACIÓN
        await this.supabase.createPlan(datosPlan, this.archivoImagen || undefined);
      }

      await loading.dismiss();
      this.mostrarToast('Plan guardado correctamente');
      this.router.navigate(['/dashboard']);

    } catch (error: any) {
      await loading.dismiss();
      this.mostrarToast('Error al guardar: ' + error.message);
    }
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }
}