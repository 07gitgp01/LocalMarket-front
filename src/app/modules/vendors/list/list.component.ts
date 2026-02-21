import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { VendorService } from '@core/services/vendor.service';
import { Vendor } from '@shared/models/product.model';

@Component({
    selector: 'app-vendor-list',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="vendors-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Découvrez Nos Vendeurs</h1>
          <p class="hero-subtitle">Explorez les meilleurs vendeurs locaux du Burkina Faso</p>
          
          <!-- Search Bar -->
          <div class="search-bar">
            <mat-icon class="search-icon">search</mat-icon>
            <input 
              type="text" 
              placeholder="Rechercher un vendeur, une boutique..."
              [formControl]="searchControl"
              class="search-input">
          </div>
        </div>
      </section>

      <!-- Filters -->
      <section class="filters-section">
        <div class="container">
          <div class="filters">
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Région</mat-label>
              <mat-select [formControl]="regionControl">
                <mat-option value="">Toutes les régions</mat-option>
                <mat-option *ngFor="let region of regions" [value]="region">{{ region }}</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Catégorie</mat-label>
              <mat-select [formControl]="categoryControl">
                <mat-option value="">Toutes</mat-option>
                <mat-option value="Agriculture">Agriculture</mat-option>
                <mat-option value="Artisanat">Artisanat</mat-option>
                <mat-option value="Alimentation">Alimentation</mat-option>
                <mat-option value="Textile">Textile</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-stroked-button class="filter-btn" (click)="resetFilters()">
              <mat-icon>refresh</mat-icon>
              Réinitialiser
            </button>
          </div>

          <div class="results-info">
            <span class="results-count">{{ filteredVendors().length }} vendeurs trouvés</span>
          </div>
        </div>
      </section>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="loading-state">
        <mat-progress-spinner mode="indeterminate" diameter="50"></mat-progress-spinner>
        <p>Chargement des vendeurs...</p>
      </div>

      <!-- Vendors Grid -->
      <section *ngIf="!isLoading()" class="vendors-section">
        <div class="container">
          <div class="vendors-grid">
            <mat-card *ngFor="let vendor of filteredVendors()" class="vendor-card">
              <div class="vendor-banner">
                <img [src]="vendor.banner || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=300&fit=crop'" 
                     [alt]="vendor.shopName" class="banner-img">
                <div class="verified-badge" *ngIf="vendor.verified">
                  <mat-icon>verified</mat-icon>
                </div>
              </div>

              <div class="vendor-content">
                <div class="vendor-avatar">
                  <img [src]="vendor.logo || 'https://ui-avatars.com/api/?name=' + vendor.shopName" 
                       [alt]="vendor.shopName">
                </div>

                <h3 class="vendor-name">{{ vendor.shopName }}</h3>
                <p class="vendor-category">{{ vendor.category }}</p>

                <div class="vendor-rating">
                  <div class="stars">
                    <mat-icon *ngFor="let star of [1,2,3,4,5]" 
                              [class.filled]="star <= vendor.rating">
                      {{ star <= vendor.rating ? 'star' : 'star_border' }}
                    </mat-icon>
                  </div>
                  <span class="rating-text">{{ vendor.rating }} ({{ vendor.reviewCount }})</span>
                </div>

                <p class="vendor-description">{{ vendor.description | slice:0:100 }}...</p>

                <div class="vendor-info">
                  <div class="info-item">
                    <mat-icon>place</mat-icon>
                    <span>{{ vendor.location.city }}, {{ vendor.location.region }}</span>
                  </div>
                  <div class="info-item">
                    <mat-icon>inventory_2</mat-icon>
                    <span>{{ vendor.productCount }} produits</span>
                  </div>
                </div>

                <div class="vendor-actions">
                  <button mat-flat-button color="primary" class="visit-btn">
                    <mat-icon>store</mat-icon>
                    Visiter la boutique
                  </button>
                  <button mat-icon-button class="favorite-btn">
                    <mat-icon>favorite_border</mat-icon>
                  </button>
                </div>
              </div>
            </mat-card>
          </div>

          <!-- Empty State -->
          <div *ngIf="filteredVendors().length === 0" class="empty-state">
            <mat-icon>store_mall_directory</mat-icon>
            <h3>Aucun vendeur trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
            <button mat-raised-button color="primary" (click)="resetFilters()">
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      </section>
    </div>
    `,
    styles: [`
    .vendors-page {
      min-height: 100vh;
      background: #f8f9fa;
    }

    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      margin: 0 0 2rem 0;
    }

    .search-bar {
      display: flex;
      align-items: center;
      background: white;
      border-radius: 50px;
      padding: 0.75rem 1.5rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 600px;
      margin: 0 auto;
    }

    .search-icon {
      color: #9ca3af;
      margin-right: 1rem;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 1rem;
      color: #1f2937;
    }

    .search-input::placeholder {
      color: #9ca3af;
    }

    /* Filters Section */
    .filters-section {
      background: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 1.5rem 0;
      position: sticky;
      top: 0;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .filters {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
    }

    .filter-field {
      min-width: 200px;
    }

    .filter-btn {
      height: 56px;
    }

    .results-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .results-count {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    /* Vendors Section */
    .vendors-section {
      padding: 3rem 0;
    }

    .vendors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 2rem;
    }

    .vendor-card {
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
      border: 1px solid #e5e7eb;
    }

    .vendor-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    }

    .vendor-banner {
      position: relative;
      height: 140px;
      overflow: hidden;
    }

    .banner-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .vendor-card:hover .banner-img {
      transform: scale(1.1);
    }

    .verified-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: white;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .verified-badge mat-icon {
      color: #10b981;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .vendor-content {
      padding: 1.5rem;
      position: relative;
    }

    .vendor-avatar {
      width: 80px;
      height: 80px;
      border-radius: 16px;
      overflow: hidden;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin: -50px auto 1rem;
      background: white;
    }

    .vendor-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .vendor-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
      text-align: center;
    }

    .vendor-category {
      font-size: 0.875rem;
      color: #6b7280;
      text-align: center;
      margin: 0 0 1rem 0;
    }

    .vendor-rating {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .stars {
      display: flex;
      gap: 0.125rem;
    }

    .stars mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #d1d5db;
    }

    .stars mat-icon.filled {
      color: #fbbf24;
    }

    .rating-text {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .vendor-description {
      font-size: 0.875rem;
      color: #6b7280;
      line-height: 1.6;
      margin: 0 0 1rem 0;
      text-align: center;
    }

    .vendor-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 12px;
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
      color: #9ca3af;
    }

    .vendor-actions {
      display: flex;
      gap: 0.75rem;
    }

    .visit-btn {
      flex: 1;
      border-radius: 12px;
      height: 44px;
      font-weight: 600;
    }

    .favorite-btn {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }

    .favorite-btn:hover {
      background: #fef2f2;
      border-color: #fca5a5;
    }

    .favorite-btn:hover mat-icon {
      color: #ef4444;
    }

    /* Loading & Empty States */
    .loading-state,
    .empty-state {
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

    /* Responsive */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .vendors-grid {
        grid-template-columns: 1fr;
      }

      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-field {
        width: 100%;
      }
    }
    `]
})
export class VendorListComponent implements OnInit {
    private vendorService = inject(VendorService);

    vendors = signal<Vendor[]>([]);
    filteredVendors = signal<Vendor[]>([]);
    isLoading = signal(true);

    searchControl = new FormControl('');
    regionControl = new FormControl('');
    categoryControl = new FormControl('');

    regions = ['Centre', 'Hauts-Bassins', 'Cascades', 'Sahel', 'Est', 'Nord', 'Boucle du Mouhoun'];

    ngOnInit() {
        this.loadVendors();
        this.setupFilters();
    }

    loadVendors() {
        this.isLoading.set(true);
        this.vendorService.getVendors({ status: 'active' }).subscribe({
            next: (vendors) => {
                this.vendors.set(vendors);
                this.filteredVendors.set(vendors);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    setupFilters() {
        this.searchControl.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(() => this.applyFilters());

        this.regionControl.valueChanges.subscribe(() => this.applyFilters());
        this.categoryControl.valueChanges.subscribe(() => this.applyFilters());
    }

    applyFilters() {
        let filtered = [...this.vendors()];

        const search = this.searchControl.value?.toLowerCase();
        if (search) {
            filtered = filtered.filter(v =>
                v.shopName.toLowerCase().includes(search) ||
                v.description.toLowerCase().includes(search)
            );
        }

        const region = this.regionControl.value;
        if (region) {
            filtered = filtered.filter(v => v.location.region === region);
        }

        const category = this.categoryControl.value;
        if (category) {
            filtered = filtered.filter(v => v.category === category);
        }

        this.filteredVendors.set(filtered);
    }

    resetFilters() {
        this.searchControl.setValue('');
        this.regionControl.setValue('');
        this.categoryControl.setValue('');
    }
}
