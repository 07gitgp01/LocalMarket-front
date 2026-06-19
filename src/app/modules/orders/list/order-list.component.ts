import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { OrderService } from '@core/services/order.service';
import { AuthService } from '@core/services/auth.service';
import { Order } from '@shared/models/order.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [
        CommonModule, RouterLink, FormsModule,
        MatPaginatorModule, MatButtonModule, MatIconModule,
        MatProgressSpinnerModule, MatFormFieldModule, MatSelectModule,
        LoadingSpinnerComponent, EmptyStateComponent
    ],
    template: `
<div class="ol-page">

  <!-- HERO HEADER -->
  <div class="ol-hero">
    <div class="ol-hero-inner">
      <div>
        <h1 class="ol-hero-title">Mes Commandes</h1>
        <p class="ol-hero-sub">Suivez l'état de vos achats et votre historique</p>
      </div>
      <div class="ol-stats">
        <div class="ol-stat">
          <div class="ol-stat-val">{{ orders.length }}</div>
          <div class="ol-stat-lbl">Total</div>
        </div>
        <div class="ol-stat ol-stat--grn">
          <div class="ol-stat-val">{{ getStatusCount('delivered') }}</div>
          <div class="ol-stat-lbl">Livrées</div>
        </div>
        <div class="ol-stat ol-stat--amb">
          <div class="ol-stat-val">{{ getStatusCount('pending') + getStatusCount('processing') }}</div>
          <div class="ol-stat-lbl">En cours</div>
        </div>
      </div>
    </div>
  </div>

  <div class="ol-body">
    <app-loading-spinner *ngIf="isLoading" [fullscreen]="false" message="Chargement de vos commandes..."></app-loading-spinner>

    <app-empty-state
      *ngIf="!isLoading && orders.length === 0"
      icon="shopping_bag"
      title="Aucune commande"
      description="Vous n'avez pas encore passé de commande. Découvrez nos produits locaux!"
      actionText="Découvrir les produits"
      actionRoute="/products">
    </app-empty-state>

    <div *ngIf="!isLoading && orders.length > 0">

      <!-- FILTERS -->
      <div class="ol-filters">
        <div class="ol-filter-top">
          <div class="ol-search">
            <mat-icon>search</mat-icon>
            <input class="ol-search-input" [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()" placeholder="Rechercher par n° commande ou produit...">
          </div>
          <mat-form-field appearance="outline" class="ol-sort">
            <mat-label>Trier par</mat-label>
            <mat-select [(value)]="sortBy" (selectionChange)="applySort()">
              <mat-option value="date-desc">Plus récentes</mat-option>
              <mat-option value="date-asc">Plus anciennes</mat-option>
              <mat-option value="total-desc">Montant ↓</mat-option>
              <mat-option value="total-asc">Montant ↑</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="ol-chips">
          <button class="ol-chip" [class.ol-chip--sel]="selectedStatus === 'all'" (click)="filterByStatus('all')">Toutes ({{ getStatusCount('all') }})</button>
          <button class="ol-chip ol-chip--pend" [class.ol-chip--sel]="selectedStatus === 'pending'" (click)="filterByStatus('pending')">En attente ({{ getStatusCount('pending') }})</button>
          <button class="ol-chip ol-chip--proc" [class.ol-chip--sel]="selectedStatus === 'processing'" (click)="filterByStatus('processing')">En traitement ({{ getStatusCount('processing') }})</button>
          <button class="ol-chip ol-chip--ship" [class.ol-chip--sel]="selectedStatus === 'shipped'" (click)="filterByStatus('shipped')">Expédiées ({{ getStatusCount('shipped') }})</button>
          <button class="ol-chip ol-chip--delv" [class.ol-chip--sel]="selectedStatus === 'delivered'" (click)="filterByStatus('delivered')">Livrées ({{ getStatusCount('delivered') }})</button>
          <button class="ol-chip ol-chip--canc" [class.ol-chip--sel]="selectedStatus === 'cancelled'" (click)="filterByStatus('cancelled')">Annulées ({{ getStatusCount('cancelled') }})</button>
        </div>
      </div>

      <!-- ORDER CARDS -->
      <div class="ol-list">
        <div *ngFor="let order of paginatedOrders" class="ol-card" [class]="'ol-card--' + order.status" [routerLink]="['/orders', order.id]">
          <div class="ol-card-body">
            <div class="ol-card-top">
              <div class="ol-card-id">
                <span class="ol-order-num">{{ order.orderNumber }}</span>
                <span class="ol-status-pill" [ngClass]="getStatusClass(order.status)">{{ getStatusLabel(order.status) }}</span>
              </div>
              <div class="ol-card-date">
                <mat-icon>calendar_today</mat-icon>
                {{ order.createdAt | date:'dd/MM/yyyy à HH:mm' }}
              </div>
            </div>

            <div class="ol-items-row">
              <div *ngFor="let item of order.items.slice(0, 3)" class="ol-preview">
                <img *ngIf="item.product?.images?.[0]" [src]="item.product!.images![0]" [alt]="item.name" class="ol-preview-img">
                <div *ngIf="!item.product?.images?.[0]" class="ol-preview-ph"><mat-icon>inventory_2</mat-icon></div>
                <div class="ol-preview-info">
                  <div class="ol-preview-name">{{ item.name }}</div>
                  <div class="ol-preview-qty">×{{ item.quantity }}</div>
                </div>
              </div>
              <div *ngIf="order.items.length > 3" class="ol-preview ol-preview--more">
                +{{ order.items.length - 3 }} autre(s)
              </div>
            </div>

            <div class="ol-card-meta">
              <div class="ol-meta-item">
                <mat-icon>payment</mat-icon>
                {{ getPaymentMethodLabel(order.paymentMethod) }}
                <span class="ol-pay-st" [ngClass]="getPaymentStatusClass(order.paymentStatus)">{{ getPaymentStatusLabel(order.paymentStatus) }}</span>
              </div>
              <div class="ol-meta-item" *ngIf="order.deliveryDate">
                <mat-icon>local_shipping</mat-icon>
                Livraison : {{ order.deliveryDate | date:'dd/MM/yyyy' }}
              </div>
            </div>
          </div>

          <div class="ol-card-right">
            <div class="ol-card-total">
              <div class="ol-total-lbl">Total</div>
              <div class="ol-total-val">{{ order.total | number:'1.0-0' }} FCFA</div>
              <div class="ol-total-sub">{{ order.items.length }} article(s)</div>
            </div>
            <div class="ol-card-arrow"><mat-icon>east</mat-icon></div>
          </div>
        </div>
      </div>

      <div *ngIf="filteredOrders.length === 0" class="ol-empty">
        <mat-icon>search_off</mat-icon>
        <p>Aucune commande ne correspond à vos critères.</p>
        <button class="ol-reset-btn" (click)="filterByStatus('all'); searchTerm = ''">Réinitialiser les filtres</button>
      </div>

      <mat-paginator
        *ngIf="filteredOrders.length > pageSize"
        [length]="filteredOrders.length"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 20, 50]"
        (page)="onPageChange($event)"
        class="ol-paginator">
      </mat-paginator>
    </div>
  </div>
</div>
    `,
    styles: [`
:host { display: block; background: #f8fafc; min-height: 100vh; }

.ol-hero { background: linear-gradient(135deg, #065f46, #047857); color: white; padding: 28px 0; }
.ol-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.ol-hero-title { font-size: 1.75rem; font-weight: 800; margin: 0; }
.ol-hero-sub { font-size: 0.875rem; opacity: 0.85; margin: 6px 0 0; }

.ol-stats { display: flex; gap: 16px; }
.ol-stat { background: rgba(255,255,255,.15); border-radius: 12px; padding: 14px 20px; text-align: center; min-width: 72px; border: 1px solid rgba(255,255,255,.25); }
.ol-stat--grn { background: rgba(167,243,208,.2); border-color: rgba(167,243,208,.4); }
.ol-stat--amb { background: rgba(253,230,138,.2); border-color: rgba(253,230,138,.3); }
.ol-stat-val { font-size: 1.5rem; font-weight: 800; }
.ol-stat-lbl { font-size: 0.72rem; opacity: 0.8; margin-top: 2px; }

.ol-body { max-width: 1200px; margin: 28px auto; padding: 0 24px; }

.ol-filters { background: white; border-radius: 14px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.06); }
.ol-filter-top { display: grid; grid-template-columns: 1fr 200px; gap: 12px; margin-bottom: 16px; }
@media (max-width: 600px) { .ol-filter-top { grid-template-columns: 1fr; } }
.ol-search { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; transition: border-color .2s; }
.ol-search:focus-within { border-color: #059669; }
.ol-search mat-icon { color: #9ca3af; font-size: 20px; width: 20px; height: 20px; }
.ol-search-input { flex: 1; border: none; outline: none; font-size: 0.875rem; color: #374151; background: transparent; }
.ol-sort { width: 100%; }

.ol-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.ol-chip { padding: 6px 14px; border-radius: 20px; border: 1.5px solid #e5e7eb; background: transparent; font-size: 0.8rem; font-weight: 500; color: #6b7280; cursor: pointer; transition: all .2s; }
.ol-chip:hover { border-color: #d1d5db; background: #f9fafb; }
.ol-chip--sel { background: #f1f5f9 !important; border-color: #374151 !important; color: #111827 !important; font-weight: 700; }
.ol-chip--pend.ol-chip--sel { background: #fef3c7 !important; border-color: #d97706 !important; color: #92400e !important; }
.ol-chip--proc.ol-chip--sel { background: #dbeafe !important; border-color: #2563eb !important; color: #1e40af !important; }
.ol-chip--ship.ol-chip--sel { background: #ede9fe !important; border-color: #7c3aed !important; color: #4c1d95 !important; }
.ol-chip--delv.ol-chip--sel { background: #dcfce7 !important; border-color: #059669 !important; color: #065f46 !important; }
.ol-chip--canc.ol-chip--sel { background: #fee2e2 !important; border-color: #ef4444 !important; color: #7f1d1d !important; }

.ol-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }

.ol-card { display: flex; background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 2px 8px rgba(0,0,0,.05); border-left: 4px solid #e5e7eb; cursor: pointer; transition: all .25s; text-decoration: none; }
.ol-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,.12); }
.ol-card--pending { border-left-color: #f59e0b; }
.ol-card--processing { border-left-color: #3b82f6; }
.ol-card--shipped { border-left-color: #8b5cf6; }
.ol-card--delivered { border-left-color: #059669; }
.ol-card--cancelled { border-left-color: #ef4444; opacity: 0.8; }

.ol-card-body { flex: 1; padding: 18px 20px; min-width: 0; }
.ol-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px; }
.ol-card-id { display: flex; align-items: center; gap: 10px; }
.ol-order-num { font-weight: 800; font-size: 0.95rem; color: #111827; font-family: monospace; }
.ol-status-pill { padding: 3px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
.ol-card-date { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: #9ca3af; }
.ol-card-date mat-icon { font-size: 14px; width: 14px; height: 14px; }

.ol-items-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.ol-preview { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 6px 10px; }
.ol-preview-img { width: 36px; height: 36px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
.ol-preview-ph { width: 36px; height: 36px; background: #e5e7eb; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ol-preview-ph mat-icon { font-size: 18px; width: 18px; height: 18px; color: #9ca3af; }
.ol-preview-name { font-size: 0.78rem; font-weight: 600; color: #374151; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ol-preview-qty { font-size: 0.72rem; color: #9ca3af; }
.ol-preview--more { color: #6b7280; font-size: 0.78rem; font-weight: 600; background: #f1f5f9; }

.ol-card-meta { display: flex; flex-wrap: wrap; gap: 16px; }
.ol-meta-item { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: #6b7280; }
.ol-meta-item mat-icon { font-size: 16px; width: 16px; height: 16px; }
.ol-pay-st { font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; }

.ol-card-right { display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; padding: 18px 20px; background: linear-gradient(180deg, #fafafa, #f4f4f5); border-left: 1px solid #f1f5f9; min-width: 160px; flex-shrink: 0; }
.ol-card--delivered .ol-card-right { background: linear-gradient(180deg, #f0fdf4, #ecfdf5); border-left-color: #d1fae5; }
.ol-total-lbl { font-size: 0.72rem; color: #9ca3af; text-transform: uppercase; letter-spacing: .04em; }
.ol-total-val { font-size: 1.15rem; font-weight: 800; color: #059669; margin-top: 4px; }
.ol-total-sub { font-size: 0.75rem; color: #9ca3af; margin-top: 2px; }
.ol-card-arrow { width: 34px; height: 34px; background: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; transition: transform .2s; }
.ol-card:hover .ol-card-arrow { transform: translateX(3px); }
.ol-card-arrow mat-icon { font-size: 18px; width: 18px; height: 18px; }

.ol-empty { text-align: center; padding: 48px 24px; background: white; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
.ol-empty mat-icon { font-size: 4rem; width: 4rem; height: 4rem; color: #d1d5db; display: block; margin: 0 auto 16px; }
.ol-empty p { color: #6b7280; margin-bottom: 16px; }
.ol-reset-btn { padding: 8px 20px; background: #059669; color: white; border: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer; }

.ol-paginator { margin-top: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.08); }

@media (max-width: 600px) {
  .ol-hero-inner { flex-direction: column; align-items: flex-start; }
  .ol-stats { gap: 10px; }
  .ol-body { padding: 0 16px; margin: 16px auto; }
  .ol-card { flex-direction: column; }
  .ol-card-right { flex-direction: row; min-width: auto; border-left: none; border-top: 1px solid #f1f5f9; }
}
    `]
})
export class OrderListComponent implements OnInit {
    orders: Order[] = [];
    filteredOrders: Order[] = [];
    paginatedOrders: Order[] = [];
    isLoading = true;

    searchTerm = '';
    selectedStatus = 'all';
    sortBy = 'date-desc';

    pageSize = 10;
    currentPage = 0;

    constructor(private orderService: OrderService, private authService: AuthService) { }

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

    applyFilters() {
        this.filteredOrders = this.orders.filter(order => {
            if (this.selectedStatus !== 'all' && order.status !== this.selectedStatus) return false;
            if (this.searchTerm) {
                const q = this.searchTerm.toLowerCase();
                return order.orderNumber.toLowerCase().includes(q) || order.items.some(i => i.name.toLowerCase().includes(q));
            }
            return true;
        });
        this.applySort();
        this.currentPage = 0;
        this.updatePaginatedOrders();
    }

    filterByStatus(status: string) { this.selectedStatus = status; this.applyFilters(); }

    applySort() {
        switch (this.sortBy) {
            case 'date-desc': this.filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
            case 'date-asc': this.filteredOrders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
            case 'total-desc': this.filteredOrders.sort((a, b) => b.total - a.total); break;
            case 'total-asc': this.filteredOrders.sort((a, b) => a.total - b.total); break;
        }
        this.updatePaginatedOrders();
    }

    onPageChange(event: PageEvent) { this.currentPage = event.pageIndex; this.pageSize = event.pageSize; this.updatePaginatedOrders(); }
    updatePaginatedOrders() { const s = this.currentPage * this.pageSize; this.paginatedOrders = this.filteredOrders.slice(s, s + this.pageSize); }

    getStatusCount(status: string): number { return status === 'all' ? this.orders.length : this.orders.filter(o => o.status === status).length; }

    getStatusClass(status: string): string {
        const m: Record<string, string> = { 'pending': 'bg-yellow-100 text-yellow-800', 'processing': 'bg-blue-100 text-blue-800', 'shipped': 'bg-purple-100 text-purple-800', 'delivered': 'bg-green-100 text-green-800', 'cancelled': 'bg-red-100 text-red-800' };
        return m[status] || 'bg-gray-100 text-gray-800';
    }

    getStatusLabel(status: string): string {
        const m: Record<string, string> = { 'pending': 'En attente', 'processing': 'En traitement', 'shipped': 'Expédiée', 'delivered': 'Livrée', 'cancelled': 'Annulée' };
        return m[status] || status;
    }

    getPaymentMethodLabel(method: string): string {
        const m: Record<string, string> = { 'cash': 'Espèces', 'cash_on_delivery': 'Paiement à la livraison', 'orange_money': 'Orange Money', 'wave': 'Wave', 'mobile_money': 'Mobile Money', 'card': 'Carte bancaire' };
        return m[method] || method;
    }

    getPaymentStatusClass(status: string): string {
        const m: Record<string, string> = { 'paid': 'bg-green-100 text-green-700', 'pending': 'bg-yellow-100 text-yellow-700', 'failed': 'bg-red-100 text-red-700' };
        return m[status] || 'bg-gray-100 text-gray-700';
    }

    getPaymentStatusLabel(status: string): string {
        const m: Record<string, string> = { 'paid': 'Payé', 'pending': 'En attente', 'failed': 'Échoué' };
        return m[status] || status;
    }
}
