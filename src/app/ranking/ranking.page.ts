import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trophy } from 'ionicons/icons';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class RankingPage implements OnInit {
  
  private apiUrl = 'https://api-bets-soccer.vercel.app/api'; 
  users: any[] = [];
  top3: any[] = [];
  rest: any[] = [];

  constructor(private http: HttpClient) {
    addIcons({ trophy });
  }

  ngOnInit() {
    this.http.get<any[]>(`${this.apiUrl}/leaderboard`).subscribe(data => {
      this.users = data;
      this.top3 = data.slice(0, 3);
      this.rest = data.slice(3);
    });
  }
}