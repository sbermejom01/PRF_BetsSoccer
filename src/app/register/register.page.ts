import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLink]
})
export class RegisterPage {
  showPassword = false;
  
  userData = {
    username: '',
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
  }

  async onRegister() {
    if (!this.userData.username || !this.userData.email || !this.userData.password) {
      this.showToast('Por favor completa todos los campos');
      return;
    }

    this.authService.register(this.userData).subscribe({
      next: async (res) => {
        await this.showToast('Registro exitoso. Inicia sesión.');
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        console.error(err);
        await this.showToast(err.error.error || 'Error al registrarse');
      }
    });
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
    toast.present();
  }
}