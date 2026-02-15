import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { OrderService } from '@core/services/order.service';
import { ProductService } from '@core/services/product.service';
import { AuthService } from '@core/services/auth.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-vendor-analytics',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatFormFieldModule,
        LoadingSpinnerComponent
    ],
    template: `
    <app-loading-spinner *ngIf="isLoading" [fullscreen]="false" message="Chargement des statistiques..."></app-loading-spinner>

    <div *ngIf="!isLoading">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
      <p class="text-gray-500">Bienvenue dans votre espace vendeur</p>
    </div>

    <!-- Period Selector -->
    <div class="flex justify-end mb-6">
      <mat-form-field appearance="outline" class="w-48">
        <mat-label>Période</mat-label>
        <mat-select [(value)]="selectedPeriod" (selectionChange)="loadAnalytics()">
          <mat-option value="week">Cette semaine</mat-option>
          <mat-option value="month">Ce mois</mat-option>
          <mat-option value="year">Cette année</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      <mat-card class="p-6 !bg-blue-500 text-white rounded-xl shadow-lg border-none relative overflow-hidden">
        <div class="relative z-10">
          <div class="text-blue-100 mb-1 font-medium">Revenus totaux</div>
          <div class="text-3xl font-bold">{{ analytics().totalRevenue | number:'1.0-0' }} FCFA</div>
          <div class="text-xs mt-2 flex items-center gap-1 bg-blue-400/30 w-fit px-2 py-1 rounded">
             <mat-icon class="text-[14px] w-3 h-3">{{ analytics().revenueGrowth >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon> 
             {{ analytics().revenueGrowth >= 0 ? '+' : '' }}{{ analytics().revenueGrowth }}% ce mois
          </div>
        </div>
        <mat-icon class="absolute -bottom-4 -right-4 text-9xl text-white/10 z-0">attach_money</mat-icon>
      </mat-card>

      <mat-card class="p-6 !bg-purple-500 text-white rounded-xl shadow-lg border-none relative overflow-hidden">
        <div class="relative z-10">
          <div class="text-purple-100 mb-1 font-medium">Commandes</div>
          <div class="text-3xl font-bold">{{ analytics().totalOrders }}</div>
          <div class="text-xs mt-2 flex items-center gap-1 bg-purple-400/30 w-fit px-2 py-1 rounded">
             <mat-icon class="text-[14px] w-3 h-3">{{ analytics().ordersGrowth >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon> 
             {{ analytics().ordersGrowth >= 0 ? '+' : '' }}{{ analytics().ordersGrowth }}% ce mois
          </div>
        </div>
        <mat-icon class="absolute -bottom-4 -right-4 text-9xl text-white/10 z-0">shopping_bag</mat-icon>
      </mat-card>

      <mat-card class="p-6 !bg-orange-500 text-white rounded-xl shadow-lg border-none relative overflow-hidden">
        <div class="relative z-10">
          <div class="text-orange-100 mb-1 font-medium">Produits actifs</div>
          <div class="text-3xl font-bold">{{ analytics().totalProducts }}</div>
           <div class="text-xs mt-2 flex items-center gap-1 bg-orange-400/30 w-fit px-2 py-1 rounded">
             <mat-icon class="text-[14px] w-3 h-3">inventory_2</mat-icon> {{ analytics().lowStockProducts }} en stock faible
          </div>
        </div>
        <mat-icon class="absolute -bottom-4 -right-4 text-9xl text-white/10 z-0">inventory_2</mat-icon>
      </mat-card>
      
      <mat-card class="p-6 !bg-green-600 text-white rounded-xl shadow-lg border-none relative overflow-hidden">
        <div class="relative z-10">
          <div class="text-green-100 mb-1 font-medium">Note moyenne</div>
          <div class="text-3xl font-bold">{{ analytics().averageRating | number:'1.1-1' }}</div>
           <div class="text-xs mt-2 flex items-center gap-1 bg-green-500/30 w-fit px-2 py-1 rounded">
             <mat-icon class="text-[14px] w-3 h-3">star</mat-icon> Basé sur {{ analytics().totalReviews }} avis
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
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-bold text-lg text-gray-800">Produits Populaires</h2>
          <a routerLink="../products" mat-button color="primary" class="text-sm">Voir tout</a>
        </div>
        <div class="space-y-4">
          <div *ngFor="let product of topProducts; let i = index" class="flex items-center gap-4 border-b pb-3 last:border-0 last:pb-0">
             <div class="font-bold text-gray-400 w-4">#{{i+1}}</div>
             <div class="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
               <img *ngIf="product.images?.[0]" [src]="product.images[0]" [alt]="product.name" class="w-full h-full object-cover">
             </div>
             <div class="flex-grow min-w-0">
               <div class="font-bold text-sm truncate">{{ product.name }}</div>
               <div class="text-xs text-gray-500">{{ product.reviewCount }} ventes</div>
             </div>
             <div class="font-bold text-sm text-green-700">{{ product.price | number:'1.0-0' }}</div>
          </div>
        </div>
      </mat-card>

    </div>

    <!-- Recent Orders -->
    <mat-card class="mt-8 overflow-hidden rounded-xl">
       <div class="p-6 border-b flex justify-between items-center bg-gray-50">
         <h2 class="font-bold text-lg text-gray-800">Commandes Récentes</h2>
         <a routerLink="../orders" mat-button color="primary">Voir tout</a>
       </div>
       <table mat-table [dataSource]="recentOrders" class="w-full">
         <ng-container matColumnDef="orderNumber">
            <th mat-header-cell *matHeaderCellDef class="font-bold"> N° Commande </th>
            <td mat-cell *matCellDef="let order" class="font-mono"> {{order.orderNumber}} </td>
         </ng-container>
         <ng-container matColumnDef="customer">
            <th mat-header-cell *matHeaderCellDef class="font-bold"> Client </th>
            <td mat-cell *matCellDef="let order"> {{order.userId}} </td>
         </ng-container>
         <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef class="font-bold"> Date </th>
            <td mat-cell *matCellDef="let order"> {{order.createdAt | date:'dd/MM/yyyy'}} </td>
         </ng-container>
          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef class="font-bold"> Montant </th>
            <td mat-cell *matCellDef="let order" class="font-semibold"> {{order.total | number:'1.0-0'}} FCFA </td>
         </ng-container>
         <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef class="font-bold"> Statut </th>
            <td mat-cell *matCellDef="let order"> 
              <span class="px-3 py-1 rounded-full text-xs font-bold" [ngClass]="getStatusClass(order.status)">{{getStatusLabel(order.status)}}</span>
            </td>
         </ng-container>
         <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="font-bold"> Actions </th>
            <td mat-cell *matCellDef="let order">
              <button mat-icon-button [routerLink]="['../orders', order.id]" matTooltip="Voir détails">
                <mat-icon>visibility</mat-icon>
              </button>
            </td>
         </ng-container>
         <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
         <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 transition"></tr>
       </table>
    </mat-card>
    </div>
  `,
    styles: [`
    .small-btn { padding: 0 16px; height: 32px; line-height: 32px; font-size: 12px; }
  `]
})
export class VendorAnalyticsComponent implements OnInit {
    isLoading = true;
    selectedPeriod = 'month';
    displayedColumns: string[] = ['orderNumber', 'customer', 'date', 'total', 'status', 'actions'];
    
    analytics = signal({
        totalRevenue: 0,
        revenueGrowth: 0,
        totalOrders: 0,
        ordersGrowth: 0,
        totalProducts: 0,
        lowStockProducts: 0,
        averageRating: 0,
        totalReviews: 0
    });
    
    recentOrders: any[] = [];
    topProducts: any[] = [];

    constructor(
        private orderService: OrderService,
        private productService: ProductService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.loadAnalytics();
    }

    loadAnalytics() {
        this.isLoading = true;
        const vendorId = this.authService.currentUser()?.vendorId || 1;

        // Load vendor products
        this.productService.getProducts({ vendorId }).subscribe({
            next: (products) => {
                this.topProducts = products
                    .sort((a, b) => b.reviewCount - a.reviewCount)
                    .slice(0, 5);

                const totalProducts = products.length;
                const lowStockProducts = products.filter(p => p.stock < 10).length;
                const totalReviews = products.reduce((sum, p) => sum + p.reviewCount, 0);
                const averageRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length || 0;

                // Load vendor orders
                this.orderService.getOrders().subscribe({
                    next: (orders) => {
                        // Filter orders that contain vendor's products
                        const vendorOrders = orders.filter(order => 
                            order.items.some(item => 
                                products.some(p => p.id === item.productId)
                            )
                        );

                        this.recentOrders = vendorOrders.slice(0, 5);

                        const totalRevenue = vendorOrders.reduce((sum, o) => sum + o.total, 0);
                        const totalOrders = vendorOrders.length;

                        this.analytics.set({
                            totalRevenue,
                            revenueGrowth: 12, // Mock growth
                            totalOrders,
                            ordersGrowth: 5, // Mock growth
                            totalProducts,
                            lowStockProducts,
                            averageRating,
                            totalReviews
                        });

                        this.isLoading = false;
                    },
                    error: () => this.isLoading = false
                });
            },
            error: () => this.isLoading = false
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    getStatusLabel(status: string): string {
        const labels: { [key: string]: string } = {
            'pending': 'En attente',
            'processing': 'En traitement',
            'shipped': 'Expédiée',
            'delivered': 'Livrée',
            'cancelled': 'Annulée'
        };
        return labels[status] || status;
    }
}
