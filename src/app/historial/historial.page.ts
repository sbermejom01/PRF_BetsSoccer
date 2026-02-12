import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class HistorialPage implements OnInit {
  
  bets: any[] = [];
  private apiUrl = 'https://api-bets-soccer.vercel.app/api';  

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      this.http.get<any[]>(`${this.apiUrl}/bets/user/${user.id}`).subscribe(data => {
        this.bets = data;
      });
    }
  }
}