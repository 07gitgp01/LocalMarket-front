import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RegionService, Region } from '@core/services/region.service';

@Component({
    selector: 'app-regions',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="regions-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Explorez le Burkina Faso</h1>
          <p class="hero-subtitle">Découvrez les 13 régions et leurs produits locaux</p>
        </div>
      </section>

      <!-- Map Section -->
      <section class="map-section">
        <div class="container">
          <div class="map-container">
            <div class="map-placeholder">
              <mat-icon>map</mat-icon>
              <h3>Carte Interactive du Burkina Faso</h3>
              <p>Cliquez sur une région pour explorer ses vendeurs et produits</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="loading-state">
        <mat-progress-spinner mode="indeterminate" diameter="50"></mat-progress-spinner>
        <p>Chargement des régions...</p>
      </div>

      <!-- Regions Grid -->
      <section *ngIf="!isLoading()" class="regions-section">
        <div class="container">
          <div class="section-header">
            <h2>Toutes les Régions</h2>
            <p>{{ regions().length }} régions disponibles</p>
          </div>

          <div class="regions-grid">
            <mat-card *ngFor="let region of regions()" class="region-card">
              <div class="region-header">
                <div class="region-icon">
                  <mat-icon>place</mat-icon>
                </div>
                <mat-chip [class]="region.isActive ? 'active-chip' : 'inactive-chip'">
                  {{ region.isActive ? 'Active' : 'Inactive' }}
                </mat-chip>
              </div>

              <h3 class="region-name">{{ region.name }}</h3>
              <p class="region-capital">
                <mat-icon>location_city</mat-icon>
                Chef-lieu: {{ region.capital }}
              </p>

              <div class="region-stats">
                <div class="stat-item">
                  <div class="stat-icon blue">
                    <mat-icon>store</mat-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ region.vendorCount || 0 }}</div>
                    <div class="stat-label">Vendeurs</div>
                  </div>
                </div>

                <div class="stat-item">
                  <div class="stat-icon green">
                    <mat-icon>inventory_2</mat-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ region.productCount || 0 }}</div>
                    <div class="stat-label">Produits</div>
                  </div>
                </div>
              </div>

              <div class="region-delivery" *ngIf="region.deliveryFee">
                <mat-icon>local_shipping</mat-icon>
                <span>Livraison: {{ region.deliveryFee }} FCFA</span>
              </div>

              <button mat-flat-button color="primary" class="explore-btn">
                <mat-icon>explore</mat-icon>
                Explorer la région
              </button>
            </mat-card>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-card-icon purple">
                <mat-icon>map</mat-icon>
              </div>
              <div class="stat-card-content">
                <h3>{{ stats().totalRegions }}</h3>
                <p>Régions</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-card-icon blue">
                <mat-icon>store</mat-icon>
              </div>
              <div class="stat-card-content">
                <h3>{{ stats().totalVendors }}</h3>
                <p>Vendeurs Actifs</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-card-icon green">
                <mat-icon>inventory_2</mat-icon>
              </div>
              <div class="stat-card-content">
                <h3>{{ stats().totalProducts }}</h3>
                <p>Produits Disponibles</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-card-icon orange">
                <mat-icon>local_shipping</mat-icon>
              </div>
              <div class="stat-card-content">
                <h3>{{ stats().activeRegions }}</h3>
                <p>Zones de Livraison</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    `,
    styles: [`
    .regions-page {
      min-height: 100vh;
      background: #f8f9fa;
    }

    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 4rem 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="2" fill="white" opacity="0.1"/></svg>');
      opacity: 0.3;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      color: white;
      margin: 0 0 1rem 0;
      letter-spacing: -0.02em;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
    }

    /* Map Section */
    .map-section {
      padding: 3rem 0;
      background: white;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .map-container {
      border-radius: 24px;
      overflow: hidden;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    }

    .map-placeholder {
      height: 500px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }

    .map-placeholder mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #10b981;
      margin-bottom: 1.5rem;
    }

    .map-placeholder h3 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .map-placeholder p {
      font-size: 1rem;
      color: #6b7280;
      margin: 0;
    }

    /* Regions Section */
    .regions-section {
      padding: 4rem 0;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-header h2 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .section-header p {
      font-size: 1.125rem;
      color: #6b7280;
      margin: 0;
    }

    .regions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }

    .region-card {
      border-radius: 20px;
      padding: 2rem;
      transition: all 0.3s ease;
      cursor: pointer;
      border: 2px solid transparent;
      background: white;
    }

    .region-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
      border-color: #10b981;
    }

    .region-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .region-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
    }

    .region-icon mat-icon {
      color: white;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .active-chip {
      background: #d1fae5 !important;
      color: #065f46 !important;
      font-weight: 600 !important;
    }

    .inactive-chip {
      background: #f3f4f6 !important;
      color: #6b7280 !important;
    }

    .region-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.75rem 0;
    }

    .region-capital {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 1.5rem 0;
    }

    .region-capital mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .region-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-item {
      display: flex;
      gap: 0.75rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 12px;
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .stat-icon.blue {
      background: #dbeafe;
      color: #3b82f6;
    }

    .stat-icon.green {
      background: #d1fae5;
      color: #10b981;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .region-delivery {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: #fef3c7;
      border-radius: 10px;
      margin-bottom: 1.5rem;
      color: #92400e;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .region-delivery mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .explore-btn {
      width: 100%;
      height: 48px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.9375rem;
    }

    /* Stats Section */
    .stats-section {
      padding: 4rem 0;
      background: white;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
      background: white;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    }

    .stat-card-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-card-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .stat-card-icon.purple {
      background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
    }

    .stat-card-icon.blue {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .stat-card-icon.green {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .stat-card-icon.orange {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    }

    .stat-card-content h3 {
      font-size: 2rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .stat-card-content p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
      font-weight: 500;
    }

    /* Loading State */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .loading-state p {
      margin-top: 1rem;
      color: #6b7280;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .regions-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .map-placeholder {
        height: 300px;
      }
    }
    `]
})
export class RegionsComponent implements OnInit {
    private regionService = inject(RegionService);

    regions = signal<any[]>([]);
    isLoading = signal(true);
    stats = signal({
        totalRegions: 0,
        activeRegions: 0,
        totalVendors: 0,
        totalProducts: 0
    });

    ngOnInit() {
        this.loadRegions();
    }

    loadRegions() {
        this.isLoading.set(true);
        this.regionService.getRegions().subscribe({
            next: (regions) => {
                // Enrichir avec des stats mockées
                const enrichedRegions = regions.map(r => ({
                    ...r,
                    vendorCount: Math.floor(Math.random() * 50) + 10,
                    productCount: Math.floor(Math.random() * 200) + 50,
                    deliveryFee: Math.floor(Math.random() * 2000) + 1000
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
        const activeRegions = regions.filter(r => r.isActive).length;

        this.stats.set({
            totalRegions: regions.length,
            activeRegions,
            totalVendors,
            totalProducts
        });
    }
}
