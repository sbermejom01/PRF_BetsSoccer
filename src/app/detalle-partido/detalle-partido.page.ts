import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicModule, ToastController, IonContent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { send, timeOutline, football, chatbubblesOutline, chevronBack, personCircleOutline, listOutline, alertCircle, calendarOutline } from 'ionicons/icons';
import { retry } from 'rxjs/operators';

const TEAM_IMAGES: { [key: string]: string } = {
  'Real Madrid': 'assets/pack-escudos/real_madrid.png',
  'FC Barcelona': 'assets/pack-escudos/fc_barcelona.png',
  'Atlético Madrid': 'assets/pack-escudos/atletico.png',
  'Real Sociedad': 'assets/pack-escudos/real_sociedad.png',
  'Villarreal': 'assets/pack-escudos/villareal.png',
  'Real Betis': 'assets/pack-escudos/betis.png',
  'Athletic Club': 'assets/pack-escudos/athletic.png',
  'Sevilla FC': 'assets/pack-escudos/sevilla.png',
  'Osasuna': 'assets/pack-escudos/osasuna.png',
  'Girona FC': 'assets/pack-escudos/girona.png',
  'Rayo Vallecano': 'assets/pack-escudos/rayo.png',
  'Celta de Vigo': 'assets/pack-escudos/celta.png',
  'Valencia CF': 'assets/pack-escudos/valencia.png',
  'Getafe CF': 'assets/pack-escudos/getafe.png',
  'RCD Mallorca': 'assets/pack-escudos/mallorca.png',
  'UD Las Palmas': 'assets/pack-escudos/las_palmas.png',
  'Deportivo Alavés': 'assets/pack-escudos/alaves.png',
  'Granada CF': 'assets/pack-escudos/granada.png',
  'Cádiz CF': 'assets/pack-escudos/cadiz.png',
  'UD Almería': 'assets/pack-escudos/almeria.png'
};

@Component({
  selector: 'app-detalle-partido',
  templateUrl: './detalle-partido.page.html',
  styleUrls: ['./detalle-partido.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class DetallePartidoPage implements OnInit, OnDestroy {
  
  @ViewChild(IonContent) content!: IonContent;

  matchId: number = 0;
  match: any = null;
  messages: any[] = [];
  newMessage: string = '';
  
  betData = { homeScore: 0, awayScore: 0 };
  
  currentUser: any = { username: 'Invitado', id: 0 };
  private apiUrl = 'https://api-bets-soccer.vercel.app/api'; 
  
  intervalId: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {
    addIcons({ send, timeOutline, football, chatbubblesOutline, chevronBack, personCircleOutline, listOutline, alertCircle, calendarOutline });
  }

  ngOnInit() {
    this.matchId = Number(this.route.snapshot.paramMap.get('id'));
    
    const userStr = localStorage.getItem('user');
    if (userStr) this.currentUser = JSON.parse(userStr);

    this.loadMatchData();
    this.loadChat();
  }

  ngOnDestroy() {
    this.stopLiveUpdates();
  }

  loadMatchData() {
    this.http.get<any>(`${this.apiUrl}/matches/${this.matchId}`)
      .pipe(retry(2))
      .subscribe({
        next: (data) => {
          data.homeBadge = TEAM_IMAGES[data.home] || 'assets/default-shield.png';
          data.awayBadge = TEAM_IMAGES[data.away] || 'assets/default-shield.png';
          
          this.match = data;

          if (this.match.status === 'live') {
            if (!this.intervalId) {
              this.startLiveUpdates();
            }
          } else {
            this.stopLiveUpdates();
          }
        },
        error: (err) => console.error("Error cargando partido:", err)
      });
  }

  loadChat() {
    this.http.get<any[]>(`${this.apiUrl}/messages/${this.matchId}`)
      .pipe(retry(2))
      .subscribe({
        next: (msgs) => this.messages = msgs,
        error: () => console.log("Chat no disponible")
      });
  }

  startLiveUpdates() {
    this.intervalId = setInterval(() => {
      this.loadMatchData();
      this.loadChat();
    }, 5000);
  }

  stopLiveUpdates() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
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
      if (this.content) {
        this.content.scrollToBottom(300);
      }
    });
  }

  placeBet() {
    const token = localStorage.getItem('token'); 

    if (!token) {
      this.presentToast('Debes iniciar sesión para apostar', 'warning');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const payload = {
      userId: this.currentUser.id,
      matchId: this.matchId,
      homeScore: this.betData.homeScore,
      awayScore: this.betData.awayScore
    };

    this.http.post(`${this.apiUrl}/bets`, payload, { headers }).subscribe({
      next: () => this.presentToast('Apuesta realizada con éxito', 'success'),
      error: (err) => {
        console.error(err);
        this.presentToast(err.error.error || 'Error al apostar', 'danger');
      }
    });
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg, duration: 2000, color: color, position: 'bottom'
    });
    toast.present();
  }
}