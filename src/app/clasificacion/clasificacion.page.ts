import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

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
  selector: 'app-clasificacion',
  templateUrl: './clasificacion.page.html',
  styleUrls: ['./clasificacion.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ClasificacionPage implements OnInit {
  
  private apiUrl = 'https://api-bets-soccer.vercel.app/api'; 
  standings: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any[]>(`${this.apiUrl}/league/standings`).subscribe(data => {
      this.standings = data.map(team => {
        return {
          ...team,
          badge: TEAM_IMAGES[team.name] || 'assets/default-shield.png'
        };
      });
    });
  }
}