import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronBack, person, trophy, statsChart, podium, football, analytics } from 'ionicons/icons';

// --- MAPA DE IMÁGENES LOCALES ---
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
  
  // Imagen por defecto
  teamBadge: string = 'assets/default-shield.png'; 

  private apiUrl = 'https://api-bets-soccer.vercel.app/api'; 

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    addIcons({ chevronBack, person, trophy, statsChart, podium, football, analytics });
  }

  ngOnInit() {
    const rawName = this.route.snapshot.paramMap.get('name') || '';
    this.teamName = decodeURIComponent(rawName);
    
    // ASIGNAR IMAGEN DESDE EL MAPA LOCAL
    if (this.teamName) {
      this.teamBadge = TEAM_IMAGES[this.teamName] || 'assets/default-shield.png';
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
          // Ya no leemos badge de la API, usamos el local asignado en ngOnInit
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