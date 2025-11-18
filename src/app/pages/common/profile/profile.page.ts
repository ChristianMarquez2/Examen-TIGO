import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Profile } from 'src/app/models/interfaces';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Añadido para el formulario

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'], // Asegúrate de tener estilos para el diseño
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule] // Importar ReactiveFormsModule
})
export class ProfilePage implements OnInit {
  perfil: Profile | null = null;
  profileForm: FormGroup;
  editMode: boolean = false; // Para alternar entre ver y editar

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private fb: FormBuilder, // Inyectar FormBuilder
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    // Inicializar el formulario con los campos del perfil
    this.profileForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      telefono: ['', Validators.pattern('^[0-9+ ]+$')], // Validar solo números y '+'
      email: [{ value: '', disabled: true }] // Email deshabilitado para edición
    });
  }

  async ngOnInit() {
    await this.loadProfile();
  }

  async loadProfile() {
    const user = this.supabase.getCurrentUser();
    if (user) {
      this.perfil = await this.supabase.getUserProfile(user.id);
      if (this.perfil) {
        // Rellenar el formulario con los datos del perfil
        this.profileForm.patchValue({
          nombre_completo: this.perfil.nombre_completo || '',
          telefono: this.perfil.telefono || '',
          email: this.perfil.email
        });
      }
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.profileForm.get('nombre_completo')?.enable();
      this.profileForm.get('telefono')?.enable();
    } else {
      this.profileForm.get('nombre_completo')?.disable();
      this.profileForm.get('telefono')?.disable();
      // Si se cancela la edición, recargar para mostrar valores originales
      this.loadProfile(); 
    }
  }

  async saveProfile() {
    if (this.profileForm.invalid) {
      this.presentToast('Por favor, rellena todos los campos requeridos correctamente.', 'danger');
      return;
    }
    
    const loading = await this.loadingCtrl.create({ message: 'Guardando perfil...' });
    await loading.present();

    const userId = this.supabase.getCurrentUser()?.id;
    if (userId) {
      const { nombre_completo, telefono } = this.profileForm.value;
      const { error } = await this.supabase.updateUserProfile(userId, { nombre_completo, telefono }); // Nuevo método en SupabaseService

      await loading.dismiss();

      if (error) {
        this.presentToast(`Error al guardar: ${error.message}`, 'danger');
      } else {
        await this.loadProfile(); // Recargar el perfil para mostrar los cambios
        this.toggleEditMode(); // Salir del modo edición
        this.presentToast('Perfil actualizado con éxito', 'success');
      }
    } else {
      await loading.dismiss();
      this.presentToast('No se pudo encontrar el usuario.', 'danger');
    }
  }

  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}