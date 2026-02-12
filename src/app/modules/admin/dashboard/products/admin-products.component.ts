import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
   selector: 'app-admin-products',
   standalone: true,
   imports: [
      CommonModule,
      MatTabsModule,
      MatTableModule,
      MatButtonModule,
      MatIconModule,
      MatCardModule,
      MatChipsModule,
      MatMenuModule,
      MatInputModule,
      MatFormFieldModule,
      ReactiveFormsModule
   ],
   template: `
    <div class="products-container">
      <div class="page-header">
        <div>
          <h1>Gestion des produits</h1>
          <p>Modération et catalogue des produits</p>
        </div>
        <button mat-flat-button color="primary">
          <mat-icon>add</mat-icon>
          Ajouter un produit
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <mat-icon>inventory</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">1,245</span>
            <span class="stat-label">Produits actifs</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon orange">
            <mat-icon>pending</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">23</span>
            <span class="stat-label">En attente</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">
            <mat-icon>category</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">45</span>
            <span class="stat-label">Catégories</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon red">
            <mat-icon>report</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">7</span>
            <span class="stat-label">Signalements</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-container">
        <mat-tab-group class="products-tabs">
          
          <!-- Pending Products -->
          <mat-tab>
            <ng-template mat-tab-label>
              <span>À valider</span>
              <span class="tab-badge">23</span>
            </ng-template>
            
            <div class="tab-content">
              <div class="pending-products">
                <div class="product-card pending" *ngFor="let product of pendingProducts">
                  <div class="product-image">
                    <img [src]="product.image" [alt]="product.name">
                    <span class="product-status pending">En attente</span>
                  </div>
                  
                  <div class="product-info">
                    <div class="product-header">
                      <h3>{{ product.name }}</h3>
                      <span class="product-price">{{ product.price }} FCFA</span>
                    </div>
                    
                    <div class="product-meta">
                      <div class="meta-item">
                        <mat-icon>store</mat-icon>
                        <span>{{ product.vendor }}</span>
                      </div>
                      <div class="meta-item">
                        <mat-icon>category</mat-icon>
                        <span>{{ product.category }}</span>
                      </div>
                      <div class="meta-item">
                        <mat-icon>schedule</mat-icon>
                        <span>{{ product.submittedAt }}</span>
                      </div>
                    </div>
                    
                    <p class="product-description">{{ product.description }}</p>
                    
                    <div class="product-tags">
                      <mat-chip *ngFor="let tag of product.tags">{{ tag }}</mat-chip>
                    </div>
                  </div>
                  
                  <div class="product-actions">
                    <button mat-flat-button color="primary">
                      <mat-icon>check_circle</mat-icon>
                      Approuver
                    </button>
                    <button mat-stroked-button color="warn">
                      <mat-icon>cancel</mat-icon>
                      Rejeter
                    </button>
                    <button mat-icon-button [matMenuTriggerFor]="menu">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #menu="matMenu">
                      <button mat-menu-item>
                        <mat-icon>visibility</mat-icon>
                        <span>Voir les détails</span>
                      </button>
                      <button mat-menu-item>
                        <mat-icon>edit</mat-icon>
                        <span>Modifier</span>
                      </button>
                    </mat-menu>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- All Products -->
          <mat-tab>
            <ng-template mat-tab-label>
              <span>Catalogue global</span>
              <span class="tab-badge">1,245</span>
            </ng-template>
            
            <div class="tab-content">
              <div class="table-header">
                <div class="search-bar">
                  <mat-icon>search</mat-icon>
                  <input 
                    type="text" 
                    [formControl]="searchControl" 
                    placeholder="Rechercher un produit..."
                  >
                </div>
                <div class="filter-actions">
                  <button mat-stroked-button>
                    <mat-icon>filter_list</mat-icon>
                    Filtres
                  </button>
                  <button mat-stroked-button>
                    <mat-icon>file_download</mat-icon>
                    Exporter
                  </button>
                </div>
              </div>

              <div class="products-grid">
                <div class="product-card-small" *ngFor="let product of allProducts">
                  <img [src]="product.image" [alt]="product.name">
                  <div class="card-content">
                    <h4>{{ product.name }}</h4>
                    <p class="vendor">{{ product.vendor }}</p>
                    <div class="card-footer">
                      <span class="price">{{ product.price }} FCFA</span>
                      <button mat-icon-button [matMenuTriggerFor]="productMenu">
                        <mat-icon>more_vert</mat-icon>
                      </button>
                      <mat-menu #productMenu="matMenu">
                        <button mat-menu-item>
                          <mat-icon>edit</mat-icon>
                          <span>Modifier</span>
                        </button>
                        <button mat-menu-item>
                          <mat-icon>visibility_off</mat-icon>
                          <span>Masquer</span>
                        </button>
                        <button mat-menu-item class="danger">
                          <mat-icon color="warn">delete</mat-icon>
                          <span>Supprimer</span>
                        </button>
                      </mat-menu>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Categories -->
          <mat-tab>
            <ng-template mat-tab-label>
              <span>Catégories</span>
              <span class="tab-badge">45</span>
            </ng-template>
            
            <div class="tab-content">
              <div class="categories-header">
                <button mat-flat-button color="primary">
                  <mat-icon>add</mat-icon>
                  Nouvelle catégorie
                </button>
              </div>

              <div class="categories-grid">
                <div class="category-card" *ngFor="let category of categories">
                  <div class="category-icon" [style.background]="category.color">
                    <mat-icon>{{ category.icon }}</mat-icon>
                  </div>
                  <div class="category-info">
                    <h4>{{ category.name }}</h4>
                    <p>{{ category.productCount }} produits</p>
                  </div>
                  <button mat-icon-button [matMenuTriggerFor]="catMenu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #catMenu="matMenu">
                    <button mat-menu-item>
                      <mat-icon>edit</mat-icon>
                      <span>Modifier</span>
                    </button>
                    <button mat-menu-item class="danger">
                      <mat-icon color="warn">delete</mat-icon>
                      <span>Supprimer</span>
                    </button>
                  </mat-menu>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Reports -->
          <mat-tab>
            <ng-template mat-tab-label>
              <span>Signalements</span>
              <span class="tab-badge danger">7</span>
            </ng-template>
            
            <div class="tab-content">
              <div class="reports-list">
                <div class="report-card" *ngFor="let report of reports">
                  <div class="report-header">
                    <div class="report-icon">
                      <mat-icon>report</mat-icon>
                    </div>
                    <div class="report-info">
                      <h4>{{ report.productName }}</h4>
                      <p>Signalé par {{ report.reportedBy }}</p>
                      <span class="report-time">{{ report.time }}</span>
                    </div>
                    <span class="report-badge">{{ report.reason }}</span>
                  </div>
                  <p class="report-description">{{ report.description }}</p>
                  <div class="report-actions">
                    <button mat-flat-button color="primary">
                      <mat-icon>check</mat-icon>
                      Résolu
                    </button>
                    <button mat-stroked-button color="warn">
                      <mat-icon>delete</mat-icon>
                      Supprimer le produit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

        </mat-tab-group>
      </div>
    </div>
  `,
   styles: [`
    .products-container {
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

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.blue {
      background: #dbeafe;
      color: #3b82f6;
    }

    .stat-icon.orange {
      background: #fed7aa;
      color: #f59e0b;
    }

    .stat-icon.purple {
      background: #ede9fe;
      color: #8b5cf6;
    }

    .stat-icon.red {
      background: #fee2e2;
      color: #ef4444;
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: #1f2937;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #6b7280;
      font-weight: 500;
    }

    /* Tabs */
    .tabs-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .products-tabs {
      ::ng-deep .mat-mdc-tab-labels {
        padding: 0 1.5rem;
        border-bottom: 1px solid #e5e7eb;
      }
    }

    .tab-badge {
      margin-left: 0.5rem;
      padding: 0.25rem 0.5rem;
      background: #e5e7eb;
      color: #374151;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .tab-badge.danger {
      background: #fee2e2;
      color: #ef4444;
    }

    .tab-content {
      padding: 1.5rem;
    }

    /* Pending Products */
    .pending-products {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .product-card {
      display: flex;
      gap: 1.5rem;
      padding: 1.5rem;
      background: #f9fafb;
      border-radius: 12px;
      border: 2px solid #e5e7eb;
      transition: all 0.3s ease;
    }

    .product-card:hover {
      border-color: #10b981;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .product-image {
      position: relative;
      width: 120px;
      height: 120px;
      flex-shrink: 0;
      border-radius: 8px;
      overflow: hidden;
      background: #e5e7eb;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-status {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.25rem 0.5rem;
      background: #f59e0b;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 4px;
    }

    .product-info {
      flex: 1;
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .product-header h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .product-price {
      font-size: 1.25rem;
      font-weight: 800;
      color: #10b981;
      white-space: nowrap;
    }

    .product-meta {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 0.75rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #6b7280;
    }

    .meta-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .product-description {
      font-size: 0.9rem;
      color: #374151;
      margin: 0 0 0.75rem 0;
      line-height: 1.5;
    }

    .product-tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .product-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      justify-content: center;
    }

    /* Table Header */
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .search-bar {
      flex: 1;
      min-width: 300px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .search-bar:focus-within {
      border-color: #10b981;
      background: white;
    }

    .search-bar mat-icon {
      color: #9ca3af;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .search-bar input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-size: 0.95rem;
      color: #1f2937;
    }

    .filter-actions {
      display: flex;
      gap: 0.75rem;
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
    }

    .product-card-small {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
      transition: all 0.3s ease;
    }

    .product-card-small:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-4px);
    }

    .product-card-small img {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }

    .card-content {
      padding: 1rem;
    }

    .card-content h4 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .card-content .vendor {
      font-size: 0.85rem;
      color: #6b7280;
      margin: 0 0 0.75rem 0;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-footer .price {
      font-weight: 700;
      color: #10b981;
    }

    /* Categories */
    .categories-header {
      margin-bottom: 1.5rem;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .category-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .category-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .category-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .category-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .category-info {
      flex: 1;
    }

    .category-info h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .category-info p {
      font-size: 0.85rem;
      color: #6b7280;
      margin: 0;
    }

    /* Reports */
    .reports-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .report-card {
      padding: 1.5rem;
      background: #fef2f2;
      border: 2px solid #fecaca;
      border-radius: 12px;
    }

    .report-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .report-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: #fee2e2;
      color: #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .report-info {
      flex: 1;
    }

    .report-info h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .report-info p {
      font-size: 0.85rem;
      color: #6b7280;
      margin: 0 0 0.25rem 0;
    }

    .report-time {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .report-badge {
      padding: 0.5rem 0.75rem;
      background: #ef4444;
      color: white;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .report-description {
      font-size: 0.9rem;
      color: #374151;
      margin: 0 0 1rem 0;
    }

    .report-actions {
      display: flex;
      gap: 0.75rem;
    }

    .danger {
      color: #ef4444 !important;
    }
  `]
})
export class AdminProductsComponent {
   searchControl = new FormControl('');

   pendingProducts = [
      {
         name: 'Miel Pur Koudougou',
         vendor: 'Bio Farm',
         category: 'Miel & Produits de la Ruche',
         price: '3,500',
         description: 'Miel pur récolté traditionnellement dans les ruches de Koudougou. 100% naturel sans additifs.',
         submittedAt: 'Il y a 2h',
         image: 'https://images.unsplash.com/photo-1587049352846-4a222e784084?w=300&h=300&fit=crop',
         tags: ['Bio', 'Local', 'Naturel']
      },
      {
         name: 'Faso Dan Fani Traditionnel',
         vendor: 'Tissage Faso',
         category: 'Artisanat',
         price: '15,000',
         description: 'Tissu traditionnel burkinabé tissé à la main avec des motifs authentiques.',
         submittedAt: 'Il y a 5h',
         image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=300&fit=crop',
         tags: ['Artisanat', 'Traditionnel']
      }
   ];

   allProducts = [
      { name: 'Mil Local', vendor: 'Céréales du Faso', price: '500', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop' },
      { name: 'Sorgho Rouge', vendor: 'Céréales du Faso', price: '450', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop' },
      { name: 'Karité Pur', vendor: 'Beauté Naturelle', price: '2,500', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop' },
      { name: 'Mangue Séchée', vendor: 'Fruits du Sahel', price: '1,200', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=300&fit=crop' }
   ];

   categories = [
      { name: 'Céréales & Grains', productCount: 245, icon: 'grass', color: 'linear-gradient(135deg, #10b981, #059669)' },
      { name: 'Fruits & Légumes', productCount: 189, icon: 'eco', color: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      { name: 'Artisanat', productCount: 156, icon: 'palette', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
      { name: 'Miel & Produits', productCount: 78, icon: 'hive', color: 'linear-gradient(135deg, #f59e0b, #d97706)' }
   ];

   reports = [
      {
         productName: 'Produit suspect',
         reportedBy: 'Jean Dupont',
         reason: 'Contrefaçon',
         description: 'Ce produit semble être une contrefaçon d\'une marque connue.',
         time: 'Il y a 1h'
      }
   ];
}
