import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ProductService } from '@core/services/product.service';
import { Product, ProductFilters } from '@shared/models/product.model';
import { Category } from '@shared/models/category.model';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatSliderModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    ProductCardComponent
  ],
  template: `
    <div class="products-page">
      
      <!-- Hero Banner -->
      <div class="hero-banner">
        <div class="hero-content">
          <div class="hero-text">
            <div class="promo-badge">Jusqu'à 70% de réduction sur le Black Friday</div>
            <h1>COLLECTION <span class="highlight">TENDANCE</span></h1>
            <p>Découvrez les meilleurs produits locaux du Burkina Faso</p>
            <button mat-flat-button color="primary" class="hero-btn">
              Acheter maintenant
            </button>
          </div>
          <div class="hero-image">
            <img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=600&fit=crop" alt="Shopping">
          </div>
        </div>
      </div>

      <div class="container">
        
        <!-- Promo Cards -->
        <div class="promo-cards">
          <div class="promo-card blue">
            <div class="promo-content">
              <h3>Gadget Store</h3>
              <p class="promo-discount">30% Sale</p>
              <a routerLink="/products" class="promo-link">
                <mat-icon>shopping_bag</mat-icon>
                Acheter maintenant
              </a>
            </div>
            <div class="promo-image">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" alt="Gadgets">
            </div>
          </div>

          <div class="promo-card beige">
            <div class="promo-content">
              <h3>Bundle Package</h3>
              <p class="promo-discount">Save 30%</p>
              <a routerLink="/products" class="promo-link">Voir tout</a>
            </div>
            <div class="promo-image">
              <img src="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=200&h=200&fit=crop" alt="Bundle">
            </div>
          </div>

          <div class="promo-card pink">
            <div class="promo-content">
              <h3>Valentines Offer</h3>
              <p class="promo-discount">30% Sale</p>
              <a routerLink="/products" class="promo-link">
                <mat-icon>shopping_bag</mat-icon>
                Acheter maintenant
              </a>
            </div>
            <div class="promo-image">
              <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop" alt="Valentine">
            </div>
          </div>

          <div class="promo-card cream">
            <div class="promo-content">
              <h3>Relax Chair</h3>
              <p class="promo-discount">New Arrival</p>
              <a routerLink="/products" class="promo-link">
                <mat-icon>shopping_bag</mat-icon>
                Acheter maintenant
              </a>
            </div>
            <div class="promo-image">
              <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop" alt="Chair">
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          
          <!-- Sidebar -->
          <aside class="sidebar">
            <!-- Browse Categories -->
            <div class="sidebar-section categories-section">
              <button class="categories-header">
                <mat-icon>menu</mat-icon>
                <span>Parcourir les catégories</span>
              </button>
              
              <div class="categories-list">
                <a 
                  *ngFor="let cat of categories" 
                  [routerLink]="['/products']"
                  [queryParams]="{category: cat.name}"
                  class="category-item"
                  [class.active]="currentCategory === cat.name"
                >
                  <span>{{ cat.name }}</span>
                  <mat-icon>chevron_right</mat-icon>
                </a>
                <a routerLink="/products" class="category-item view-all">
                  <span>Voir toutes les catégories</span>
                  <mat-icon>add</mat-icon>
                </a>
              </div>
            </div>

            <!-- Services -->
            <div class="services-section">
              <div class="service-item">
                <div class="service-icon blue">
                  <mat-icon>local_shipping</mat-icon>
                </div>
                <div class="service-info">
                  <h4>Livraison gratuite</h4>
                  <p>Commande minimum 50$</p>
                </div>
              </div>

              <div class="service-item">
                <div class="service-icon blue">
                  <mat-icon>support_agent</mat-icon>
                </div>
                <div class="service-info">
                  <h4>Support 24/7</h4>
                  <p>Contactez-nous 24h/24</p>
                </div>
              </div>

              <div class="service-item">
                <div class="service-icon blue">
                  <mat-icon>local_offer</mat-icon>
                </div>
                <div class="service-info">
                  <h4>Meilleurs prix & offres</h4>
                  <p>Voir 100+ articles</p>
                </div>
              </div>

              <div class="service-item">
                <div class="service-icon blue">
                  <mat-icon>assignment_return</mat-icon>
                </div>
                <div class="service-info">
                  <h4>Retours faciles</h4>
                  <p>Sous 30 jours</p>
                </div>
              </div>
            </div>
          </aside>

          <!-- Products Section -->
          <div class="products-section">
            
            <!-- Section Header -->
            <div class="section-header">
              <div class="section-title">
                <h2>Articles en vedette</h2>
                <p>{{ filteredCount }} produits disponibles</p>
              </div>
              <div class="section-actions">
                <mat-form-field appearance="outline" class="sort-select">
                  <mat-select [formControl]="sortControl" placeholder="Trier par">
                    <mat-option value="popularity">Populaire</mat-option>
                    <mat-option value="newest">Plus récent</mat-option>
                    <mat-option value="price_asc">Prix croissant</mat-option>
                    <mat-option value="price_desc">Prix décroissant</mat-option>
                    <mat-option value="rating">Meilleures notes</mat-option>
                  </mat-select>
                </mat-form-field>
                <div class="view-toggle">
                  <button mat-icon-button [class.active]="viewMode === 'grid'" (click)="viewMode = 'grid'">
                    <mat-icon>grid_view</mat-icon>
                  </button>
                  <button mat-icon-button [class.active]="viewMode === 'list'" (click)="viewMode = 'list'">
                    <mat-icon>view_list</mat-icon>
                  </button>
                </div>
              </div>
            </div>

            <!-- Loading -->
            <div *ngIf="isLoading" class="loading-state">
              <mat-progress-spinner mode="indeterminate" diameter="50"></mat-progress-spinner>
            </div>

            <!-- Empty State -->
            <div *ngIf="!isLoading && products.length === 0" class="empty-state">
              <mat-icon>search_off</mat-icon>
              <h3>Aucun produit trouvé</h3>
              <p>Essayez de modifier vos filtres ou votre recherche.</p>
              <button mat-flat-button color="primary" (click)="resetFilters()">Effacer les filtres</button>
            </div>

            <!-- Products Grid -->
            <div *ngIf="!isLoading && products.length > 0" class="products-grid">
              <app-product-card *ngFor="let product of products" [product]="product"></app-product-card>
            </div>

            <!-- Load More -->
            <div class="load-more" *ngIf="products.length < totalProducts">
              <button mat-stroked-button color="primary" (click)="loadMore()">
                <span *ngIf="!isLoadingMore">Voir plus de produits</span>
                <mat-spinner *ngIf="isLoadingMore" diameter="20"></mat-spinner>
              </button>
              <p>Affichage de {{ products.length }} sur {{ totalProducts }} produits</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .products-page {
      background: #f5f5f5;
      min-height: 100vh;
    }

    /* Hero Banner */
    .hero-banner {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 3rem 1rem;
      margin-bottom: 2rem;
    }

    .hero-content {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
    }

    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }

    .hero-text {
      color: white;
    }

    .promo-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .hero-text h1 {
      font-size: 3rem;
      font-weight: 800;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .hero-text .highlight {
      color: #4fc3f7;
    }

    .hero-text p {
      font-size: 1.1rem;
      margin: 0 0 2rem 0;
      opacity: 0.9;
    }

    .hero-btn {
      height: 56px !important;
      padding: 0 2rem !important;
      font-size: 1.1rem !important;
      font-weight: 600 !important;
    }

    .hero-image {
      display: flex;
      justify-content: center;
    }

    .hero-image img {
      max-width: 500px;
      width: 100%;
      height: auto;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    /* Container */
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem 3rem;
    }

    /* Promo Cards */
    .promo-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .promo-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .promo-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .promo-card.blue { background: #e3f2fd; }
    .promo-card.beige { background: #fff8e1; }
    .promo-card.pink { background: #fce4ec; }
    .promo-card.cream { background: #f5f5f5; }

    .promo-content h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #666;
      margin: 0 0 0.5rem 0;
    }

    .promo-discount {
      font-size: 1.5rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 1rem 0;
    }

    .promo-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #ef4444;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .promo-link mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .promo-image {
      width: 100px;
      height: 100px;
      flex-shrink: 0;
    }

    .promo-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }

    /* Main Content */
    .main-content {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
    }

    @media (max-width: 1024px) {
      .main-content {
        grid-template-columns: 1fr;
      }

      .sidebar {
        display: none;
      }
    }

    /* Sidebar */
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .sidebar-section {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .categories-header {
      width: 100%;
      padding: 1rem 1.5rem;
      background: #10b981;
      color: white;
      border: none;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }

    .categories-list {
      padding: 0.5rem 0;
    }

    .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.875rem 1.5rem;
      color: #374151;
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 0.95rem;
    }

    .category-item:hover {
      background: #f3f4f6;
      color: #10b981;
      padding-left: 2rem;
    }

    .category-item.active {
      background: #f0fdf4;
      color: #10b981;
      font-weight: 600;
    }

    .category-item.view-all {
      color: #3b82f6;
      font-weight: 600;
    }

    .category-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Services */
    .services-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .service-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .service-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .service-icon.blue {
      background: #dbeafe;
      color: #3b82f6;
    }

    .service-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .service-info h4 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .service-info p {
      font-size: 0.85rem;
      color: #6b7280;
      margin: 0;
    }

    /* Products Section */
    .products-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .section-title h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .section-title p {
      color: #6b7280;
      margin: 0;
    }

    .section-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .sort-select {
      width: 180px;
    }

    .view-toggle {
      display: flex;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }

    .view-toggle button {
      color: #6b7280;
    }

    .view-toggle button.active {
      color: #10b981;
      background: #f0fdf4;
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.5rem;
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

    /* Load More */
    .load-more {
      text-align: center;
      margin-top: 3rem;
    }

    .load-more button {
      min-width: 200px;
    }

    .load-more p {
      font-size: 0.85rem;
      color: #9ca3af;
      margin-top: 1rem;
    }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // State
  products: Product[] = [];
  categories: Category[] = [];
  isLoading = false;
  isLoadingMore = false;
  filteredCount = 0;
  totalProducts = 0;
  currentCategory: string | null = null;
  viewMode: 'grid' | 'list' = 'grid';
  isDesktop = window.innerWidth >= 768;
  hasActiveFilters = false;

  // Form Controls
  searchControl = new FormControl('');
  categoryControl = new FormControl<string | null>(null);
  sortControl = new FormControl('popularity');
  minPriceControl = new FormControl(0);
  maxPriceControl = new FormControl(50000);
  featuredControl = new FormControl(false);

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    this.setupFilters();
  }

  private loadCategories() {
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  private loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredCount = products.length;
        this.totalProducts = products.length;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private setupFilters() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyFilters());

    this.categoryControl.valueChanges.subscribe(() => this.applyFilters());
    this.sortControl.valueChanges.subscribe(() => this.applyFilters());
  }

  private applyFilters() {
    // Filter logic here
    this.hasActiveFilters = !!(
      this.searchControl.value ||
      this.categoryControl.value ||
      this.featuredControl.value
    );
  }

  resetFilters() {
    this.searchControl.setValue('');
    this.categoryControl.setValue(null);
    this.minPriceControl.setValue(0);
    this.maxPriceControl.setValue(50000);
    this.featuredControl.setValue(false);
    this.sortControl.setValue('popularity');
  }

  loadMore() {
    this.isLoadingMore = true;
    setTimeout(() => {
      this.isLoadingMore = false;
    }, 1000);
  }
}
