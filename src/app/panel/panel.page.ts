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

const TEAM_IMAGES: { [key: string]: string } = {
  'Real Madrid': 'assets/pack-escudos/real_madrid.png',
  'FC Barcelona': 'assets/pack-escudos/fc_barcelona.png',
  'Atlético Madrid': 'assets/pack-escudos/atletico.png',
  'Real Sociedad': 'assets/pack-escudos/real_sociedad.png',
  'Villarreal': 'assets/pack-escudos/villarreal.png',
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
  selector: 'app-panel',
  templateUrl: './panel.page.html',
  styleUrls: ['./panel.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class PanelPage implements OnInit, OnDestroy {
  
  private apiUrl = 'https://api-bets-soccer.vercel.app/api'; 
  
  selectedSegment: string = 'upcoming'; 

  liveMatches: any[] = [];
  upcomingMatches: any[] = [];
  finishedMatches: any[] = [];
  
  totalCredits: number = 0;
  intervalId: any;

  constructor(
    private http: HttpClient, 
    private router: Router
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
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        this.totalCredits = user.points || 0;
    }
  }

  loadMatches() {
    this.http.get<any[]>(`${this.apiUrl}/matches`).subscribe({
      next: (data) => {
        if (!Array.isArray(data)) return;

        const allMatches = data.map(m => {
            const homeName = m.home_team || m.home;
            const awayName = m.away_team || m.away;
            
            return {
                ...m,
                home: homeName,
                away: awayName,
                homeBadge: TEAM_IMAGES[homeName] || 'assets/default-shield.png',
                awayBadge: TEAM_IMAGES[awayName] || 'assets/default-shield.png'
            };
        });

        const live = allMatches.filter(m => m.status === 'live');
        
        const upcoming = allMatches
            .filter(m => m.status === 'pending')
            .sort((a, b) => a.id - b.id)
            .slice(0, 20);

        const finished = allMatches
            .filter(m => m.status === 'finished')
            .sort((a, b) => b.id - a.id)
            .slice(0, 20);

        this.liveMatches = live;
        this.upcomingMatches = upcoming;
        this.finishedMatches = finished;

      },
      error: (err) => console.error('Error cargando partidos', err)
    });
  }

  goToMatchDetail(matchId: number) {
    this.router.navigate(['/partido', matchId]); 
  }

  goToTeamDetail(teamName: string, event: Event) {
    event.stopPropagation(); 
    this.router.navigate(['/equipo', teamName]); 
  }
}