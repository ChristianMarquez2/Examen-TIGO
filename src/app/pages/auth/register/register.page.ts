import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterLink]
})
// ... imports iguales

export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]], // Agregado
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Agregado
      password: ['', [Validators.required, Validators.minLength(6)]]
    });


    // ... resto del código igual (recuerda enviar los nuevos datos a supabase si tu tabla lo requiere)
  }

  async onRegister() {
    if (this.registerForm.invalid) return;

    const loading = await this.loadingCtrl.create({ message: 'Creando cuenta...' });
    await loading.present();

    const { email, password } = this.registerForm.value;

    // Al registrarse, el TRIGGER de SQL le dará rol 'usuario_registrado' automáticamente
    const { error } = await this.supabase.signUp(email, password);

    await loading.dismiss();

    if (error) {
      this.mostrarAlerta('Error', error.message);
    } else {
      await this.mostrarAlerta('Éxito', 'Cuenta creada. Por favor inicia sesión.');
      this.router.navigate(['/login']);
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}