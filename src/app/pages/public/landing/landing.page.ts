import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  // Agregamos IonButton y RouterLink que son esenciales para este HTML
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonButton, RouterLink] 
})
export class LandingPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}