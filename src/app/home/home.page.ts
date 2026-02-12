import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  gridOutline, trophyOutline, podiumOutline, 
  personOutline, timeOutline, logOutOutline
} from 'ionicons/icons';

import { PanelPage } from '../panel/panel.page';
import { ClasificacionPage } from '../clasificacion/clasificacion.page';
import { RankingPage } from '../ranking/ranking.page';
import { PerfilPage } from '../perfil/perfil.page';
import { HistorialPage } from '../historial/historial.page';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonicModule, 
    PanelPage, 
    ClasificacionPage, 
    RankingPage, 
    PerfilPage, 
    HistorialPage
  ],
})
export class HomePage implements OnInit {

  currentSection: string = 'panel';
  user: any = { username: 'Cargando...', points: 0, avatar: 'assets/default-avatar.png' };

  constructor(private router: Router, private authService: AuthService) {
    addIcons({ gridOutline, trophyOutline, podiumOutline, personOutline, timeOutline, logOutOutline });
  }

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  setSection(section: string) {
    this.currentSection = section;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}