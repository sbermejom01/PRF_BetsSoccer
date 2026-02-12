import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronBack, person, trophy, statsChart, podium, football, analytics } from 'ionicons/icons';

@Component({
  selector: 'app-detalle-equipo',
  templateUrl: './detalle-equipo.page.html',
  styleUrls: ['./detalle-equipo.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DetalleEquipoPage implements OnInit {
  
  teamName: string = '';
  
  // Inicializamos con 0 para que SIEMPRE se vea la estructura
  teamStats: any = {
    rank: '-', points: 0, won: 0, drawn: 0, lost: 0, gf: 0, gc: 0
  };
  
  players: any[] = [];
  teamBadge: string = 'assets/default-shield.png'; 

  private apiUrl = 'https://api-bets-soccer.vercel.app/api'; 

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    addIcons({ chevronBack, person, trophy, statsChart, podium, football, analytics });
  }

  ngOnInit() {
    // 1. Decodificar el nombre para evitar problemas con %20 o tildes
    const rawName = this.route.snapshot.paramMap.get('name') || '';
    this.teamName = decodeURIComponent(rawName);
    
    if (this.teamName) {
      this.loadTeamStats();
      this.loadPlayers();
    }
  }

  loadTeamStats() {
    this.http.get<any[]>(`${this.apiUrl}/league/standings`).subscribe({
      next: (data) => {
        // 2. Búsqueda flexible (ignorando mayúsculas/minúsculas)
        const foundTeam = data.find(t => 
          t.teamName.toLowerCase().trim() === this.teamName.toLowerCase().trim()
        );
        
        if (foundTeam) {
          this.teamStats = foundTeam;
          // Calculamos ranking basado en el índice
          this.teamStats.rank = data.indexOf(foundTeam) + 1;
          
          if (foundTeam.badge) {
            this.teamBadge = foundTeam.badge;
          }
        }
      },
      error: (err) => console.error('Error stats:', err)
    });
  }

  loadPlayers() {
    // Codificamos de nuevo para la petición HTTP
    const encodedName = encodeURIComponent(this.teamName);
    
    this.http.get<any[]>(`${this.apiUrl}/teams/${encodedName}/players`).subscribe({
      next: (data) => {
        this.players = data;
      },
      error: (err) => console.error('Error jugadores:', err)
    });
  }
}