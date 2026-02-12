import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { OrderService } from '@core/services/order.service';
import { AuthService } from '@core/services/auth.service';
import { Order } from '@shared/models/order.model';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatChipsModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Mes Commandes</h2>
    </div>

    <div *ngIf="isLoading" class="flex justify-center p-8">
      <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
    </div>

    <div *ngIf="!isLoading && orders.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
      <mat-icon class="text-6xl text-gray-300 mb-4">shopping_bag</mat-icon>
      <p class="text-gray-500 mb-4">Vous n'avez pas encore passé de commande.</p>
      <a routerLink="/products" mat-stroked-button color="primary">Découvrir nos produits</a>
    </div>

    <div *ngIf="!isLoading && orders.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
      <table mat-table [dataSource]="orders" class="w-full">

        <!-- Order Column -->
        <ng-container matColumnDef="orderNumber">
          <th mat-header-cell *matHeaderCellDef> N° Commande </th>
          <td mat-cell *matCellDef="let order" class="font-mono font-semibold"> 
            {{ order.orderNumber }} 
          </td>
        </ng-container>

        <!-- Date Column -->
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef> Date </th>
          <td mat-cell *matCellDef="let order"> {{ order.createdAt | date:'shortDate' }} </td>
        </ng-container>

        <!-- Total Column -->
        <ng-container matColumnDef="total">
          <th mat-header-cell *matHeaderCellDef> Total </th>
          <td mat-cell *matCellDef="let order"> {{ order.total | number }} FCFA </td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef> Statut </th>
          <td mat-cell *matCellDef="let order">
            <span class="px-2 py-1 rounded text-xs font-bold uppercase" [ngClass]="getStatusColor(order.status)">
              {{ order.status }}
            </span>
          </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let order">
            <a mat-icon-button color="primary" [routerLink]="['/orders', order.id]" matTooltip="Voir les détails">
              <mat-icon>visibility</mat-icon>
            </a>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 transition"></tr>
      </table>
    </div>
  `
})
export class OrderListComponent implements OnInit {
    displayedColumns: string[] = ['orderNumber', 'date', 'total', 'status', 'actions'];
    orders: Order[] = [];
    isLoading = true;

    constructor(
        private orderService: OrderService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        const userId = this.authService.currentUser()?.id;
        this.orderService.getOrders(userId).subscribe({
            next: (data) => {
                this.orders = data;
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'shipping': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
}
