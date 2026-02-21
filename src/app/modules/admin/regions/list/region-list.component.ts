import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { RegionService, Region } from '@core/services/region.service';

@Component({
  selector: 'app-region-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <div class="region-list-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>Gestion des Régions</h1>
          <p class="text-gray-600">Gérez les 13 régions du Burkina Faso</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/admin/regions/new">
          <mat-icon>add</mat-icon>
          Ajouter une région
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <div class="stat-icon blue">
            <mat-icon>map</mat-icon>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Régions</p>
            <h3 class="stat-value">{{ stats().total }}</h3>
            <p class="stat-change">{{ stats().active }} actives</p>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon green">
            <mat-icon>store</mat-icon>
          </div>
          <div class="stat-content">
            <p class="stat-label">Vendeurs Totaux</p>
            <h3 class="stat-value">{{ stats().totalVendors }}</h3>
            <p class="stat-change">Toutes régions</p>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon purple">
            <mat-icon>inventory_2</mat-icon>
          </div>
          <div class="stat-content">
            <p class="stat-label">Produits Totaux</p>
            <h3 class="stat-value">{{ stats().totalProducts }}</h3>
            <p class="stat-change">Disponibles</p>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon orange">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div class="stat-content">
            <p class="stat-label">Région la Plus Active</p>
            <h3 class="stat-value">{{ stats().topRegion }}</h3>
            <p class="stat-change">{{ stats().topRegionVendors }} vendeurs</p>
          </div>
        </mat-card>
      </div>

      <!-- Map Placeholder -->
      <mat-card class="map-card">
        <h3>Carte du Burkina Faso</h3>
        <div class="map-container">
          <div class="map-placeholder">
            <mat-icon>map</mat-icon>
            <p>Carte interactive des régions</p>
            <small>Cliquez sur une région pour voir les détails</small>
          </div>
        </div>
      </mat-card>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="loading-state">
        <mat-progress-spinner mode="indeterminate" diameter="50"></mat-progress-spinner>
      </div>

      <!-- Regions Grid -->
      <div *ngIf="!isLoading()" class="regions-grid">
        <mat-card *ngFor="let region of regions()" class="region-card">
          <div class="region-header">
            <div class="region-title">
              <h3>{{ region.name }}</h3>
              <mat-chip [class]="region.isActive ? 'status-active' : 'status-inactive'">
                {{ region.isActive ? 'Active' : 'Inactive' }}
              </mat-chip>
            </div>
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item [routerLink]="['/admin/regions', region.id]">
                <mat-icon>visibility</mat-icon>
                <span>Voir détails</span>
              </button>
              <button mat-menu-item [routerLink]="['/admin/regions', region.id, 'edit']">
                <mat-icon>edit</mat-icon>
                <span>Modifier</span>
              </button>
              <button mat-menu-item (click)="toggleRegionStatus(region)">
                <mat-icon>{{ region.isActive ? 'block' : 'check_circle' }}</mat-icon>
                <span>{{ region.isActive ? 'Désactiver' : 'Activer' }}</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="deleteRegion(region)" class="text-red-600">
                <mat-icon>delete</mat-icon>
                <span>Supprimer</span>
              </button>
            </mat-menu>
          </div>

          <div class="region-info">
            <div class="info-item">
              <mat-icon>location_city</mat-icon>
              <span>Chef-lieu: <strong>{{ region.capital }}</strong></span>
            </div>
            <div class="info-item">
              <mat-icon>code</mat-icon>
              <span>Code: <strong>{{ region.code }}</strong></span>
            </div>
          </div>

          <div class="region-stats">
            <div class="stat-item">
              <div class="stat-number">{{ region.vendorCount || 0 }}</div>
              <div class="stat-label">Vendeurs</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ region.productCount || 0 }}</div>
              <div class="stat-label">Produits</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ region.orderCount || 0 }}</div>
              <div class="stat-label">Commandes</div>
            </div>
          </div>

          <div class="region-revenue">
            <mat-icon>attach_money</mat-icon>
            <span>{{ region.revenue || 0 | number:'1.0-0' }} FCFA</span>
          </div>

          <div class="region-actions">
            <button mat-button color="primary" [routerLink]="['/admin/regions', region.id]">
              Voir détails
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>
        </mat-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && regions().length === 0" class="empty-state">
        <mat-icon>map</mat-icon>
        <h3>Aucune région trouvée</h3>
        <p>Commencez par ajouter les régions du Burkina Faso</p>
        <button mat-raised-button color="primary" routerLink="/admin/regions/new">
          <mat-icon>add</mat-icon>
          Ajouter une région
        </button>
      </div>
    </div>
  `,
  styles: [`
    .region-list-page {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: #1f2937;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      display: flex;
      gap: 1rem;
      padding: 1.5rem !important;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-icon.blue { background: #dbeafe; color: #3b82f6; }
    .stat-icon.green { background: #d1fae5; color: #10b981; }
    .stat-icon.purple { background: #e9d5ff; color: #a855f7; }
    .stat-icon.orange { background: #fed7aa; color: #f97316; }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 0.5rem 0;
    }

    .stat-value {
      font-size: 1.875rem;
      font-weight: 700;
      margin: 0 0 0.25rem 0;
      color: #1f2937;
    }

    .stat-change {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    /* Map Card */
    .map-card {
      margin-bottom: 2rem;
      padding: 1.5rem !important;
    }

    .map-card h3 {
      margin: 0 0 1rem 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .map-container {
      background: #f9fafb;
      border-radius: 8px;
      overflow: hidden;
    }

    .map-placeholder {
      height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
    }

    .map-placeholder mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 1rem;
    }

    /* Regions Grid */
    .regions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .region-card {
      padding: 1.5rem !important;
      transition: all 0.3s ease;
    }

    .region-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .region-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .region-title {
      flex: 1;
    }

    .region-title h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .region-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .info-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .region-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .region-revenue {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #f0fdf4;
      border-radius: 8px;
      margin-bottom: 1rem;
      color: #065f46;
      font-weight: 600;
    }

    .region-revenue mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .region-actions {
      display: flex;
      justify-content: flex-end;
    }

    mat-chip.status-active {
      background: #d1fae5 !important;
      color: #065f46 !important;
      font-size: 0.75rem !important;
      height: 24px !important;
    }

    mat-chip.status-inactive {
      background: #f3f4f6 !important;
      color: #4b5563 !important;
      font-size: 0.75rem !important;
      height: 24px !important;
    }

    /* Loading & Empty */
    .loading-state,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #d1d5db;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      color: #6b7280;
      margin: 0 0 1.5rem 0;
    }
  `]
})
export class RegionListComponent implements OnInit {
  private regionService = inject(RegionService);

  regions = signal<any[]>([]);
  isLoading = signal(true);

  stats = signal({
    total: 0,
    active: 0,
    totalVendors: 0,
    totalProducts: 0,
    topRegion: '-',
    topRegionVendors: 0
  });

  ngOnInit() {
    this.loadRegions();
  }

  loadRegions() {
    this.isLoading.set(true);
    this.regionService.getRegions().subscribe({
      next: (regions) => {
        // Enrichir avec des stats mockées pour l'instant
        const enrichedRegions = regions.map(r => ({
          ...r,
          vendorCount: Math.floor(Math.random() * 50),
          productCount: Math.floor(Math.random() * 200),
          orderCount: Math.floor(Math.random() * 100),
          revenue: Math.floor(Math.random() * 5000000)
        }));

        this.regions.set(enrichedRegions);
        this.calculateStats(enrichedRegions);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  calculateStats(regions: any[]) {
    const totalVendors = regions.reduce((sum, r) => sum + (r.vendorCount || 0), 0);
    const totalProducts = regions.reduce((sum, r) => sum + (r.productCount || 0), 0);
    const topRegion = regions.sort((a, b) => (b.vendorCount || 0) - (a.vendorCount || 0))[0];

    this.stats.set({
      total: regions.length,
      active: regions.filter(r => r.isActive).length,
      totalVendors,
      totalProducts,
      topRegion: topRegion?.name || '-',
      topRegionVendors: topRegion?.vendorCount || 0
    });
  }

  toggleRegionStatus(region: any) {
    this.regionService.toggleRegionStatus(region.id, !region.isActive).subscribe(() => {
      this.loadRegions();
    });
  }

  deleteRegion(region: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la région ${region.name} ?`)) {
      this.regionService.deleteRegion(region.id).subscribe(() => {
        this.loadRegions();
      });
    }
  }
}
