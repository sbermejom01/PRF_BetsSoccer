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

  async onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.router.navigate(['/home']);
      },
      error: async (err) => {
        const toast = await this.toastCtrl.create({
          message: 'Credenciales inválidas o error de conexión',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}