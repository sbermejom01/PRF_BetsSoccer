import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, arrowForwardOutline } from 'ionicons/icons';
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
  isLoading = false;
  
  // Variables para el mensaje en pantalla
  feedbackMessage: string = '';
  isError: boolean = false;
  
  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, arrowForwardOutline });
  }

  onLogin() {
    // Resetear mensajes
    this.feedbackMessage = '';
    this.isError = false;

    if (!this.loginData.email || !this.loginData.password) {
      this.showFeedback('Por favor, rellena todos los campos', true);
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showFeedback('¡Bienvenido! Entrando al sistema...', false);
        
        // Pequeño delay para que el usuario lea el éxito
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (err) => {
        this.isLoading = false;
        // Mensaje genérico si no hay detalle, o el del servidor
        const msg = err.error?.error || 'Error de conexión. Verifica tu red.';
        this.showFeedback(msg, true);
      }
    });
  }

  showFeedback(msg: string, isError: boolean) {
    this.feedbackMessage = msg;
    this.isError = isError;
    // Opcional: Borrar mensaje automáticamente a los 5 segundos
    setTimeout(() => {
      this.feedbackMessage = '';
    }, 5000);
  }
}