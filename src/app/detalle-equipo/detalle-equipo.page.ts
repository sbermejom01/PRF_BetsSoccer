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
  teamStats: any = null;
  players: any[] = [];
  
  // Imagen por defecto por si la base de datos devuelve null
  teamBadge: string = 'assets/default-shield.png'; 

  private apiUrl = 'https://api-bets-soccer.vercel.app/api'; 

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    addIcons({ chevronBack, person, trophy, statsChart, podium, football, analytics });
  }

  ngOnInit() {
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
        const foundTeam = data.find(t => {
          const currentName = t.name || t.teamName; 
          if (!currentName) return false;
          return currentName.toLowerCase().trim() === this.teamName.toLowerCase().trim();
        });
        
        if (foundTeam) {
          this.teamStats = foundTeam;
          this.teamStats.rank = data.indexOf(foundTeam) + 1;
          
          // AQUÍ: Forzamos la lectura de la columna 'badge'
          if (foundTeam.badge) {
            this.teamBadge = foundTeam.badge;
            console.log('Escudo cargado:', this.teamBadge);
          }
        }
      },
      error: (err) => console.error('Error stats:', err)
    });
  }

  loadPlayers() {
    const encodedName = encodeURIComponent(this.teamName);
    this.http.get<any[]>(`${this.apiUrl}/teams/${encodedName}/players`).subscribe({
      next: (data) => { this.players = data; },
      error: (err) => console.error('Error jugadores:', err)
    });
  }
}