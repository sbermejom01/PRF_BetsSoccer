import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonicModule, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { wallet, refresh, person } from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class PerfilPage implements OnInit {
  
  user: any = {
    username: '',
    email: '',
    avatar: 'assets/default-avatar.png',
    points: 0
  };
  
  private apiUrl = 'https://api-bets-soccer.vercel.app/api';  

  constructor(private http: HttpClient, private toastCtrl: ToastController) { 
    addIcons({ wallet, refresh, person });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  // Genera un avatar aleatorio cambiando la "seed" de DiceBear
  randomizeAvatar() {
    const randomSeed = Math.random().toString(36).substring(7);
    this.user.avatar = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${randomSeed}`;
  }

  updateProfile() {
    if (!this.user.id) return;

    const payload = {
      username: this.user.username,
      avatar: this.user.avatar
    };

    this.http.put(`${this.apiUrl}/users/${this.user.id}`, payload).subscribe({
      next: (updatedUser: any) => {
        // Mantenemos el email y el token viejos, actualizamos el resto
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const newUserState = { ...currentUser, ...updatedUser };
        
        // Guardamos en local para que se vea reflejado en toda la app
        localStorage.setItem('user', JSON.stringify(newUserState));
        
        this.presentToast('Perfil actualizado correctamente', 'success');
      },
      error: (err) => {
        console.error(err);
        this.presentToast('Error al actualizar perfil', 'danger');
      }
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}