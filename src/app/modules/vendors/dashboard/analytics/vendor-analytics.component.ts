import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-vendor-analytics',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule],
    template: `
    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      <mat-card class="p-6 !bg-blue-500 text-white rounded-xl shadow-lg border-none relative overflow-hidden">
        <div class="relative z-10">
          <div class="text-blue-100 mb-1 font-medium">Revenus totaux</div>
          <div class="text-3xl font-bold">1,250,000 F</div>
          <div class="text-xs mt-2 flex items-center gap-1 bg-blue-400/30 w-fit px-2 py-1 rounded">
             <mat-icon class="text-[14px] w-3 h-3">trending_up</mat-icon> +12% ce mois
          </div>
        </div>
        <mat-icon class="absolute -bottom-4 -right-4 text-9xl text-white/10 z-0">attach_money</mat-icon>
      </mat-card>

      <mat-card class="p-6 !bg-purple-500 text-white rounded-xl shadow-lg border-none relative overflow-hidden">
        <div class="relative z-10">
          <div class="text-purple-100 mb-1 font-medium">Commandes</div>
          <div class="text-3xl font-bold">142</div>
          <div class="text-xs mt-2 flex items-center gap-1 bg-purple-400/30 w-fit px-2 py-1 rounded">
             <mat-icon class="text-[14px] w-3 h-3">trending_up</mat-icon> +5% ce mois
          </div>
        </div>
        <mat-icon class="absolute -bottom-4 -right-4 text-9xl text-white/10 z-0">shopping_bag</mat-icon>
      </mat-card>

      <mat-card class="p-6 !bg-orange-500 text-white rounded-xl shadow-lg border-none relative overflow-hidden">
        <div class="relative z-10">
          <div class="text-orange-100 mb-1 font-medium">Produits vus</div>
          <div class="text-3xl font-bold">5,430</div>
           <div class="text-xs mt-2 flex items-center gap-1 bg-orange-400/30 w-fit px-2 py-1 rounded">
             <mat-icon class="text-[14px] w-3 h-3">visibility</mat-icon> +20% ce mois
          </div>
        </div>
        <mat-icon class="absolute -bottom-4 -right-4 text-9xl text-white/10 z-0">visibility</mat-icon>
      </mat-card>
      
      <mat-card class="p-6 !bg-green-600 text-white rounded-xl shadow-lg border-none relative overflow-hidden">
        <div class="relative z-10">
          <div class="text-green-100 mb-1 font-medium">Note moyenne</div>
          <div class="text-3xl font-bold">4.8</div>
           <div class="text-xs mt-2 flex items-center gap-1 bg-green-500/30 w-fit px-2 py-1 rounded">
             <mat-icon class="text-[14px] w-3 h-3">star</mat-icon> Basé sur 56 avis
          </div>
        </div>
        <mat-icon class="absolute -bottom-4 -right-4 text-9xl text-white/10 z-0">star_border</mat-icon>
      </mat-card>

    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Chart Placeholder -->
      <mat-card class="p-6 lg:col-span-2 rounded-xl">
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-bold text-lg text-gray-800">Aperçu des ventes</h2>
          <div class="flex gap-2">
             <button mat-stroked-button color="primary" class="!rounded-full small-btn">Semaine</button>
             <button mat-flat-button color="primary" class="!rounded-full small-btn">Mois</button>
             <button mat-stroked-button color="primary" class="!rounded-full small-btn">Année</button>
          </div>
        </div>
        <div class="h-64 bg-gray-50 rounded flex items-center justify-center border border-dashed">
          <span class="text-gray-400 flex flex-col items-center">
             <mat-icon class="text-4xl mb-2">bar_chart</mat-icon>
             Graphique des ventes (Chart.js integration here)
          </span>
        </div>
      </mat-card>

      <!-- Top Products -->
      <mat-card class="p-6 rounded-xl">
        <h2 class="font-bold text-lg text-gray-800 mb-6">Produits Populaires</h2>
        <div class="space-y-4">
          <div *ngFor="let i of [1,2,3,4,5]" class="flex items-center gap-4 border-b pb-3 last:border-0 last:pb-0">
             <div class="font-bold text-gray-400 w-4">#{{i}}</div>
             <div class="w-10 h-10 bg-gray-100 rounded"></div>
             <div class="flex-grow">
               <div class="font-bold text-sm truncate">Tomates Bio</div>
               <div class="text-xs text-gray-500">124 ventes</div>
             </div>
             <div class="font-bold text-sm text-green-700">120k</div>
          </div>
        </div>
      </mat-card>

    </div>

    <!-- Recent Orders -->
    <mat-card class="mt-8 overflow-hidden rounded-xl">
       <div class="p-6 border-b flex justify-between items-center bg-gray-50">
         <h2 class="font-bold text-lg text-gray-800">Commandes Récentes</h2>
         <button mat-button color="primary">Voir tout</button>
       </div>
       <table mat-table [dataSource]="recentOrders" class="w-full">
         <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef> ID </th>
            <td mat-cell *matCellDef="let element"> #{{element.id}} </td>
         </ng-container>
         <ng-container matColumnDef="customer">
            <th mat-header-cell *matHeaderCellDef> Client </th>
            <td mat-cell *matCellDef="let element"> {{element.customer}} </td>
         </ng-container>
         <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef> Date </th>
            <td mat-cell *matCellDef="let element"> {{element.date}} </td>
         </ng-container>
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef> Montant </th>
            <td mat-cell *matCellDef="let element"> {{element.amount}} F </td>
         </ng-container>
         <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Statut </th>
            <td mat-cell *matCellDef="let element"> 
              <span class="px-2 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-800">{{element.status}}</span>
            </td>
         </ng-container>
         <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
         <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
       </table>
    </mat-card>
  `,
    styles: [`
    .small-btn { padding: 0 16px; height: 32px; line-height: 32px; font-size: 12px; }
  `]
})
export class VendorAnalyticsComponent {
    displayedColumns: string[] = ['id', 'customer', 'date', 'amount', 'status'];
    recentOrders = [
        { id: 'ORD-001', customer: 'Jean Dupont', date: '05/02/2026', amount: '12,500', status: 'En attente' },
        { id: 'ORD-002', customer: 'Marie Koné', date: '04/02/2026', amount: '8,000', status: 'En attente' },
        { id: 'ORD-003', customer: 'Paul Traoré', date: '04/02/2026', amount: '45,000', status: 'En attente' },
    ];
}
