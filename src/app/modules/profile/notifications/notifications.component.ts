import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatSlideToggleModule],
    template: `
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
    
    <div class="mb-8">
      <h3 class="font-bold mb-4">Préférences</h3>
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <span>Recevoir des emails promotionnels</span>
          <mat-slide-toggle [checked]="true" color="primary"></mat-slide-toggle>
        </div>
        <div class="flex justify-between items-center">
          <span>Alertes SMS commande</span>
          <mat-slide-toggle [checked]="false" color="primary"></mat-slide-toggle>
        </div>
      </div>
    </div>

    <h3 class="font-bold mb-4">Historique</h3>
    <div class="space-y-2">
      <div class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded flex gap-3">
         <mat-icon class="text-blue-500">info</mat-icon>
         <div>
           <div class="font-bold text-sm">Votre commande a été expédiée</div>
           <div class="text-xs text-gray-500">Il y a 2 heures</div>
         </div>
      </div>
      <div class="p-4 bg-green-50 border-l-4 border-green-500 rounded flex gap-3">
         <mat-icon class="text-green-500">check_circle</mat-icon>
         <div>
           <div class="font-bold text-sm">Bienvenue sur LocalMarket !</div>
           <div class="text-xs text-gray-500">Il y a 2 jours</div>
         </div>
      </div>
    </div>
  `
})
export class NotificationsComponent { }
