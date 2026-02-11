import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-clasificacion',
  templateUrl: './clasificacion.page.html',
  styleUrls: ['./clasificacion.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ClasificacionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
