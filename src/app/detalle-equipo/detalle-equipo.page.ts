import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronBack, person } from 'ionicons/icons';

@Component({
  selector: 'app-detalle-equipo',
  templateUrl: './detalle-equipo.page.html',
  styleUrls: ['./detalle-equipo.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DetalleEquipoPage implements OnInit {
  
  teamName: string = '';
  players: any[] = [];
  // Badge lo podemos sacar de la DB o usar un placeholder
  teamBadge: string = '/assets/default-shield.png'; 
  
  private apiUrl = 'https://api-bets-soccer.vercel.app/api'; 

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    addIcons({ chevronBack, person });
  }

  ngOnInit() {
    this.teamName = this.route.snapshot.paramMap.get('name') || '';
    this.loadPlayers();
    
    // Intento "chapucero" pero funcional de buscar el escudo 
    // (Idealmente deberías tener un endpoint /api/teams/:name que devuelva todo)
    this.http.get<any[]>(`${this.apiUrl}/league/standings`).subscribe(data => {
      const team = data.find(t => t.teamName === this.teamName);
      if (team && team.badge) {
        this.teamBadge = team.badge;
      }
    });
  }

  loadPlayers() {
    this.http.get<any[]>(`${this.apiUrl}/teams/${this.teamName}/players`).subscribe(data => {
      this.players = data;
    });
  }
}