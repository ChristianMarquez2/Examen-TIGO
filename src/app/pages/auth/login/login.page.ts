import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterLink]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  async onLogin() {
    if (this.loginForm.invalid) return;

    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...' });
    await loading.present();

    const { email, password } = this.loginForm.value;
    const { data, error } = await this.supabaseService.signIn(email, password);

    await loading.dismiss();

    if (error) {
      this.mostrarAlerta('Error', error.message);
    } else {
      if (data.user) {
        this.checkUserRole(data.user.id);
      }
    }
  }

  async checkUserRole(uid: string) {
    const perfil = await this.supabaseService.getUserProfile(uid);
    
    // ACTUALIZACIÓN CLAVE: Redirigir a las rutas dentro de /tabs/
    if (perfil?.rol === 'asesor_comercial') {
      this.router.navigate(['/tabs/dashboard']);
    } else {
      this.router.navigate(['/tabs/home']);
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}