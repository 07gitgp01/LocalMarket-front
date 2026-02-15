import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProductService } from '@core/services/product.service';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';
import { SeoService } from '@core/services/seo.service';
import { Product } from '@shared/models/product.model';
import { Review } from '@shared/models/review.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCardModule,
    MatBadgeModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  template: `
    <app-loading-spinner *ngIf="isLoading" [fullscreen]="false" message="Chargement du produit..."></app-loading-spinner>

    <div *ngIf="!isLoading && product" class="container mx-auto px-4 py-8 animate-fade-in-up">
      
      <!-- Breadcrumb -->
      <nav class="flex text-sm text-gray-500 mb-6">
        <a routerLink="/" class="hover:text-green-600">Accueil</a>
        <span class="mx-2">/</span>
        <a routerLink="/products" class="hover:text-green-600">Produits</a>
        <span class="mx-2">/</span>
        <a [routerLink]="['/products']" [queryParams]="{category: product.category}" class="hover:text-green-600">{{ product.category }}</a>
        <span class="mx-2">/</span>
        <span class="text-gray-800 truncate">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        <!-- Left: Image Gallery -->
        <div class="space-y-4">
          <div class="overflow-hidden rounded-lg bg-gray-100 border aspect-square relative group cursor-pointer" (click)="openImageZoom()">
             <img 
              [src]="selectedImage || product.images[0]" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              [alt]="product.name"
            >
            <!-- Badges -->
            <div class="absolute top-3 left-3 flex flex-col gap-2">
              <span class="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1" *ngIf="product.attributes?.['origin']">
                <mat-icon class="text-xs h-3 w-3">place</mat-icon>
                {{ product.attributes?.['origin'] }}
              </span>
              <span class="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg" *ngIf="product.attributes?.['certification']">
                {{ product.attributes?.['certification'] }}
              </span>
              <span class="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse" *ngIf="product.featured">
                ⭐ Coup de cœur
              </span>
            </div>
            <!-- Zoom Icon -->
            <div class="absolute bottom-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <mat-icon class="text-white">zoom_in</mat-icon>
            </div>
          </div>
          
          <!-- Thumbnails -->
          <div class="flex gap-2 overflow-x-auto pb-2">
            <button 
              *ngFor="let img of product.images; let i = index" 
              class="w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all hover:scale-105"
              [class.border-green-600]="selectedImage === img"
              [class.border-gray-200]="selectedImage !== img"
              [class.shadow-md]="selectedImage === img"
              (click)="selectedImage = img"
            >
              <img [src]="img" class="w-full h-full object-cover" [alt]="product.name + ' - Image ' + (i+1)">
            </button>
          </div>
        </div>

        <!-- Right: Info -->
        <div class="flex flex-col">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
          
          <!-- Vendor Small Info -->
          <div class="flex items-center gap-2 mb-4 text-sm">
            <span class="text-gray-500">Vendu par</span>
            <a routerLink="/vendors/{{product.vendorId}}" class="text-green-700 font-semibold hover:underline flex items-center gap-1">
              <mat-icon class="h-4 w-4 text-[16px]">store</mat-icon>
              {{ product.vendor?.shopName || 'Boutique Partenaire' }}
            </a>
            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded ml-2" *ngIf="product.vendor?.verified">Vérifié</span>
          </div>

          <!-- Rating & Stock -->
          <div class="flex items-center gap-3 mb-6 flex-wrap">
            <div class="flex text-yellow-500">
               <mat-icon *ngFor="let star of [1,2,3,4,5]" class="text-[18px] h-[18px] w-[18px]">
                  {{ star <= product.rating ? 'star' : 'star_border' }}
               </mat-icon>
            </div>
            <span class="text-gray-700 text-sm font-medium">{{ product.rating }}/5</span>
            <span class="text-gray-400 text-sm">({{ product.reviewCount }} avis)</span>
            <span class="mx-1 text-gray-300">•</span>
            
            <!-- Stock Indicator -->
            <div class="flex items-center gap-2">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" 
                      [class.bg-green-400]="product.stock > 20"
                      [class.bg-orange-400]="product.stock > 0 && product.stock <= 20"
                      [class.bg-red-400]="product.stock <= 0"></span>
                <span class="relative inline-flex rounded-full h-3 w-3" 
                      [class.bg-green-500]="product.stock > 20"
                      [class.bg-orange-500]="product.stock > 0 && product.stock <= 20"
                      [class.bg-red-500]="product.stock <= 0"></span>
              </span>
              <span class="text-sm font-medium" 
                    [class.text-green-600]="product.stock > 20"
                    [class.text-orange-600]="product.stock > 0 && product.stock <= 20"
                    [class.text-red-600]="product.stock <= 0">
                {{ product.stock > 20 ? 'En Stock (' + product.stock + ')' : 
                   product.stock > 0 ? 'Stock limité (' + product.stock + ')' : 
                   'Rupture de stock' }}
              </span>
            </div>
          </div>

          <!-- Price -->
          <div class="mb-8">
            <div class="flex items-baseline gap-4">
              <span class="text-4xl font-bold text-green-700">{{ product.price | number:'1.0-0' }} FCFA</span>
              <span *ngIf="product.compareAtPrice" class="text-xl text-gray-400 line-through">
                {{ product.compareAtPrice | number:'1.0-0' }} FCFA
              </span>
            </div>
            <div *ngIf="product.compareAtPrice" class="text-red-500 text-sm font-bold mt-1">
              Économisez {{ product.compareAtPrice - product.price | number:'1.0-0' }} FCFA
            </div>
          </div>

          <!-- Description Short -->
          <p class="text-gray-600 mb-8 leading-relaxed">
            {{ product.description }}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-6" *ngIf="product.tags && product.tags.length > 0">
            <mat-chip *ngFor="let tag of product.tags" class="!bg-green-50 !text-green-700 !text-xs !h-7">
              {{ tag }}
            </mat-chip>
          </div>

          <!-- Add to Cart -->
          <div class="flex flex-col sm:flex-row gap-4 mb-8">
             <div class="flex items-center border-2 border-gray-300 rounded-lg w-36 hover:border-green-500 transition">
                <button mat-icon-button 
                        (click)="decrementQuantity()" 
                        [disabled]="quantity <= (product.minOrder || 1)"
                        class="!text-gray-600 hover:!text-green-600">
                  <mat-icon>remove</mat-icon>
                </button>
                <input type="number" 
                       class="w-full text-center border-none outline-none font-bold text-lg" 
                       [(ngModel)]="quantity"
                       [min]="product.minOrder || 1"
                       [max]="product.maxOrder || product.stock"
                       (change)="validateQuantity()">
                <button mat-icon-button 
                        (click)="incrementQuantity()" 
                        [disabled]="quantity >= (product.maxOrder || product.stock)"
                        class="!text-gray-600 hover:!text-green-600">
                  <mat-icon>add</mat-icon>
                </button>
             </div>
             <button mat-flat-button 
                     color="primary" 
                     class="!h-14 !px-8 !text-base flex-grow !font-semibold" 
                     (click)="addToCart()"
                     [disabled]="product.stock <= 0">
               <mat-icon class="mr-2">shopping_cart</mat-icon> 
               {{ product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock' }}
             </button>
             <button mat-stroked-button 
                     [color]="isInWishlist() ? 'warn' : 'accent'" 
                     class="!h-14 !min-w-[56px]" 
                     (click)="toggleWishlist()"
                     [matTooltip]="isInWishlist() ? 'Retirer des favoris' : 'Ajouter aux favoris'">
               <mat-icon>{{ isInWishlist() ? 'favorite' : 'favorite_border' }}</mat-icon>
             </button>
          </div>

          <!-- Min/Max Order Info -->
          <div class="text-sm text-gray-500 mb-6" *ngIf="product.minOrder || product.maxOrder">
            <div *ngIf="product.minOrder" class="flex items-center gap-2">
              <mat-icon class="text-base">info</mat-icon>
              Commande minimum: {{ product.minOrder }} {{ product.unit }}
            </div>
            <div *ngIf="product.maxOrder" class="flex items-center gap-2">
              <mat-icon class="text-base">info</mat-icon>
              Commande maximum: {{ product.maxOrder }} {{ product.unit }}
            </div>
          </div>

          <!-- Secure Info -->
          <div class="grid grid-cols-2 gap-4 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
             <div class="flex items-center gap-2">
               <mat-icon class="text-green-600">verified_user</mat-icon> Paiement sécurisé
             </div>
             <div class="flex items-center gap-2">
               <mat-icon class="text-green-600">local_shipping</mat-icon> Livraison nationale
             </div>
             <div class="flex items-center gap-2">
               <mat-icon class="text-green-600">published_with_changes</mat-icon> Retour gratuit (7j)
             </div>
             <div class="flex items-center gap-2">
               <mat-icon class="text-green-600">support_agent</mat-icon> Support 24/7
             </div>
          </div>
        </div>
      </div>

      <!-- Tabs: Description & Reviews -->
      <div class="mt-16">
        <mat-tab-group animationDuration="0ms" class="bg-white rounded-lg shadow-sm border overflow-hidden">
          
          <mat-tab label="Description Détaillée">
             <div class="p-8 leading-relaxed text-gray-700">
               <h3 class="font-bold text-xl mb-4 text-gray-900">À propos de ce produit</h3>
               <p>{{ product.description }}</p>
               <br>
               
               <h4 class="font-bold text-lg mb-2 text-gray-900">Caractéristiques</h4>
               <ul class="list-disc pl-5 space-y-1">
                  <li>Origine: {{ product.attributes ? product.attributes['origin'] : 'Burkina Faso' }}</li>
                  <li>Catégorie: {{ product.category }}</li>
                  <li *ngIf="product.attributes?.['weight']">Poids: {{ product.attributes?.['weight'] }}</li>
               </ul>
             </div>
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
               Avis Clients <span class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-2">{{ reviews.length }}</span>
            </ng-template>
            
            <div class="p-8">
              <!-- Reviews Summary -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b" *ngIf="reviews.length > 0">
                <div class="text-center">
                  <div class="text-5xl font-bold text-gray-900 mb-2">{{ product.rating }}</div>
                  <div class="flex justify-center text-yellow-500 mb-2">
                    <mat-icon *ngFor="let star of [1,2,3,4,5]" class="text-[20px]">{{ star <= product.rating ? 'star' : 'star_border' }}</mat-icon>
                  </div>
                  <div class="text-sm text-gray-500">{{ reviews.length }} avis clients</div>
                </div>
                
                <div class="col-span-2">
                  <div class="space-y-2">
                    <div *ngFor="let rating of [5,4,3,2,1]" class="flex items-center gap-3">
                      <span class="text-sm text-gray-600 w-12">{{ rating }} étoiles</span>
                      <div class="flex-grow bg-gray-200 rounded-full h-2">
                        <div class="bg-yellow-500 h-2 rounded-full transition-all" 
                             [style.width.%]="getReviewPercentage(rating)"></div>
                      </div>
                      <span class="text-sm text-gray-500 w-12 text-right">{{ getReviewCount(rating) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Filters & Sort -->
              <div class="flex flex-wrap gap-4 mb-6" *ngIf="reviews.length > 0">
                <mat-form-field class="!w-40">
                  <mat-label>Filtrer par note</mat-label>
                  <mat-select [(value)]="selectedRatingFilter" (selectionChange)="filterReviews()">
                    <mat-option [value]="0">Toutes les notes</mat-option>
                    <mat-option [value]="5">5 étoiles</mat-option>
                    <mat-option [value]="4">4 étoiles</mat-option>
                    <mat-option [value]="3">3 étoiles</mat-option>
                    <mat-option [value]="2">2 étoiles</mat-option>
                    <mat-option [value]="1">1 étoile</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field class="!w-48">
                  <mat-label>Trier par</mat-label>
                  <mat-select [(value)]="selectedSortOption" (selectionChange)="sortReviews()">
                    <mat-option value="recent">Plus récents</mat-option>
                    <mat-option value="helpful">Plus utiles</mat-option>
                    <mat-option value="rating-high">Note décroissante</mat-option>
                    <mat-option value="rating-low">Note croissante</mat-option>
                  </mat-select>
                </mat-form-field>

                <button mat-stroked-button class="!ml-auto">
                  <mat-icon class="mr-2">rate_review</mat-icon>
                  Écrire un avis
                </button>
              </div>

              <!-- Reviews List -->
              <app-empty-state 
                *ngIf="filteredReviews.length === 0 && reviews.length === 0"
                icon="rate_review"
                title="Aucun avis pour le moment"
                description="Soyez le premier à donner votre avis sur ce produit!"
                actionText="Écrire un avis">
              </app-empty-state>

              <div class="text-center py-8 text-gray-500" *ngIf="filteredReviews.length === 0 && reviews.length > 0">
                Aucun avis ne correspond à vos critères de filtrage.
              </div>

              <div class="space-y-6">
                <div *ngFor="let review of paginatedReviews" class="border-b pb-6 last:border-0">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-3">
                       <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                         {{ getInitials(review.userId) }}
                       </div>
                       <div>
                         <div class="font-bold text-sm">Client {{ review.userId }}</div>
                         <div class="text-xs text-gray-400">{{ getTimeAgo(review.createdAt) }}</div>
                       </div>
                    </div>
                    <div class="flex text-yellow-500">
                       <mat-icon *ngFor="let star of [1,2,3,4,5]" class="text-[16px]">{{ star <= review.rating ? 'star' : 'star_border' }}</mat-icon>
                    </div>
                  </div>
                  <h4 class="font-bold mt-2">{{ review.title }}</h4>
                  <p class="text-gray-600 text-sm mt-2 leading-relaxed">{{ review.comment }}</p>
                  <div class="flex items-center gap-4 mt-4 text-sm">
                    <button class="flex items-center gap-1 text-gray-500 hover:text-green-600 transition">
                      <mat-icon class="text-[18px]">thumb_up</mat-icon> 
                      <span>Utile ({{ review.helpful }})</span>
                    </button>
                    <span class="text-green-600 flex items-center gap-1 font-medium" *ngIf="review.verified">
                      <mat-icon class="text-[18px]">verified</mat-icon> Achat vérifié
                    </span>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <mat-paginator 
                *ngIf="filteredReviews.length > pageSize"
                [length]="filteredReviews.length"
                [pageSize]="pageSize"
                [pageSizeOptions]="[5, 10, 20]"
                (page)="onPageChange($event)"
                class="mt-6">
              </mat-paginator>
            </div>
          </mat-tab>

          <mat-tab label="Vendeur">
            <div class="py-6 flex gap-6" *ngIf="product.vendor">
              <img [src]="product.vendor.logo" class="w-24 h-24 rounded-lg object-cover border">
              <div>
                <h3 class="text-xl font-bold">{{ product.vendor.shopName }}</h3>
                <p class="text-gray-600 my-2">{{ product.vendor.description }}</p>
                <div class="flex gap-4 text-sm text-gray-500">
                   <div class="flex items-center gap-1"><mat-icon class="h-4 w-4 text-sm">place</mat-icon> {{ product.vendor.location.city }}</div>
                   <div class="flex items-center gap-1"><mat-icon class="h-4 w-4 text-sm">inventory_2</mat-icon> {{ product.vendor.productCount }} produits</div>
                </div>
                <button mat-stroked-button color="primary" class="mt-4" [routerLink]="['/vendors', product.vendor.id]">Visiter la boutique</button>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>

      <!-- Similar Products / Recommendations -->
      <div class="mt-16" *ngIf="similarProducts.length > 0">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Produits similaires</h2>
          <a routerLink="/products" [queryParams]="{category: product.category}" class="text-green-600 hover:underline text-sm font-medium">
            Voir tout <mat-icon class="text-sm align-middle">arrow_forward</mat-icon>
          </a>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <div *ngFor="let similar of similarProducts" 
               class="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
               [routerLink]="['/products', similar.id]">
            <div class="aspect-square overflow-hidden bg-gray-100 relative">
              <img [src]="similar.images[0]" 
                   [alt]="similar.name" 
                   class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
              <div class="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <mat-icon class="text-gray-600 text-[18px]">favorite_border</mat-icon>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-sm mb-1 truncate group-hover:text-green-600 transition">{{ similar.name }}</h3>
              <div class="flex items-center gap-1 mb-2">
                <div class="flex text-yellow-500">
                  <mat-icon *ngFor="let star of [1,2,3,4,5]" class="text-[12px]">{{ star <= similar.rating ? 'star' : 'star_border' }}</mat-icon>
                </div>
                <span class="text-xs text-gray-500">({{ similar.reviewCount }})</span>
              </div>
              <div class="flex items-baseline gap-2">
                <span class="text-lg font-bold text-green-700">{{ similar.price | number:'1.0-0' }} FCFA</span>
                <span *ngIf="similar.compareAtPrice" class="text-xs text-gray-400 line-through">{{ similar.compareAtPrice | number:'1.0-0' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in-up {
       animation: fadeInUp 0.5s ease-out;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  paginatedReviews: Review[] = [];
  similarProducts: Product[] = [];
  selectedImage: string | null = null;
  quantity = 1;
  isLoading = true;

  // Reviews filters & pagination
  selectedRatingFilter = 0;
  selectedSortOption = 'recent';
  pageSize = 5;
  currentPage = 0;

  private seoService = inject(SeoService);
  private wishlistService = inject(WishlistService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: number) {
    this.isLoading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.quantity = product.minOrder || 1;
        this.selectedImage = product.images[0];
        this.loadReviews(id);
        this.loadSimilarProducts(product.category, id);

        // SEO
        this.seoService.updateTags({
          title: product.name,
          description: product.description.substring(0, 160),
          image: product.images[0],
          type: 'product'
        });
        this.seoService.setProductStructuredData(product);
      },
      error: () => this.isLoading = false
    });
  }

  loadReviews(id: number) {
    this.productService.getProductReviews(id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.filteredReviews = [...reviews];
        this.sortReviews();
        this.updatePaginatedReviews();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadSimilarProducts(category: string, excludeId: number) {
    this.productService.getProducts({ category, limit: 8 }).subscribe({
      next: (products) => {
        this.similarProducts = products
          .filter(p => p.id !== excludeId)
          .slice(0, 4);
      }
    });
  }

  // Quantity Management
  incrementQuantity() {
    if (this.product) {
      const max = this.product.maxOrder || this.product.stock;
      if (this.quantity < max) {
        this.quantity++;
      }
    }
  }

  decrementQuantity() {
    if (this.product) {
      const min = this.product.minOrder || 1;
      if (this.quantity > min) {
        this.quantity--;
      }
    }
  }

  validateQuantity() {
    if (this.product) {
      const min = this.product.minOrder || 1;
      const max = this.product.maxOrder || this.product.stock;
      
      if (this.quantity < min) {
        this.quantity = min;
      } else if (this.quantity > max) {
        this.quantity = max;
      }
    }
  }

  // Cart & Wishlist
  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
    }
  }

  toggleWishlist() {
    if (this.product) {
      this.wishlistService.toggleWishlist(this.product);
    }
  }

  isInWishlist(): boolean {
    return this.product ? this.wishlistService.isInWishlist(this.product.id) : false;
  }

  // Reviews Filtering & Sorting
  filterReviews() {
    if (this.selectedRatingFilter === 0) {
      this.filteredReviews = [...this.reviews];
    } else {
      this.filteredReviews = this.reviews.filter(r => r.rating === this.selectedRatingFilter);
    }
    this.sortReviews();
    this.currentPage = 0;
    this.updatePaginatedReviews();
  }

  sortReviews() {
    switch (this.selectedSortOption) {
      case 'recent':
        this.filteredReviews.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'helpful':
        this.filteredReviews.sort((a, b) => b.helpful - a.helpful);
        break;
      case 'rating-high':
        this.filteredReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-low':
        this.filteredReviews.sort((a, b) => a.rating - b.rating);
        break;
    }
    this.updatePaginatedReviews();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedReviews();
  }

  updatePaginatedReviews() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedReviews = this.filteredReviews.slice(startIndex, endIndex);
  }

  getReviewCount(rating: number): number {
    return this.reviews.filter(r => r.rating === rating).length;
  }

  getReviewPercentage(rating: number): number {
    if (this.reviews.length === 0) return 0;
    return (this.getReviewCount(rating) / this.reviews.length) * 100;
  }

  // Utility Functions
  getInitials(userId: number): string {
    return `U${userId}`;
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
    return `Il y a ${Math.floor(diffDays / 365)} ans`;
  }

  openImageZoom() {
    // TODO: Implement image zoom dialog
    console.log('Open image zoom');
  }
}
