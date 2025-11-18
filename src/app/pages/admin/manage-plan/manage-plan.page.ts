import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { PhotoService } from 'src/app/services/photo.service';
import { PlanMovil } from 'src/app/models/interfaces';

@Component({
  selector: 'app-manage-plan',
  templateUrl: './manage-plan.page.html',
  styleUrls: ['./manage-plan.page.scss'], // Usaremos este SCSS
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class ManagePlanPage implements OnInit {
  planForm: FormGroup;
  planId: number | null = null;
  imagenSeleccionada: any = null;
  archivoImagen: File | null = null;
  
  // Lista de segmentos para el Select
  segmentos = ['Básico / Entrada', 'Medio / Estándar', 'Premium / Alto'];

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private photoService: PhotoService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    // Formulario con TODOS los campos del examen
    this.planForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      segmento: [this.segmentos[0], Validators.required],
      datos: ['', Validators.required],
      minutos: ['', Validators.required],
      sms: ['Ilimitados'],
      velocidad: [''],
      redes_sociales: [''],
      whatsapp: [''],
      llamadas_internacionales: [''],
      roaming: ['No incluido'],
      descripcion: [''],
      // Agregamos un campo PROMO opcional para manejar la imagen de la pantalla
      promocion: [''], 
    });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.planId = +id;
      await this.cargarDatosPlan(id);
    }
  }

  async cargarDatosPlan(id: string) {
    const { data } = await this.supabase.getPlanById(id);
    if (data) {
      const plan = data as PlanMovil;
      this.planForm.patchValue(plan);
      this.imagenSeleccionada = plan.imagen_url; 
    }
  }

  async tomarFoto() {
    const result = await this.photoService.tomarFoto();
    if (result) {
      this.imagenSeleccionada = result.webPath; 
      this.archivoImagen = result.file;
    }
  }

  async guardarPlan() {
    if (this.planForm.invalid) return;

    const loading = await this.loadingCtrl.create({ message: 'Guardando plan...' });
    await loading.present();

    const datosPlan: PlanMovil = this.planForm.value;

    try {
      if (this.planId) {
        await this.supabase.updatePlan(this.planId, datosPlan);
      } else {
        await this.supabase.createPlan(datosPlan, this.archivoImagen || undefined);
      }

      await loading.dismiss();
      this.mostrarToast('Plan guardado correctamente');
      // CORRECCIÓN: Redirigir al dashboard dentro de tabs
      this.router.navigate(['/tabs/dashboard']);

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