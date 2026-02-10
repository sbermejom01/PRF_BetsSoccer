import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonGrid, IonRow, IonCol, IonBadge, IonCard, IonCardHeader, IonCardContent, IonIcon, IonInput, IonItem, IonLabel, IonCardTitle, IonCardSubtitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonButton, IonGrid, IonRow, IonCol, IonBadge, IonCard, IonCardHeader, IonCardContent, IonIcon, IonInput, IonItem, IonLabel, IonCardTitle, IonCardSubtitle]
})
export class LoginPage implements OnInit {

  showPassword = false;

  constructor() { }

  ngOnInit() {
  }

}
