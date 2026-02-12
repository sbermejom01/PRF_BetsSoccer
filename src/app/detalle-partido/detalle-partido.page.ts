import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule, ToastController, IonContent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { send, timeOutline, football, chatbubblesOutline, chevronBack } from 'ionicons/icons';

@Component({
  selector: 'app-detalle-partido',
  templateUrl: './detalle-partido.page.html',
  styleUrls: ['./detalle-partido.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class DetallePartidoPage implements OnInit, OnDestroy {
  
  // SOLUCIÓN 1: Añadir '!' para decirle a TS que existirá seguro
  @ViewChild(IonContent) content!: IonContent;

  // SOLUCIÓN 2: Inicializar a 0 para que no sea undefined
  matchId: number = 0;
  
  match: any = null;
  messages: any[] = [];
  newMessage: string = '';
  
  betData = { homeScore: 0, awayScore: 0 };
  
  currentUser: any = {};
  private apiUrl = 'https://api-bets-soccer.vercel.app/api'; 
  
  // Opcional: poner '?' o inicializar si te da error también
  intervalId: any; 

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {
    addIcons({ send, timeOutline, football, chatbubblesOutline, chevronBack });
  }

  ngOnInit() {
    // Aquí es donde realmente le damos valor
    this.matchId = Number(this.route.snapshot.paramMap.get('id'));
    
    const userStr = localStorage.getItem('user');
    if (userStr) this.currentUser = JSON.parse(userStr);

    this.loadMatchData();
    this.loadChat();

    this.intervalId = setInterval(() => {
      this.loadMatchData();
      this.loadChat();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  loadMatchData() {
    this.http.get<any>(`${this.apiUrl}/matches/${this.matchId}`).subscribe(data => {
      if (!data.homeBadge) data.homeBadge = '/assets/default-shield.png';
      if (!data.awayBadge) data.awayBadge = '/assets/default-shield.png';
      this.match = data;
    });
  }

  loadChat() {
    this.http.get<any[]>(`${this.apiUrl}/messages/${this.matchId}`).subscribe(msgs => {
      this.messages = msgs;
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const payload = {
      matchId: this.matchId,
      username: this.currentUser.username,
      text: this.newMessage
    };

    this.http.post(`${this.apiUrl}/messages`, payload).subscribe(() => {
      this.newMessage = '';
      this.loadChat();
      // Usamos el content con seguridad
      if (this.content) {
        this.content.scrollToBottom(300);
      }
    });
  }

  placeBet() {
    const payload = {
      userId: this.currentUser.id,
      matchId: this.matchId,
      homeScore: this.betData.homeScore,
      awayScore: this.betData.awayScore
    };

    this.http.post(`${this.apiUrl}/bets`, payload).subscribe({
      next: () => this.presentToast('Apuesta realizada con éxito', 'success'),
      error: (err) => this.presentToast(err.error.error || 'Error al apostar', 'danger')
    });
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg, duration: 2000, color: color, position: 'bottom'
    });
    toast.present();
  }
}