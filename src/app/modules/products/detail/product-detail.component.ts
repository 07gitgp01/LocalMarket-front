import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

import { ProductService } from '@core/services/product.service';
import { CartService } from '@core/services/cart.service';
import { SeoService } from '@core/services/seo.service';
import { Product } from '@shared/models/product.model';
import { Review } from '@shared/models/review.model';

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
    MatCardModule
  ],
  template: `
    <div *ngIf="isLoading" class="flex justify-center items-center min-h-[50vh]">
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    </div>

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
          <div class="overflow-hidden rounded-lg bg-gray-100 border aspect-4/3 relative group cursor-zoom-in">
             <img 
              [src]="selectedImage || product.images[0]" 
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
              [alt]="product.name"
            >
            <div class="absolute top-2 left-2" *ngIf="product.attributes?.['origin']">
              <span class="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <mat-icon class="text-xs h-3 w-3">place</mat-icon>
                {{ product.attributes?.['origin'] }}
              </span>
            </div>
          </div>
          
          <div class="flex gap-2 overflow-x-auto pb-2">
            <button 
              *ngFor="let img of product.images" 
              class="w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0"
              [class.border-green-600]="selectedImage === img"
              [class.border-transparent]="selectedImage !== img"
              (click)="selectedImage = img"
            >
              <img [src]="img" class="w-full h-full object-cover">
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

          <!-- Rating -->
          <div class="flex items-center gap-2 mb-6">
            <div class="flex text-yellow-500">
               <mat-icon *ngFor="let star of [1,2,3,4,5]" class="text-[18px] h-[18px] w-[18px]">
                  {{ star <= product.rating ? 'star' : 'star_border' }}
               </mat-icon>
            </div>
            <span class="text-gray-500 text-sm">({{ product.reviewCount }} avis)</span>
            <span class="mx-2 text-gray-300">|</span>
            <span class="text-green-600 text-sm font-medium" *ngIf="product.stock > 0">En Stock ({{product.stock}})</span>
            <span class="text-red-500 text-sm font-medium" *ngIf="product.stock <= 0">Rupture de stock</span>
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

          <!-- Add to Cart -->
          <div class="flex flex-col sm:flex-row gap-4 mb-8">
             <div class="flex items-center border rounded-md w-32">
                <button mat-icon-button (click)="quantity > (product.minOrder || 1) ? quantity = quantity - 1 : null">
                  <mat-icon>remove</mat-icon>
                </button>
                <input type="number" class="w-full text-center border-none outline-none font-bold" [(ngModel)]="quantity">
                <button mat-icon-button (click)="quantity = quantity + 1">
                  <mat-icon>add</mat-icon>
                </button>
             </div>
             <button mat-flat-button color="primary" class="!h-12 !px-8 !text-lg flex-grow" (click)="addToCart()">
               <mat-icon class="mr-2">shopping_cart</mat-icon> Ajouter au panier
             </button>
             <button mat-stroked-button color="accent" class="!h-12 !min-w-[50px]">
               <mat-icon>favorite_border</mat-icon>
             </button>
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
               Avis Clients <span class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-2">{{ product.reviewCount }}</span>
            </ng-template>
            
            <div class="p-8">
              <!-- Reviews List -->
              <div *ngIf="reviews.length === 0" class="text-center py-10 text-gray-500">
                Aucun avis pour le moment. Soyez le premier à donner votre avis !
              </div>

              <div class="space-y-6">
                <div *ngFor="let review of reviews" class="border-b pb-6 last:border-0">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-3">
                       <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                         U
                       </div>
                       <div>
                         <div class="font-bold text-sm">Client LocalMarket</div>
                         <div class="text-xs text-gray-400">Il y a 2 jours</div>
                       </div>
                    </div>
                    <div class="flex text-yellow-500 text-xs">
                       <mat-icon *ngFor="let star of [1,2,3,4,5]">{{ star <= review.rating ? 'star' : 'star_border' }}</mat-icon>
                    </div>
                  </div>
                  <h4 class="font-bold mt-2 text-sm">{{ review.title }}</h4>
                  <p class="text-gray-600 text-sm mt-1">{{ review.comment }}</p>
                  <div class="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <button class="flex items-center gap-1 hover:text-green-600 transition">
                      <mat-icon class="text-xs h-3 w-3">thumb_up</mat-icon> Utile ({{ review.helpful }})
                    </button>
                    <span class="text-green-600 flex items-center gap-1" *ngIf="review.verified">
                      <mat-icon class="text-xs h-3 w-3">verified</mat-icon> Achat vérifié
                    </span>
                  </div>
                </div>
              </div>

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
  selectedImage: string | null = null;
  quantity = 1;
  isLoading = true;

  private seoService = inject(SeoService);

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
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
    }
  }
}
