import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, arrowForward } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLink]
})
export class LoginPage {
  showPassword = false;
  
  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, arrowForward });
  }

  // En login.page.ts

async onLogin() {
    // 1. Feedback visual inmediato (opcional, para saber que le diste click)
    console.log('Intentando iniciar sesión con:', this.loginData.email);

    if (!this.loginData.email || !this.loginData.password) {
      this.presentToast('Por favor, rellena todos los campos', 'warning');
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        console.log('Login exitoso', res);
        // Mensaje de éxito
        this.presentToast('¡Bienvenido al sistema!', 'success');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error en login', err);
        
        // Intentamos sacar el mensaje del backend, si no, uno genérico
        const msg = err.error?.error || 'No se pudo conectar con el servidor';
        this.presentToast(msg, 'danger');
      }
    });
  }

  // Función auxiliar para Toasts consistentes
  async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000, // Un poco más largo para leerlo bien
      position: 'bottom', // Abajo se ve mejor en móvil
      color: color,
      cssClass: 'custom-toast', // Para estilos extra si quieres
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}