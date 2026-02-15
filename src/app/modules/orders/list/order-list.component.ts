import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

import { OrderService } from '@core/services/order.service';
import { AuthService } from '@core/services/auth.service';
import { Order } from '@shared/models/order.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatChipsModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatDividerModule,
        MatBadgeModule,
        MatTooltipModule,
        LoadingSpinnerComponent,
        EmptyStateComponent
    ],
    template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Mes Commandes</h1>
          <p class="text-gray-500 mt-1">Suivez vos commandes et leur statut de livraison</p>
        </div>
        <div class="flex items-center gap-2">
          <mat-icon class="text-green-600">shopping_bag</mat-icon>
          <span class="text-2xl font-bold text-gray-900">{{ orders.length }}</span>
          <span class="text-gray-500">commande(s)</span>
        </div>
      </div>

      <!-- Loading -->
      <app-loading-spinner *ngIf="isLoading" [fullscreen]="false" message="Chargement de vos commandes..."></app-loading-spinner>

      <!-- Empty State -->
      <app-empty-state 
        *ngIf="!isLoading && orders.length === 0"
        icon="shopping_bag"
        title="Aucune commande"
        description="Vous n'avez pas encore passé de commande. Découvrez nos produits locaux!"
        actionText="Découvrir les produits"
        actionRoute="/products">
      </app-empty-state>

      <!-- Orders List -->
      <div *ngIf="!isLoading && orders.length > 0">
        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search -->
            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Rechercher</mat-label>
              <input matInput [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()" placeholder="N° commande, produit...">
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>

            <!-- Status Filter -->
            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Statut</mat-label>
              <mat-select [(value)]="selectedStatus" (selectionChange)="applyFilters()">
                <mat-option value="all">Tous les statuts</mat-option>
                <mat-option value="pending">En attente</mat-option>
                <mat-option value="processing">En traitement</mat-option>
                <mat-option value="shipped">Expédiée</mat-option>
                <mat-option value="delivered">Livrée</mat-option>
                <mat-option value="cancelled">Annulée</mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Sort -->
            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Trier par</mat-label>
              <mat-select [(value)]="sortBy" (selectionChange)="applySort()">
                <mat-option value="date-desc">Plus récentes</mat-option>
                <mat-option value="date-asc">Plus anciennes</mat-option>
                <mat-option value="total-desc">Montant décroissant</mat-option>
                <mat-option value="total-asc">Montant croissant</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Status Chips -->
          <div class="flex flex-wrap gap-2 mt-4">
            <mat-chip 
              [class.!bg-green-100]="selectedStatus === 'all'"
              [class.!text-green-700]="selectedStatus === 'all'"
              (click)="filterByStatus('all')" 
              class="cursor-pointer hover:!bg-green-50">
              Toutes ({{ getStatusCount('all') }})
            </mat-chip>
            <mat-chip 
              [class.!bg-yellow-100]="selectedStatus === 'pending'"
              [class.!text-yellow-700]="selectedStatus === 'pending'"
              (click)="filterByStatus('pending')" 
              class="cursor-pointer hover:!bg-yellow-50">
              En attente ({{ getStatusCount('pending') }})
            </mat-chip>
            <mat-chip 
              [class.!bg-blue-100]="selectedStatus === 'processing'"
              [class.!text-blue-700]="selectedStatus === 'processing'"
              (click)="filterByStatus('processing')" 
              class="cursor-pointer hover:!bg-blue-50">
              En traitement ({{ getStatusCount('processing') }})
            </mat-chip>
            <mat-chip 
              [class.!bg-purple-100]="selectedStatus === 'shipped'"
              [class.!text-purple-700]="selectedStatus === 'shipped'"
              (click)="filterByStatus('shipped')" 
              class="cursor-pointer hover:!bg-purple-50">
              Expédiées ({{ getStatusCount('shipped') }})
            </mat-chip>
            <mat-chip 
              [class.!bg-green-100]="selectedStatus === 'delivered'"
              [class.!text-green-700]="selectedStatus === 'delivered'"
              (click)="filterByStatus('delivered')" 
              class="cursor-pointer hover:!bg-green-50">
              Livrées ({{ getStatusCount('delivered') }})
            </mat-chip>
            <mat-chip 
              [class.!bg-red-100]="selectedStatus === 'cancelled'"
              [class.!text-red-700]="selectedStatus === 'cancelled'"
              (click)="filterByStatus('cancelled')" 
              class="cursor-pointer hover:!bg-red-50">
              Annulées ({{ getStatusCount('cancelled') }})
            </mat-chip>
          </div>
        </div>

        <!-- Orders Cards -->
        <div class="space-y-4">
          <mat-card *ngFor="let order of paginatedOrders" class="!shadow-md hover:!shadow-lg transition-shadow cursor-pointer" [routerLink]="['/orders', order.id]">
            <mat-card-content class="!p-6">
              <div class="flex flex-col md:flex-row justify-between gap-4">
                <!-- Left: Order Info -->
                <div class="flex-grow">
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-bold text-gray-900">{{ order.orderNumber }}</h3>
                        <span class="px-3 py-1 rounded-full text-xs font-bold" [ngClass]="getStatusClass(order.status)">
                          {{ getStatusLabel(order.status) }}
                        </span>
                      </div>
                      <div class="flex items-center gap-4 text-sm text-gray-500">
                        <span class="flex items-center gap-1">
                          <mat-icon class="text-[18px]">calendar_today</mat-icon>
                          {{ order.createdAt | date:'dd/MM/yyyy' }}
                        </span>
                        <span class="flex items-center gap-1">
                          <mat-icon class="text-[18px]">schedule</mat-icon>
                          {{ order.createdAt | date:'HH:mm' }}
                        </span>
                        <span class="flex items-center gap-1">
                          <mat-icon class="text-[18px]">inventory_2</mat-icon>
                          {{ order.items.length }} article(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Order Items Preview -->
                  <div class="flex flex-wrap gap-2 mb-3">
                    <div *ngFor="let item of order.items.slice(0, 3)" class="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      <img *ngIf="item.product && item.product.images && item.product.images[0]" 
                         [src]="item.product.images[0]" 
                         [alt]="item.name" 
                         class="w-10 h-10 rounded object-cover">
                      <div class="flex-grow min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
                        <p class="text-xs text-gray-500">Qté: {{ item.quantity }}</p>
                      </div>
                    </div>
                    <div *ngIf="order.items.length > 3" class="flex items-center justify-center bg-gray-100 rounded-lg px-4 py-2">
                      <span class="text-sm font-medium text-gray-600">+{{ order.items.length - 3 }} autre(s)</span>
                    </div>
                  </div>

                  <!-- Payment & Delivery Info -->
                  <div class="flex flex-wrap gap-4 text-sm">
                    <div class="flex items-center gap-1 text-gray-600">
                      <mat-icon class="text-[18px]">payment</mat-icon>
                      <span>{{ getPaymentMethodLabel(order.paymentMethod) }}</span>
                      <span class="px-2 py-0.5 rounded text-xs font-medium" [ngClass]="getPaymentStatusClass(order.paymentStatus)">
                        {{ getPaymentStatusLabel(order.paymentStatus) }}
                      </span>
                    </div>
                    <div class="flex items-center gap-1 text-gray-600" *ngIf="order.deliveryDate">
                      <mat-icon class="text-[18px]">local_shipping</mat-icon>
                      <span>Livraison prévue: {{ order.deliveryDate | date:'dd/MM/yyyy' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Right: Total & Action -->
                <div class="flex flex-col items-end justify-between md:min-w-[200px]">
                  <div class="text-right mb-4">
                    <p class="text-sm text-gray-500 mb-1">Montant total</p>
                    <p class="text-2xl font-bold text-green-700">{{ order.total | number:'1.0-0' }} FCFA</p>
                    <div class="text-xs text-gray-500 mt-1">
                      <div>Sous-total: {{ order.subtotal | number:'1.0-0' }} FCFA</div>
                      <div *ngIf="order.shippingCost">Livraison: {{ order.shippingCost | number:'1.0-0' }} FCFA</div>
                      <div *ngIf="order.discount">Réduction: -{{ order.discount | number:'1.0-0' }} FCFA</div>
                    </div>
                  </div>
                  <button mat-flat-button color="primary" class="w-full">
                    <mat-icon class="mr-2">visibility</mat-icon>
                    Voir détails
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- No Results -->
        <div *ngIf="filteredOrders.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
          <mat-icon class="text-6xl text-gray-300 mb-4">search_off</mat-icon>
          <p class="text-gray-500">Aucune commande ne correspond à vos critères de recherche.</p>
        </div>

        <!-- Pagination -->
        <mat-paginator 
          *ngIf="filteredOrders.length > pageSize"
          [length]="filteredOrders.length"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 20, 50]"
          (page)="onPageChange($event)"
          class="mt-6 bg-white rounded-lg shadow-sm">
        </mat-paginator>
      </div>
    </div>
  `
})
export class OrderListComponent implements OnInit {
    orders: Order[] = [];
    filteredOrders: Order[] = [];
    paginatedOrders: Order[] = [];
    isLoading = true;

    // Filters
    searchTerm = '';
    selectedStatus = 'all';
    sortBy = 'date-desc';

    // Pagination
    pageSize = 10;
    currentPage = 0;

    constructor(
        private orderService: OrderService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        const userId = this.authService.currentUser()?.id;
        this.orderService.getOrders(userId).subscribe({
            next: (data) => {
                this.orders = data;
                this.filteredOrders = [...data];
                this.applySort();
                this.updatePaginatedOrders();
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    // Filtering
    applyFilters() {
        this.filteredOrders = this.orders.filter(order => {
            // Status filter
            if (this.selectedStatus !== 'all' && order.status !== this.selectedStatus) {
                return false;
            }

            // Search filter
            if (this.searchTerm) {
                const searchLower = this.searchTerm.toLowerCase();
                const matchesOrderNumber = order.orderNumber.toLowerCase().includes(searchLower);
                const matchesProduct = order.items.some(item => 
                    item.name.toLowerCase().includes(searchLower)
                );
                if (!matchesOrderNumber && !matchesProduct) {
                    return false;
                }
            }

            return true;
        });

        this.applySort();
        this.currentPage = 0;
        this.updatePaginatedOrders();
    }

    filterByStatus(status: string) {
        this.selectedStatus = status;
        this.applyFilters();
    }

    // Sorting
    applySort() {
        switch (this.sortBy) {
            case 'date-desc':
                this.filteredOrders.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                break;
            case 'date-asc':
                this.filteredOrders.sort((a, b) => 
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
                break;
            case 'total-desc':
                this.filteredOrders.sort((a, b) => b.total - a.total);
                break;
            case 'total-asc':
                this.filteredOrders.sort((a, b) => a.total - b.total);
                break;
        }
        this.updatePaginatedOrders();
    }

    // Pagination
    onPageChange(event: PageEvent) {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.updatePaginatedOrders();
    }

    updatePaginatedOrders() {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
    }

    // Status utilities
    getStatusCount(status: string): number {
        if (status === 'all') return this.orders.length;
        return this.orders.filter(o => o.status === status).length;
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

    // Payment utilities
    getPaymentMethodLabel(method: string): string {
        const labels: { [key: string]: string } = {
            'cash': 'Paiement à la livraison',
            'mobile_money': 'Mobile Money',
            'card': 'Carte bancaire',
            'bank_transfer': 'Virement bancaire'
        };
        return labels[method] || method;
    }

    getPaymentStatusClass(status: string): string {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'failed': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    getPaymentStatusLabel(status: string): string {
        const labels: { [key: string]: string } = {
            'paid': 'Payé',
            'pending': 'En attente',
            'failed': 'Échoué'
        };
        return labels[status] || status;
    }
}
