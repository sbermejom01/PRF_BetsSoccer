import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
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
  isLoading = false;
  
  feedbackMessage: string = '';
  isError: boolean = false;
  
  userData = {
    username: '',
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {
    addIcons({ personOutline, mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
  }

  onRegister() {
    this.feedbackMessage = '';
    this.isError = false;

    if (!this.userData.username || !this.userData.email || !this.userData.password) {
      this.showFeedback('Por favor completa todos los campos', true);
      return;
    }

    this.isLoading = true;

    this.authService.register(this.userData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showFeedback('¡Registro exitoso! Redirigiendo...', false);
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.error?.error || 'Error al registrarse. Inténtalo de nuevo.';
        this.showFeedback(msg, true);
      }
    });
  }

  showFeedback(msg: string, isError: boolean) {
    this.feedbackMessage = msg;
    this.isError = isError;
    
    if (isError) {
      setTimeout(() => {
        this.feedbackMessage = '';
      }, 5000);
    }
  }
}