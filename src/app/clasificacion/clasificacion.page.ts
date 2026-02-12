import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

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
      this.standings = data;
    });
  }
}