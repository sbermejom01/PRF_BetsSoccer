import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  statsChart, football, wallet, timeOutline, 
  calendarOutline, checkmarkCircleOutline, flame 
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.page.html',
  styleUrls: ['./panel.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class PanelPage implements OnInit, OnDestroy {
  
  private apiUrl = 'https://api-bets-soccer.vercel.app/api'; 
  
  selectedSegment: string = 'live';

  liveMatches: any[] = [];
  upcomingMatches: any[] = [];
  finishedMatches: any[] = [];
  
  totalCredits: number = 0;
  intervalId: any;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ statsChart, football, wallet, timeOutline, calendarOutline, checkmarkCircleOutline, flame });
  }

  ngOnInit() {
    this.loadUserData();
    this.loadMatches();

    this.intervalId = setInterval(() => {
      this.loadMatches();
    }, 10000); 
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  loadUserData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.totalCredits = user.points || 0;
  }

  loadMatches() {
    this.http.get<any[]>(`${this.apiUrl}/matches`).subscribe({
      next: (data) => {
        this.liveMatches = [];
        this.upcomingMatches = [];
        this.finishedMatches = [];

        data.forEach(match => {
          if (!match.homeBadge) match.homeBadge = this.getBadgeLocal(match.home);
          if (!match.awayBadge) match.awayBadge = this.getBadgeLocal(match.away);

          if (match.status === 'live') {
            this.liveMatches.push(match);
          } else if (match.status === 'finished') {
            this.finishedMatches.push(match);
          } else {
            this.upcomingMatches.push(match);
          }
        });

        if (this.liveMatches.length === 0 && this.selectedSegment === 'live' && this.upcomingMatches.length > 0) {
          this.selectedSegment = 'upcoming';
        }
      },
      error: (err) => console.error('Error cargando partidos', err)
    });
  }

  goToMatchDetail(matchId: number) {
    this.router.navigate(['/partido', matchId]);
  }

  goToTeamDetail(teamName: string, event: Event) {
    event.stopPropagation(); // Evita que se abra el detalle del partido
    this.router.navigate(['/equipo', teamName]);
  }

  quickBet(match: any, type: '1' | 'X' | '2') {
    this.goToMatchDetail(match.id);
  }

  // Helper para imágenes si la API falla
  getBadgeLocal(teamName: string): string {
    return 'assets/default-shield.png'; 
  }
}