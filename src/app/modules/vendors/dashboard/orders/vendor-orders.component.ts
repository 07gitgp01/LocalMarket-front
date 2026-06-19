import { Component, OnInit, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { OrderService } from '@core/services/order.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { Order } from '@shared/models/order.model';

@Component({
  selector: 'app-refuse-order-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Refuser la commande</h2>
    <mat-dialog-content>
      <p>Êtes-vous sûr de vouloir refuser la commande <strong>{{ data.orderNumber }}</strong> ?</p>
      <p class="text-sm text-gray-500 mt-2">Le client sera informé que sa commande a été annulée.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Refuser la commande</button>
    </mat-dialog-actions>
  `
})
export class RefuseOrderDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { orderNumber: string }) {}
}

@Component({
    selector: 'app-vendor-orders',
    standalone: true,
    imports: [
      CommonModule,
      MatTabsModule,
      MatCardModule,
      MatButtonModule,
      MatIconModule,
      MatChipsModule,
      MatBadgeModule,
      MatProgressSpinnerModule,
      MatDialogModule
    ],
    template: `
    <div class="orders-page">

      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Gestion des Commandes</h1>
          <span class="total-count">{{ vendorOrders.length }} commande(s) au total</span>
        </div>
        <button class="refresh-btn" (click)="loadOrders()" title="Rafraîchir">
          <mat-icon>refresh</mat-icon>
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading" class="loading-state">
        <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
      </div>

      <!-- Tab bar + content -->
      <div *ngIf="!isLoading">

        <!-- Custom tab bar -->
        <div class="tab-bar">
          <button class="tab-item" [class.tab-active]="activeTab === 0" (click)="activeTab = 0">
            En attente
            <span class="tab-pill tab-pill-yellow" *ngIf="pendingOrders.length > 0">{{ pendingOrders.length }}</span>
          </button>
          <button class="tab-item" [class.tab-active]="activeTab === 1" (click)="activeTab = 1">
            En cours
            <span class="tab-pill tab-pill-blue" *ngIf="activeOrders.length > 0">{{ activeOrders.length }}</span>
          </button>
          <button class="tab-item" [class.tab-active]="activeTab === 2" (click)="activeTab = 2">
            Terminées
            <span class="tab-pill tab-pill-green" *ngIf="completedOrders.length > 0">{{ completedOrders.length }}</span>
          </button>
        </div>

        <!-- ── Tab 0: En attente ── -->
        <div *ngIf="activeTab === 0" class="tab-content">
          <div *ngIf="pendingOrders.length === 0" class="empty-state">
            <mat-icon class="empty-icon">inbox</mat-icon>
            <p class="empty-title">Aucune commande en attente</p>
            <p class="empty-sub">Les nouvelles commandes apparaîtront ici</p>
          </div>

          <div *ngFor="let order of pendingOrders" class="order-card order-card-pending">
            <div class="card-body card-body-pending">

              <!-- Info block -->
              <div class="order-info">
                <div class="order-top-row">
                  <div>
                    <span class="order-number">{{ order.orderNumber }}</span>
                    <span class="order-date">{{ order.createdAt | date:'dd/MM/yyyy à HH:mm' }}</span>
                  </div>
                  <span class="status-chip chip-yellow">En attente</span>
                </div>

                <div class="order-meta">
                  <span class="font-medium">{{ order.items.length }} article(s)</span>
                  <span class="meta-sep">•</span>
                  Total&nbsp;: <strong class="amount-green">{{ order.total | number:'1.0-0' }} FCFA</strong>
                </div>

                <div class="address-row">
                  <mat-icon class="addr-icon">location_on</mat-icon>
                  <span>{{ order.shippingAddress?.street }}, {{ order.shippingAddress?.city }}</span>
                </div>

                <div class="items-chips">
                  <span *ngFor="let item of order.items.slice(0, 3)" class="item-chip">
                    {{ item.name }} ×{{ item.quantity }}
                  </span>
                  <span *ngIf="order.items.length > 3" class="item-chip-more">
                    +{{ order.items.length - 3 }} autre(s)
                  </span>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="order-actions">
                <button class="btn-process"
                        (click)="processOrder(order)"
                        [disabled]="processingId === order.id">
                  <mat-icon *ngIf="processingId !== order.id">check_circle</mat-icon>
                  <mat-progress-spinner *ngIf="processingId === order.id"
                    diameter="16" mode="indeterminate"></mat-progress-spinner>
                  <span *ngIf="processingId !== order.id">Traiter</span>
                </button>
                <button class="btn-refuse"
                        (click)="refuseOrder(order)"
                        [disabled]="processingId === order.id">
                  <mat-icon>cancel</mat-icon>
                  Refuser
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- ── Tab 1: En cours ── -->
        <div *ngIf="activeTab === 1" class="tab-content">
          <div *ngIf="activeOrders.length === 0" class="empty-state">
            <mat-icon class="empty-icon">local_shipping</mat-icon>
            <p class="empty-title">Aucune commande en cours</p>
          </div>

          <div *ngFor="let order of activeOrders"
               class="order-card"
               [ngClass]="order.status === 'shipped' ? 'order-card-shipped' : 'order-card-processing'">
            <div class="card-body card-body-compact">
              <div class="compact-left">
                <span class="order-number">{{ order.orderNumber }}</span>
                <span class="status-chip" [ngClass]="getStatusClass(order.status)">{{ getStatusLabel(order.status) }}</span>
              </div>
              <div class="compact-center">
                <span class="compact-meta">{{ order.items.length }} article(s)</span>
                <span class="compact-meta">{{ order.createdAt | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="compact-right">
                <span class="amount-green amount-lg">{{ order.total | number:'1.0-0' }} FCFA</span>
                <span class="compact-meta">{{ order.shippingAddress?.city }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Tab 2: Terminées ── -->
        <div *ngIf="activeTab === 2" class="tab-content">
          <div *ngIf="completedOrders.length === 0" class="empty-state">
            <mat-icon class="empty-icon">check_circle</mat-icon>
            <p class="empty-title">Aucune commande terminée</p>
          </div>

          <div *ngFor="let order of completedOrders" class="order-card order-card-delivered">
            <div class="card-body card-body-compact">
              <div class="compact-left">
                <span class="order-number">{{ order.orderNumber }}</span>
                <span class="status-chip chip-green">Livrée</span>
              </div>
              <div class="compact-center">
                <span class="compact-meta">{{ order.items.length }} article(s)</span>
                <span class="compact-meta">{{ order.createdAt | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="compact-right">
                <span class="amount-green amount-lg">{{ order.total | number:'1.0-0' }} FCFA</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    `,
    styles: [`
      /* ── Page shell ── */
      .orders-page {
        background: #f8fafc;
        min-height: 100%;
        padding: 28px 32px;
        box-sizing: border-box;
      }

      /* ── Header ── */
      .page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 28px;
      }
      .page-title {
        font-size: 1.4rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 4px;
        line-height: 1.2;
      }
      .total-count {
        font-size: 0.82rem;
        color: #94a3b8;
      }
      .refresh-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        background: #fff;
        color: #64748b;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
        flex-shrink: 0;
      }
      .refresh-btn:hover {
        background: #f1f5f9;
        color: #0f172a;
      }
      .refresh-btn mat-icon { font-size: 20px; width: 20px; height: 20px; }

      /* ── Loading ── */
      .loading-state {
        display: flex;
        justify-content: center;
        padding: 64px 0;
      }

      /* ── Tab bar ── */
      .tab-bar {
        display: flex;
        gap: 4px;
        background: #fff;
        border: 1px solid #f1f5f9;
        border-radius: 12px 12px 0 0;
        padding: 8px 12px 0;
        border-bottom: none;
      }
      .tab-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        font-size: 0.875rem;
        font-weight: 500;
        color: #64748b;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        border-radius: 8px 8px 0 0;
        transition: color 0.15s;
        white-space: nowrap;
      }
      .tab-item:hover { color: #0f172a; }
      .tab-active {
        color: #16a34a !important;
        font-weight: 700;
        border-bottom: 2px solid #16a34a;
      }
      .tab-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 20px;
        height: 20px;
        padding: 0 6px;
        border-radius: 999px;
        font-size: 0.7rem;
        font-weight: 700;
        line-height: 1;
      }
      .tab-pill-yellow { background: #fef9c3; color: #92400e; }
      .tab-pill-blue   { background: #dbeafe; color: #1e40af; }
      .tab-pill-green  { background: #dcfce7; color: #15803d; }

      /* ── Tab content area ── */
      .tab-content {
        background: #fff;
        border: 1px solid #f1f5f9;
        border-top: none;
        border-radius: 0 0 12px 12px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      /* ── Order cards ── */
      .order-card {
        background: #fff;
        border: 1px solid #f1f5f9;
        border-radius: 12px;
        border-left: 4px solid #e2e8f0;
        overflow: hidden;
      }
      .order-card-pending    { border-left-color: #eab308; }
      .order-card-processing { border-left-color: #3b82f6; }
      .order-card-shipped    { border-left-color: #a855f7; }
      .order-card-delivered  { border-left-color: #22c55e; }

      /* ── Pending card body ── */
      .card-body-pending {
        display: flex;
        flex-direction: row;
        gap: 24px;
        padding: 20px;
        align-items: flex-start;
      }
      @media (max-width: 640px) {
        .card-body-pending { flex-direction: column; }
      }

      /* ── Order info (pending) ── */
      .order-info { flex: 1; min-width: 0; }

      .order-top-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 10px;
        flex-wrap: wrap;
      }
      .order-number {
        display: block;
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.9rem;
        font-weight: 700;
        color: #0f172a;
        letter-spacing: 0.03em;
      }
      .order-date {
        display: block;
        font-size: 0.75rem;
        color: #94a3b8;
        margin-top: 2px;
      }

      .order-meta {
        font-size: 0.85rem;
        color: #64748b;
        margin-bottom: 10px;
      }
      .meta-sep { margin: 0 6px; color: #cbd5e1; }
      .amount-green { color: #15803d; }
      .amount-lg { font-size: 1rem; font-weight: 700; }

      .address-row {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        font-size: 0.82rem;
        color: #64748b;
        background: #f8fafc;
        padding: 8px 10px;
        border-radius: 8px;
        margin-bottom: 10px;
      }
      .addr-icon { font-size: 15px; width: 15px; height: 15px; margin-top: 1px; flex-shrink: 0; color: #94a3b8; }

      .items-chips { display: flex; flex-wrap: wrap; gap: 6px; }
      .item-chip {
        font-size: 0.75rem;
        background: #eff6ff;
        color: #1d4ed8;
        padding: 3px 8px;
        border-radius: 6px;
      }
      .item-chip-more {
        font-size: 0.75rem;
        background: #f1f5f9;
        color: #64748b;
        padding: 3px 8px;
        border-radius: 6px;
      }

      /* ── Status chips ── */
      .status-chip {
        display: inline-flex;
        align-items: center;
        padding: 3px 10px;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 700;
        white-space: nowrap;
      }
      .chip-yellow { background: #fef9c3; color: #92400e; }
      .chip-green  { background: #dcfce7; color: #15803d; }

      /* ── Action buttons ── */
      .order-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 130px;
        justify-content: center;
        flex-shrink: 0;
      }
      .btn-process {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 9px 16px;
        border-radius: 8px;
        border: none;
        background: #16a34a;
        color: #fff;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s;
      }
      .btn-process:hover:not(:disabled) { background: #15803d; }
      .btn-process:disabled { opacity: 0.55; cursor: not-allowed; }
      .btn-process mat-icon { font-size: 17px; width: 17px; height: 17px; }

      .btn-refuse {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 8px;
        border: 1.5px solid #ef4444;
        background: #fff;
        color: #ef4444;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s;
      }
      .btn-refuse:hover:not(:disabled) { background: #fef2f2; }
      .btn-refuse:disabled { opacity: 0.55; cursor: not-allowed; }
      .btn-refuse mat-icon { font-size: 17px; width: 17px; height: 17px; }

      /* ── Compact card body (active / completed) ── */
      .card-body-compact {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 18px;
        gap: 16px;
        flex-wrap: wrap;
      }
      .compact-left {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 200px;
      }
      .compact-center {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
      }
      .compact-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;
      }
      .compact-meta {
        font-size: 0.8rem;
        color: #94a3b8;
      }

      /* ── Empty state ── */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 56px 0;
        text-align: center;
      }
      .empty-icon {
        font-size: 52px;
        width: 52px;
        height: 52px;
        color: #e2e8f0;
        margin-bottom: 14px;
      }
      .empty-title {
        font-size: 0.95rem;
        font-weight: 600;
        color: #94a3b8;
        margin: 0 0 4px;
      }
      .empty-sub {
        font-size: 0.82rem;
        color: #cbd5e1;
        margin: 0;
      }
    `]
})
export class VendorOrdersComponent implements OnInit {
    private orderService = inject(OrderService);
    private authService = inject(AuthService);
    private notification = inject(NotificationService);
    private dialog = inject(MatDialog);

    vendorOrders: Order[] = [];
    isLoading = true;
    processingId: number | null = null;
    activeTab = 0;
    private vendorId!: number;

    get pendingOrders() {
        return this.vendorOrders.filter(o => o.status === 'pending');
    }

    get activeOrders() {
        return this.vendorOrders.filter(o => o.status === 'processing' || o.status === 'shipped');
    }

    get completedOrders() {
        return this.vendorOrders.filter(o => o.status === 'delivered');
    }

    ngOnInit() {
        this.vendorId = this.authService.currentUser()?.vendorId || 1;
        this.loadOrders();
    }

    loadOrders() {
        this.isLoading = true;
        this.orderService.getOrders().subscribe({
            next: (orders) => {
                this.vendorOrders = orders.filter(order =>
                    order.items.some((item: any) => item.vendorId === this.vendorId)
                );
                this.isLoading = false;
            },
            error: () => {
                this.notification.error('Erreur lors du chargement des commandes');
                this.isLoading = false;
            }
        });
    }

    processOrder(order: Order) {
        this.processingId = order.id;
        this.orderService.updateOrderStatus(order.id, 'processing').subscribe({
            next: () => {
                this.notification.success(`Commande ${order.orderNumber} mise en traitement`);
                order.status = 'processing';
                this.processingId = null;
            },
            error: () => {
                this.notification.error('Erreur lors de la mise à jour');
                this.processingId = null;
            }
        });
    }

    refuseOrder(order: Order) {
        this.dialog.open(RefuseOrderDialogComponent, {
            data: { orderNumber: order.orderNumber },
            width: '400px'
        }).afterClosed().subscribe(confirmed => {
            if (!confirmed) return;
            this.processingId = order.id;
            this.orderService.updateOrderStatus(order.id, 'cancelled').subscribe({
                next: () => {
                    this.notification.success(`Commande ${order.orderNumber} refusée`);
                    this.vendorOrders = this.vendorOrders.filter(o => o.id !== order.id);
                    this.processingId = null;
                },
                error: () => {
                    this.notification.error('Erreur lors du refus');
                    this.processingId = null;
                }
            });
        });
    }

    getStatusClass(status: string): string {
        const map: Record<string, string> = {
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
        };
        return map[status] || 'bg-gray-100 text-gray-800';
    }

    getStatusLabel(status: string): string {
        const map: Record<string, string> = {
            processing: 'En traitement',
            shipped: 'Expédiée',
        };
        return map[status] || status;
    }
}
