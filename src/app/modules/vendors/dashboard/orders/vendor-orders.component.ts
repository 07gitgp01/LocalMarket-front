import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
    selector: 'app-vendor-orders',
    standalone: true,
    imports: [CommonModule, MatTabsModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatBadgeModule],
    template: `
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Gestion des Commandes</h1>

    <mat-tab-group animationDuration="0ms" class="bg-white rounded-lg shadow border overflow-hidden">
      
      <!-- New Orders -->
      <mat-tab>
        <ng-template mat-tab-label>
          <span [matBadge]="pendingOrders.length" matBadgeColor="warn" matBadgeOverlap="false">En attente</span>
        </ng-template>
        
        <div class="p-6 space-y-4">
          <div *ngIf="pendingOrders.length === 0" class="text-center py-10 text-gray-500">
             Aucune commande en attente.
          </div>

          <mat-card *ngFor="let order of pendingOrders" class="border !shadow-none hover:border-blue-300 transition">
             <div class="p-4 flex flex-col md:flex-row gap-6">
                
                <div class="flex-grow">
                  <div class="flex justify-between mb-2">
                    <h3 class="font-bold text-lg">#{{ order.id }} - {{ order.customer }}</h3>
                    <span class="text-gray-500 text-sm">{{ order.time }}</span>
                  </div>
                  <div class="text-sm text-gray-600 mb-4">
                    {{ order.items }} articles • Total: <strong>{{ order.total }} FCFA</strong>
                  </div>
                  <div class="flex gap-2 text-sm bg-gray-50 p-2 rounded">
                    <mat-icon class="text-xs h-4 w-4">location_on</mat-icon> {{ order.address }}
                  </div>
                </div>

                <div class="flex flex-col gap-2 min-w-[150px] justify-center">
                   <button mat-flat-button color="primary">Traiter</button>
                   <button mat-stroked-button color="warn">Refuser</button>
                </div>

             </div>
          </mat-card>
        </div>
      </mat-tab>

      <!-- Processing -->
      <mat-tab label="En cours">
        <div class="p-6 text-center text-gray-500">Liste des commandes en préparation...</div>
      </mat-tab>

      <!-- Completed -->
      <mat-tab label="Terminées">
         <div class="p-6 text-center text-gray-500">Historique des commandes...</div>
      </mat-tab>

    </mat-tab-group>
  `
})
export class VendorOrdersComponent {
    pendingOrders = [
        { id: '1023', customer: 'Alice Sankara', items: 3, total: 15500, time: 'Il y a 15 min', address: 'Patte d\'oie, Ouaga' },
        { id: '1021', customer: 'Brahima Ouédraogo', items: 1, total: 2500, time: 'Il y a 1 heure', address: 'Karpala, Ouaga' }
    ];
}
