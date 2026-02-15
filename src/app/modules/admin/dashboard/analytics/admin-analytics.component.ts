import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { OrderService } from '@core/services/order.service';
import { ProductService } from '@core/services/product.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    LoadingSpinnerComponent
  ],
  template: `
    <app-loading-spinner *ngIf="isLoading" [fullscreen]="false" message="Chargement des statistiques..."></app-loading-spinner>

    <div *ngIf="!isLoading" class="analytics-container">
      <div class="page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble de la plateforme LocalMarket.bf</p>
        </div>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="period-select">
            <mat-select [(value)]="selectedPeriod" (selectionChange)="loadAnalytics()">
              <mat-option value="week">Cette semaine</mat-option>
              <mat-option value="month">Ce mois</mat-option>
              <mat-option value="year">Cette année</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-stroked-button (click)="exportData()">
            <mat-icon>file_download</mat-icon>
            Exporter
          </button>
          <button mat-flat-button color="primary" (click)="loadAnalytics()">
            <mat-icon>refresh</mat-icon>
            Actualiser
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card blue">
          <div class="kpi-content">
            <div class="kpi-info">
              <span class="kpi-label">Utilisateurs Total</span>
              <h2 class="kpi-value">{{ stats().totalUsers | number }}</h2>
              <div class="kpi-change positive">
                <mat-icon>trending_up</mat-icon>
                <span>{{ stats().usersGrowth }}% ce mois</span>
              </div>
            </div>
            <div class="kpi-icon blue">
              <mat-icon>people</mat-icon>
            </div>
          </div>
          <div class="kpi-chart">
            <div class="mini-chart">
              <div class="bar" style="height: 40%"></div>
              <div class="bar" style="height: 60%"></div>
              <div class="bar" style="height: 45%"></div>
              <div class="bar" style="height: 75%"></div>
              <div class="bar" style="height: 90%"></div>
              <div class="bar" style="height: 100%"></div>
            </div>
          </div>
        </div>

        <div class="kpi-card green">
          <div class="kpi-content">
            <div class="kpi-info">
              <span class="kpi-label">Revenu Total</span>
              <h2 class="kpi-value">{{ stats().totalRevenue | number:'1.0-0' }} FCFA</h2>
              <div class="kpi-change positive">
                <mat-icon>trending_up</mat-icon>
                <span>{{ stats().revenueGrowth }}% ce mois</span>
              </div>
            </div>
            <div class="kpi-icon green">
              <mat-icon>payments</mat-icon>
            </div>
          </div>
          <div class="kpi-chart">
            <div class="mini-chart">
              <div class="bar" style="height: 50%"></div>
              <div class="bar" style="height: 70%"></div>
              <div class="bar" style="height: 60%"></div>
              <div class="bar" style="height: 85%"></div>
              <div class="bar" style="height: 95%"></div>
              <div class="bar" style="height: 100%"></div>
            </div>
          </div>
        </div>

        <div class="kpi-card purple">
          <div class="kpi-content">
            <div class="kpi-info">
              <span class="kpi-label">Vendeurs Actifs</span>
              <h2 class="kpi-value">{{ stats().totalVendors }}</h2>
              <div class="kpi-change positive">
                <mat-icon>trending_up</mat-icon>
                <span>+{{ stats().newVendors }} nouveaux</span>
              </div>
            </div>
            <div class="kpi-icon purple">
              <mat-icon>store</mat-icon>
            </div>
          </div>
          <div class="kpi-chart">
            <div class="mini-chart">
              <div class="bar" style="height: 60%"></div>
              <div class="bar" style="height: 65%"></div>
              <div class="bar" style="height: 70%"></div>
              <div class="bar" style="height: 75%"></div>
              <div class="bar" style="height: 85%"></div>
              <div class="bar" style="height: 100%"></div>
            </div>
          </div>
        </div>

        <div class="kpi-card orange">
          <div class="kpi-content">
            <div class="kpi-info">
              <span class="kpi-label">Commandes</span>
              <h2 class="kpi-value">{{ stats().totalOrders }}</h2>
              <div class="kpi-change warning">
                <mat-icon>schedule</mat-icon>
                <span>{{ stats().pendingOrders }} en attente</span>
              </div>
            </div>
            <div class="kpi-icon orange">
              <mat-icon>shopping_bag</mat-icon>
            </div>
          </div>
          <div class="kpi-chart">
            <div class="mini-chart">
              <div class="bar" style="height: 70%"></div>
              <div class="bar" style="height: 80%"></div>
              <div class="bar" style="height: 65%"></div>
              <div class="bar" style="height: 90%"></div>
              <div class="bar" style="height: 85%"></div>
              <div class="bar" style="height: 100%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <!-- Sales Chart -->
        <mat-card class="chart-card large">
          <div class="card-header">
            <div>
              <h3>Ventes par région</h3>
              <p>Répartition géographique des transactions</p>
            </div>
            <button mat-icon-button>
              <mat-icon>more_vert</mat-icon>
            </button>
          </div>
          <div class="map-placeholder">
            <mat-icon class="map-icon">map</mat-icon>
            <p>Carte interactive du Burkina Faso</p>
            <div class="region-stats">
              <div class="region-item">
                <span class="region-dot" style="background: #3b82f6"></span>
                <span>Centre: 45%</span>
              </div>
              <div class="region-item">
                <span class="region-dot" style="background: #10b981"></span>
                <span>Hauts-Bassins: 28%</span>
              </div>
              <div class="region-item">
                <span class="region-dot" style="background: #f59e0b"></span>
                <span>Nord: 15%</span>
              </div>
              <div class="region-item">
                <span class="region-dot" style="background: #8b5cf6"></span>
                <span>Autres: 12%</span>
              </div>
            </div>
          </div>
        </mat-card>

        <!-- Recent Vendors -->
        <mat-card class="chart-card">
          <div class="card-header">
            <div>
              <h3>Nouveaux vendeurs</h3>
              <p>{{ recentVendors.length }} en attente de validation</p>
            </div>
            <a routerLink="../users" class="view-all">Voir tous</a>
          </div>
          <div class="vendor-list">
            <div *ngFor="let vendor of recentVendors" class="vendor-item">
              <div class="vendor-avatar">
                <mat-icon>store</mat-icon>
              </div>
              <div class="vendor-info">
                <h4>{{ vendor.firstName }} {{ vendor.lastName }}</h4>
                <p>{{ vendor.email }}</p>
                <span class="vendor-date">{{ vendor.createdAt | date:'short' }}</span>
              </div>
              <div class="vendor-actions">
                <button mat-icon-button color="primary" (click)="approveVendor(vendor)" matTooltip="Approuver">
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="rejectVendor(vendor)" matTooltip="Rejeter">
                  <mat-icon>cancel</mat-icon>
                </button>
              </div>
            </div>

            <div *ngIf="recentVendors.length === 0" class="empty-state">
              <mat-icon>check_circle</mat-icon>
              <p>Aucun vendeur en attente</p>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Recent Activity -->
      <mat-card class="activity-card">
        <div class="card-header">
          <h3>Activité récente</h3>
          <button mat-stroked-button>
            <mat-icon>filter_list</mat-icon>
            Filtrer
          </button>
        </div>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon blue">
              <mat-icon>person_add</mat-icon>
            </div>
            <div class="activity-content">
              <h4>Nouvel utilisateur inscrit</h4>
              <p>Moussa Kaboré a créé un compte client</p>
            </div>
            <span class="activity-time">Il y a 5 min</span>
          </div>

          <div class="activity-item">
            <div class="activity-icon green">
              <mat-icon>shopping_cart</mat-icon>
            </div>
            <div class="activity-content">
              <h4>Nouvelle commande</h4>
              <p>Commande #1234 - 15,000 FCFA</p>
            </div>
            <span class="activity-time">Il y a 12 min</span>
          </div>

          <div class="activity-item">
            <div class="activity-icon purple">
              <mat-icon>store</mat-icon>
            </div>
            <div class="activity-content">
              <h4>Vendeur approuvé</h4>
              <p>Bio Farm Koudougou a été validé</p>
            </div>
            <span class="activity-time">Il y a 1h</span>
          </div>

          <div class="activity-item">
            <div class="activity-icon orange">
              <mat-icon>inventory</mat-icon>
            </div>
            <div class="activity-content">
              <h4>Nouveau produit</h4>
              <p>Mil Local ajouté par Céréales du Faso</p>
            </div>
            <span class="activity-time">Il y a 2h</span>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .analytics-container {
      padding: 0;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .page-header p {
      color: #6b7280;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    /* KPI Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .kpi-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border-left: 4px solid;
      transition: all 0.3s ease;
    }

    .kpi-card:hover {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      transform: translateY(-4px);
    }

    .kpi-card.blue { border-left-color: #3b82f6; }
    .kpi-card.green { border-left-color: #10b981; }
    .kpi-card.purple { border-left-color: #8b5cf6; }
    .kpi-card.orange { border-left-color: #f59e0b; }

    .kpi-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .kpi-label {
      font-size: 0.85rem;
      color: #6b7280;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .kpi-value {
      font-size: 2rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0.5rem 0;
    }

    .kpi-change {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .kpi-change.positive {
      color: #10b981;
    }

    .kpi-change.warning {
      color: #f59e0b;
    }

    .kpi-change mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .kpi-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .kpi-icon.blue {
      background: #dbeafe;
      color: #3b82f6;
    }

    .kpi-icon.green {
      background: #d1fae5;
      color: #10b981;
    }

    .kpi-icon.purple {
      background: #ede9fe;
      color: #8b5cf6;
    }

    .kpi-icon.orange {
      background: #fed7aa;
      color: #f59e0b;
    }

    .kpi-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .kpi-chart {
      margin-top: 1rem;
    }

    .mini-chart {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      height: 40px;
    }

    .mini-chart .bar {
      flex: 1;
      background: linear-gradient(to top, #10b981, #34d399);
      border-radius: 2px;
      opacity: 0.6;
      transition: opacity 0.3s ease;
    }

    .kpi-card:hover .mini-chart .bar {
      opacity: 1;
    }

    /* Charts Grid */
    .charts-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 1024px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }

    .chart-card {
      padding: 0 !important;
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .card-header h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .card-header p {
      font-size: 0.85rem;
      color: #6b7280;
      margin: 0;
    }

    .view-all {
      color: #10b981;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    /* Map Placeholder */
    .map-placeholder {
      padding: 3rem;
      text-align: center;
      background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
      min-height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .map-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #10b981;
      margin-bottom: 1rem;
    }

    .map-placeholder p {
      color: #6b7280;
      font-weight: 600;
      margin-bottom: 2rem;
    }

    .region-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      max-width: 400px;
    }

    .region-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #374151;
      font-weight: 500;
    }

    .region-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    /* Vendor List */
    .vendor-list {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .vendor-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .vendor-item:hover {
      background: #f3f4f6;
    }

    .vendor-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10b981, #059669);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .vendor-avatar mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .vendor-info {
      flex: 1;
    }

    .vendor-info h4 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .vendor-info p {
      font-size: 0.85rem;
      color: #6b7280;
      margin: 0 0 0.25rem 0;
    }

    .vendor-date {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .vendor-actions {
      display: flex;
      gap: 0.5rem;
    }

    /* Activity Card */
    .activity-card {
      padding: 0 !important;
    }

    .activity-list {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 12px;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .activity-icon.blue {
      background: #dbeafe;
      color: #3b82f6;
    }

    .activity-icon.green {
      background: #d1fae5;
      color: #10b981;
    }

    .activity-icon.purple {
      background: #ede9fe;
      color: #8b5cf6;
    }

    .activity-icon.orange {
      background: #fed7aa;
      color: #f59e0b;
    }

    .activity-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .activity-content {
      flex: 1;
    }

    .activity-content h4 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .activity-content p {
      font-size: 0.85rem;
      color: #6b7280;
      margin: 0;
    }

    .activity-time {
      font-size: 0.8rem;
      color: #9ca3af;
      white-space: nowrap;
    }

    .period-select {
      width: 180px;
    }

    .period-select ::ng-deep .mat-mdc-form-field-wrapper {
      padding-bottom: 0;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #9ca3af;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
    }

    .empty-state p {
      margin: 0;
      font-size: 0.95rem;
    }
  `]
})
export class AdminAnalyticsComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  
  isLoading = true;
  selectedPeriod = 'month';
  
  stats = signal({
    totalUsers: 0,
    usersGrowth: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    totalVendors: 0,
    newVendors: 0,
    totalOrders: 0,
    pendingOrders: 0
  });
  
  recentVendors: any[] = [];

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.isLoading = true;
    
    // Load data in parallel
    Promise.all([
      this.orderService.getOrders().toPromise(),
      this.productService.getProducts({}).toPromise()
    ]).then(([orders, products]) => {
      // Calculate stats
      const totalOrders = orders?.length || 0;
      const pendingOrders = orders?.filter((o: any) => o.status === 'pending').length || 0;
      const totalRevenue = orders?.reduce((sum: number, o: any) => sum + o.total, 0) || 0;
      
      // Mock user data for now
      const totalUsers = 150;
      const totalVendors = 25;
      this.recentVendors = [];
      
      this.stats.set({
        totalUsers,
        usersGrowth: 12,
        totalRevenue,
        revenueGrowth: 8,
        totalVendors,
        newVendors: 5,
        totalOrders,
        pendingOrders
      });
      
      this.isLoading = false;
    }).catch(() => {
      this.isLoading = false;
    });
  }

  approveVendor(vendor: any) {
    if (confirm(`Approuver le vendeur ${vendor.firstName} ${vendor.lastName} ?`)) {
      // TODO: Implement vendor approval
      console.log('Approve vendor:', vendor);
      this.loadAnalytics();
    }
  }

  rejectVendor(vendor: any) {
    if (confirm(`Rejeter le vendeur ${vendor.firstName} ${vendor.lastName} ?`)) {
      // TODO: Implement vendor rejection
      console.log('Reject vendor:', vendor);
      this.loadAnalytics();
    }
  }

  exportData() {
    console.log('Export data');
    // TODO: Implement data export
  }
}
