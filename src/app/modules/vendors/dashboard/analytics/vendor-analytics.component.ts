import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { OrderService } from '@core/services/order.service';
import { ProductService } from '@core/services/product.service';
import { AuthService } from '@core/services/auth.service';

interface MonthBar {
  month: string;
  revenue: number;
  orders: number;
  height: number;
  isCurrent: boolean;
}

interface TopProduct {
  id: number;
  name: string;
  images: string[];
  price: number;
  soldCount: number;
  salesPct: number;
}

@Component({
  selector: 'app-vendor-analytics',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatSelectModule, MatFormFieldModule
  ],
  template: `
    <!-- ── Loading ─────────────────────────────────────── -->
    <div class="loading-wrap" *ngIf="isLoading">
      <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
      <p>Chargement des statistiques…</p>
    </div>

    <div *ngIf="!isLoading">

      <!-- ── Welcome banner ──────────────────────────────── -->
      <div class="welcome">
        <div class="welcome-left">
          <h1 class="welcome-title">Bonjour, {{ firstName }} 👋</h1>
          <p class="welcome-sub">{{ currentDate }} · Voici votre résumé</p>
        </div>
        <div class="welcome-right">
          <mat-form-field appearance="outline" class="period-field">
            <mat-select [(value)]="selectedPeriod" (selectionChange)="loadAnalytics()">
              <mat-option value="week">Cette semaine</mat-option>
              <mat-option value="month">Ce mois</mat-option>
              <mat-option value="year">Cette année</mat-option>
            </mat-select>
          </mat-form-field>
          <a mat-flat-button color="primary" routerLink="../products/new" class="add-btn">
            <mat-icon>add</mat-icon> Nouveau produit
          </a>
        </div>
      </div>

      <!-- ── KPI Cards ────────────────────────────────────── -->
      <div class="kpi-grid">

        <div class="kpi-card">
          <div class="kpi-icon kpi-blue"><mat-icon>payments</mat-icon></div>
          <div class="kpi-body">
            <span class="kpi-label">Revenus</span>
            <span class="kpi-value">{{ analytics().totalRevenue | number:'1.0-0' }}<small> FCFA</small></span>
            <span class="kpi-trend" [class.up]="analytics().revenueGrowth >= 0" [class.down]="analytics().revenueGrowth < 0">
              <mat-icon>{{ analytics().revenueGrowth >= 0 ? 'north' : 'south' }}</mat-icon>
              {{ analytics().revenueGrowth >= 0 ? '+' : '' }}{{ analytics().revenueGrowth }}% vs précédent
            </span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-violet"><mat-icon>shopping_bag</mat-icon></div>
          <div class="kpi-body">
            <span class="kpi-label">Commandes</span>
            <span class="kpi-value">{{ analytics().totalOrders }}</span>
            <span class="kpi-trend" [class.up]="analytics().ordersGrowth >= 0" [class.down]="analytics().ordersGrowth < 0">
              <mat-icon>{{ analytics().ordersGrowth >= 0 ? 'north' : 'south' }}</mat-icon>
              {{ analytics().ordersGrowth >= 0 ? '+' : '' }}{{ analytics().ordersGrowth }}% vs précédent
            </span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-amber"><mat-icon>inventory_2</mat-icon></div>
          <div class="kpi-body">
            <span class="kpi-label">Produits actifs</span>
            <span class="kpi-value">{{ analytics().totalProducts }}</span>
            <span class="kpi-info">
              <mat-icon>warning</mat-icon>
              {{ analytics().lowStockProducts }} en stock faible
            </span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-green"><mat-icon>star</mat-icon></div>
          <div class="kpi-body">
            <span class="kpi-label">Note moyenne</span>
            <span class="kpi-value">{{ analytics().averageRating | number:'1.1-1' }}<small> /5</small></span>
            <span class="kpi-info">
              <mat-icon>reviews</mat-icon>
              {{ analytics().totalReviews }} avis clients
            </span>
          </div>
        </div>

      </div>

      <!-- ── Charts row ───────────────────────────────────── -->
      <div class="charts-row">

        <!-- Monthly bar chart -->
        <div class="chart-card">
          <div class="card-head">
            <div>
              <h2 class="card-title">Revenus mensuels</h2>
              <p class="card-sub">6 derniers mois</p>
            </div>
            <div class="chart-legend">
              <span class="legend-dot current"></span><span>Mois actuel</span>
              <span class="legend-dot past"></span><span>Passé</span>
            </div>
          </div>

          <div class="bar-chart" *ngIf="monthlyData.length > 0; else noChart">
            <div class="bar-col" *ngFor="let m of monthlyData">
              <span class="bar-val" [class.bar-val-visible]="m.revenue > 0">
                {{ m.revenue > 0 ? (m.revenue | number:'1.0-0') : '' }}
              </span>
              <div class="bar-track">
                <div class="bar-fill" [class.current]="m.isCurrent" [style.height.%]="m.height || 2"></div>
              </div>
              <span class="bar-label" [class.bar-label-current]="m.isCurrent">{{ m.month }}</span>
              <span class="bar-orders" *ngIf="m.orders > 0">{{ m.orders }} cmd</span>
            </div>
          </div>
          <ng-template #noChart>
            <div class="empty-chart">
              <mat-icon>bar_chart</mat-icon>
              <p>Aucune donnée pour cette période</p>
            </div>
          </ng-template>
        </div>

        <!-- Top products -->
        <div class="top-card">
          <div class="card-head">
            <div>
              <h2 class="card-title">Meilleures ventes</h2>
              <p class="card-sub">Par quantité vendue</p>
            </div>
            <a routerLink="../products" mat-button color="primary" class="see-all">Tout voir</a>
          </div>

          <div class="top-list" *ngIf="topProducts.length > 0; else noProducts">
            <div class="top-item" *ngFor="let p of topProducts; let i = index">
              <span class="top-rank" [class.gold]="i===0" [class.silver]="i===1" [class.bronze]="i===2">
                #{{ i + 1 }}
              </span>
              <div class="top-thumb">
                <img *ngIf="p.images?.[0]" [src]="p.images[0]" [alt]="p.name">
                <mat-icon *ngIf="!p.images?.[0]">image</mat-icon>
              </div>
              <div class="top-info">
                <span class="top-name">{{ p.name }}</span>
                <div class="top-bar-wrap">
                  <div class="top-bar">
                    <div class="top-bar-fill" [style.width.%]="p.salesPct"></div>
                  </div>
                  <span class="top-sold">{{ p.soldCount }} vte{{ p.soldCount > 1 ? 's' : '' }}</span>
                </div>
              </div>
            </div>
          </div>
          <ng-template #noProducts>
            <div class="empty-state">
              <mat-icon>inventory_2</mat-icon>
              <p>Aucune vente enregistrée</p>
            </div>
          </ng-template>
        </div>

      </div>

      <!-- ── Recent orders ────────────────────────────────── -->
      <div class="orders-card">
        <div class="card-head">
          <div>
            <h2 class="card-title">Commandes récentes</h2>
            <p class="card-sub">{{ recentOrders.length }} dernière(s) commande(s)</p>
          </div>
          <a routerLink="../orders" mat-stroked-button color="primary">Voir tout</a>
        </div>

        <div class="orders-list" *ngIf="recentOrders.length > 0; else noOrders">
          <div class="order-row" *ngFor="let o of recentOrders">
            <div class="order-num">
              <span class="order-hash">{{ o.orderNumber }}</span>
              <span class="order-items">{{ o.items?.length || 0 }} article(s)</span>
            </div>
            <div class="order-date">{{ o.createdAt | date:'dd MMM yyyy' }}</div>
            <div class="order-amount">{{ o.total | number:'1.0-0' }} <span class="fcfa">FCFA</span></div>
            <span class="order-chip" [ngClass]="getStatusClass(o.status)">{{ getStatusLabel(o.status) }}</span>
            <a mat-icon-button [routerLink]="['../orders']" class="order-view">
              <mat-icon>arrow_forward</mat-icon>
            </a>
          </div>
        </div>
        <ng-template #noOrders>
          <div class="empty-state">
            <mat-icon>receipt_long</mat-icon>
            <p>Aucune commande récente</p>
          </div>
        </ng-template>
      </div>

    </div>
  `,
  styles: [`
    /* ── Loading ──────────────────────────────────── */
    .loading-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 80px; color: #94a3b8; }

    /* ── Welcome ──────────────────────────────────── */
    .welcome {
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
      margin-bottom: 24px;
    }
    .welcome-title { font-size: 1.6rem; font-weight: 800; color: #0f172a; margin: 0; }
    .welcome-sub { font-size: 0.8rem; color: #94a3b8; margin: 4px 0 0; }
    .welcome-right { display: flex; align-items: center; gap: 10px; }
    .period-field { width: 160px; }
    ::ng-deep .period-field .mat-mdc-form-field-wrapper { padding-bottom: 0 !important; }
    .add-btn { border-radius: 10px !important; font-weight: 600 !important; }

    /* ── KPI Grid ─────────────────────────────────── */
    .kpi-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: white; border-radius: 14px;
      padding: 20px; display: flex; gap: 14px; align-items: flex-start;
      border: 1px solid #f1f5f9;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03);
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .kpi-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.07); transform: translateY(-1px); }
    .kpi-icon {
      width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .kpi-icon mat-icon { font-size: 22px; color: white; }
    .kpi-blue  { background: linear-gradient(135deg, #3b82f6, #1d4ed8); box-shadow: 0 4px 14px rgba(59,130,246,0.3); }
    .kpi-violet{ background: linear-gradient(135deg, #8b5cf6, #6d28d9); box-shadow: 0 4px 14px rgba(139,92,246,0.3); }
    .kpi-amber { background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 4px 14px rgba(245,158,11,0.3); }
    .kpi-green { background: linear-gradient(135deg, #22c55e, #15803d); box-shadow: 0 4px 14px rgba(34,197,94,0.3); }
    .kpi-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .kpi-label { font-size: 0.72rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.04em; }
    .kpi-value { font-size: 1.6rem; font-weight: 800; color: #0f172a; line-height: 1.1; }
    .kpi-value small { font-size: 0.75rem; font-weight: 600; color: #94a3b8; }
    .kpi-trend {
      display: flex; align-items: center; gap: 3px;
      font-size: 0.72rem; font-weight: 600;
      padding: 3px 7px; border-radius: 20px; width: fit-content; margin-top: 4px;
    }
    .kpi-trend mat-icon { font-size: 12px; width: 12px; height: 12px; }
    .kpi-trend.up   { background: #dcfce7; color: #16a34a; }
    .kpi-trend.down { background: #fee2e2; color: #dc2626; }
    .kpi-info {
      display: flex; align-items: center; gap: 3px;
      font-size: 0.72rem; color: #94a3b8; margin-top: 4px;
    }
    .kpi-info mat-icon { font-size: 13px; width: 13px; height: 13px; }

    /* ── Charts Row ───────────────────────────────── */
    .charts-row { display: grid; grid-template-columns: 1fr 320px; gap: 16px; margin-bottom: 20px; }

    .chart-card, .top-card, .orders-card {
      background: white; border-radius: 14px; padding: 20px;
      border: 1px solid #f1f5f9;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .card-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .card-title { font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0; }
    .card-sub   { font-size: 0.72rem; color: #94a3b8; margin: 2px 0 0; }
    .see-all { font-size: 0.8rem !important; }

    /* Bar chart */
    .chart-legend { display: flex; align-items: center; gap: 12px; font-size: 0.72rem; color: #94a3b8; }
    .legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 3px; }
    .legend-dot.current { background: #22c55e; }
    .legend-dot.past    { background: #bfdbfe; }

    .bar-chart {
      display: flex; align-items: flex-end; gap: 8px;
      height: 180px; padding-top: 24px;
    }
    .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; }
    .bar-val { font-size: 0.58rem; color: #94a3b8; height: 14px; text-align: center; white-space: nowrap; overflow: hidden; }
    .bar-val-visible { color: #475569; font-weight: 600; }
    .bar-track {
      flex: 1; width: 100%; max-width: 36px;
      background: #f1f5f9; border-radius: 6px 6px 4px 4px;
      display: flex; align-items: flex-end; overflow: hidden;
    }
    .bar-fill {
      width: 100%;
      background: linear-gradient(to top, #93c5fd, #bfdbfe);
      border-radius: 4px 4px 0 0;
      transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      min-height: 2px;
    }
    .bar-fill.current {
      background: linear-gradient(to top, #16a34a, #4ade80);
      box-shadow: 0 0 12px rgba(34,197,94,0.25);
    }
    .bar-label { font-size: 0.68rem; color: #94a3b8; font-weight: 500; text-transform: capitalize; }
    .bar-label-current { color: #16a34a; font-weight: 700; }
    .bar-orders { font-size: 0.58rem; color: #cbd5e1; }
    .empty-chart { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px; color: #cbd5e1; }
    .empty-chart mat-icon { font-size: 40px; }

    /* Top products */
    .top-list { display: flex; flex-direction: column; gap: 14px; }
    .top-item { display: flex; align-items: center; gap: 10px; }
    .top-rank { width: 24px; font-size: 0.7rem; font-weight: 800; color: #cbd5e1; text-align: center; flex-shrink: 0; }
    .top-rank.gold   { color: #f59e0b; }
    .top-rank.silver { color: #94a3b8; }
    .top-rank.bronze { color: #b45309; }
    .top-thumb {
      width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
      background: #f8fafc; border: 1px solid #f1f5f9; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
    }
    .top-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .top-thumb mat-icon { font-size: 18px; color: #cbd5e1; }
    .top-info { flex: 1; min-width: 0; }
    .top-name { font-size: 0.8rem; font-weight: 600; color: #334155; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
    .top-bar-wrap { display: flex; align-items: center; gap: 8px; }
    .top-bar { flex: 1; height: 5px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
    .top-bar-fill { height: 100%; background: linear-gradient(90deg, #22c55e, #86efac); border-radius: 3px; }
    .top-sold { font-size: 0.65rem; color: #94a3b8; font-weight: 600; white-space: nowrap; flex-shrink: 0; }

    /* ── Recent orders ────────────────────────────── */
    .orders-card { }
    .orders-list { display: flex; flex-direction: column; gap: 2px; }
    .order-row {
      display: grid; grid-template-columns: 1fr auto auto auto 40px;
      align-items: center; gap: 16px;
      padding: 12px 0; border-bottom: 1px solid #f8fafc;
    }
    .order-row:last-child { border-bottom: none; }
    .order-num { display: flex; flex-direction: column; gap: 2px; }
    .order-hash { font-size: 0.82rem; font-weight: 700; color: #1e293b; font-family: monospace; }
    .order-items { font-size: 0.7rem; color: #94a3b8; }
    .order-date { font-size: 0.78rem; color: #64748b; }
    .order-amount { font-size: 0.88rem; font-weight: 700; color: #0f172a; }
    .fcfa { font-size: 0.68rem; font-weight: 500; color: #94a3b8; }
    .order-chip {
      font-size: 0.68rem; font-weight: 700;
      padding: 3px 9px; border-radius: 20px; white-space: nowrap;
    }
    .order-view { color: #94a3b8 !important; }
    .order-view:hover { color: #16a34a !important; }

    .chip-pending    { background: #fef3c7; color: #92400e; }
    .chip-processing { background: #dbeafe; color: #1e40af; }
    .chip-shipped    { background: #ede9fe; color: #5b21b6; }
    .chip-delivered  { background: #dcfce7; color: #14532d; }
    .chip-cancelled  { background: #fee2e2; color: #7f1d1d; }

    /* ── Empty states ─────────────────────────────── */
    .empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px; color: #cbd5e1; }
    .empty-state mat-icon { font-size: 36px; }
    .empty-state p { font-size: 0.82rem; }

    /* ── Responsive ───────────────────────────────── */
    @media (max-width: 1100px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
      .charts-row { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .kpi-grid { grid-template-columns: 1fr 1fr; }
      .welcome { flex-direction: column; align-items: flex-start; }
      .welcome-right { width: 100%; }
      .order-row { grid-template-columns: 1fr auto auto; }
      .order-date, .order-view { display: none; }
    }
    @media (max-width: 420px) {
      .kpi-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class VendorAnalyticsComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private authService = inject(AuthService);

  isLoading = true;
  selectedPeriod = 'month';

  firstName = '';
  readonly currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  analytics = signal({
    totalRevenue: 0, revenueGrowth: 0,
    totalOrders: 0,  ordersGrowth: 0,
    totalProducts: 0, lowStockProducts: 0,
    averageRating: 0, totalReviews: 0
  });

  monthlyData: MonthBar[] = [];
  topProducts: TopProduct[] = [];
  recentOrders: any[] = [];

  ngOnInit() {
    this.firstName = this.authService.currentUser()?.firstName || 'Vendeur';
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.isLoading = true;
    const vendorId = this.authService.currentUser()?.vendorId || 1;

    this.productService.getProducts({ vendorId }).subscribe({
      next: (products) => {
        const totalProducts     = products.length;
        const lowStockProducts  = products.filter(p => p.stock > 0 && p.stock <= 10).length;
        const totalReviews      = products.reduce((s, p) => s + p.reviewCount, 0);
        const averageRating     = products.length
          ? products.reduce((s, p) => s + p.rating, 0) / products.length
          : 0;

        this.orderService.getOrders().subscribe({
          next: (orders) => {
            const vendorOrders = orders.filter(o =>
              o.items.some((item: any) => item.vendorId === vendorId)
            );

            // ── Period-based KPIs ──
            const now = new Date();
            const { currentStart, previousStart, previousEnd } = this.getPeriodBounds(now);

            const currentOrders  = vendorOrders.filter(o => new Date(o.createdAt) >= currentStart && new Date(o.createdAt) <= now);
            const previousOrders = vendorOrders.filter(o => new Date(o.createdAt) >= previousStart && new Date(o.createdAt) < previousEnd);

            const totalRevenue = currentOrders.reduce((s, o) => s + o.total, 0);
            const prevRevenue  = previousOrders.reduce((s, o) => s + o.total, 0);
            const totalOrders  = currentOrders.length;
            const prevOrders   = previousOrders.length;

            const revenueGrowth = prevRevenue > 0 ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : (totalRevenue > 0 ? 100 : 0);
            const ordersGrowth  = prevOrders  > 0 ? Math.round(((totalOrders  - prevOrders)  / prevOrders)  * 100) : (totalOrders  > 0 ? 100 : 0);

            this.analytics.set({ totalRevenue, revenueGrowth, totalOrders, ordersGrowth, totalProducts, lowStockProducts, averageRating, totalReviews });

            // ── Monthly bar chart (last 6 months) ──
            const getKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
            const monthMap = new Map<string, { revenue: number; orders: number }>();
            for (let i = 5; i >= 0; i--) {
              const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
              monthMap.set(getKey(d), { revenue: 0, orders: 0 });
            }
            vendorOrders.forEach(o => {
              const key = getKey(new Date(o.createdAt));
              if (monthMap.has(key)) {
                const e = monthMap.get(key)!;
                e.revenue += o.total; e.orders++;
              }
            });
            const bars: MonthBar[] = [];
            for (let i = 5; i >= 0; i--) {
              const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
              const key = getKey(d);
              const data = monthMap.get(key) || { revenue: 0, orders: 0 };
              bars.push({
                month: d.toLocaleDateString('fr-FR', { month: 'short' }),
                isCurrent: i === 0,
                height: 0,
                ...data
              });
            }
            const maxRev = Math.max(...bars.map(b => b.revenue), 1);
            this.monthlyData = bars.map(b => ({ ...b, height: Math.round((b.revenue / maxRev) * 100) }));

            // ── Top products by actual sold quantity ──
            const salesMap = new Map<number, number>();
            vendorOrders.forEach(o => o.items.forEach((item: any) => {
              salesMap.set(item.productId, (salesMap.get(item.productId) || 0) + item.quantity);
            }));
            const withSales = products.map(p => ({ ...p, soldCount: salesMap.get(p.id) || 0 }))
              .sort((a, b) => b.soldCount - a.soldCount).slice(0, 5);
            const maxSold = Math.max(...withSales.map(p => p.soldCount), 1);
            this.topProducts = withSales.map(p => ({
              id: p.id, name: p.name, images: p.images, price: p.price,
              soldCount: p.soldCount, salesPct: Math.round((p.soldCount / maxSold) * 100)
            }));

            // ── Recent orders ──
            this.recentOrders = vendorOrders
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 6);

            this.isLoading = false;
          },
          error: () => { this.isLoading = false; }
        });
      },
      error: () => { this.isLoading = false; }
    });
  }

  getPeriodBounds(now: Date): { currentStart: Date; previousStart: Date; previousEnd: Date } {
    const currentStart  = new Date(now);
    const previousStart = new Date(now);
    const previousEnd   = new Date(now);

    if (this.selectedPeriod === 'week') {
      currentStart.setDate(now.getDate() - 7);
      previousStart.setDate(now.getDate() - 14);
      previousEnd.setDate(now.getDate() - 7);
    } else if (this.selectedPeriod === 'month') {
      currentStart.setDate(1);    currentStart.setHours(0, 0, 0, 0);
      previousEnd.setDate(1);     previousEnd.setHours(0, 0, 0, 0);
      previousStart.setMonth(now.getMonth() - 1); previousStart.setDate(1); previousStart.setHours(0, 0, 0, 0);
    } else {
      currentStart.setMonth(0);   currentStart.setDate(1);  currentStart.setHours(0, 0, 0, 0);
      previousEnd.setMonth(0);    previousEnd.setDate(1);   previousEnd.setHours(0, 0, 0, 0);
      previousStart.setFullYear(now.getFullYear() - 1); previousStart.setMonth(0); previousStart.setDate(1); previousStart.setHours(0, 0, 0, 0);
    }
    return { currentStart, previousStart, previousEnd };
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending:    'order-chip chip-pending',
      processing: 'order-chip chip-processing',
      shipped:    'order-chip chip-shipped',
      delivered:  'order-chip chip-delivered',
      cancelled:  'order-chip chip-cancelled',
    };
    return map[status] || 'order-chip chip-pending';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'En attente', processing: 'En traitement',
      shipped: 'Expédiée',  delivered: 'Livrée', cancelled: 'Annulée'
    };
    return map[status] || status;
  }
}
