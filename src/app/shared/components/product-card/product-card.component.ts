import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Product } from '@shared/models/product.model';
import { CartService } from '@core/services/cart.service';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatTooltipModule,
        RatingStarsComponent
    ],
    template: `
    <!-- Grid View -->
    <mat-card *ngIf="viewMode === 'grid'" class="h-full flex flex-col product-card transition-all duration-300 hover:shadow-lg group">
      <!-- Image Container -->
      <div class="relative overflow-hidden bg-gray-100 image-container-grid">
        <!-- Badge Local -->
        <div class="absolute top-2 left-2 z-10">
          <span class="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <mat-icon class="text-xs h-3 w-3">place</mat-icon>
            {{ product.attributes?.['origin'] || product.vendor?.location?.region || 'Burkina Faso' }}
          </span>
        </div>

        <!-- Badge Promo -->
        <div *ngIf="hasDiscount" class="absolute top-2 right-2 z-10">
          <span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            -{{ discountPercentage }}%
          </span>
        </div>

        <!-- Product Image -->
        <a [routerLink]="['/products', product.id]" class="block w-full h-full">
          <img 
            [src]="product.images[0]" 
            [alt]="product.name"
            class="product-image-grid"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'"
          >
        </a>

        <!-- Quick Actions (Hover) -->
        <div class="absolute -bottom-10 left-0 right-0 p-2 flex justify-center gap-2 transition-all duration-300 group-hover:bottom-0 bg-gradient-to-t from-black/50 to-transparent">
          <button mat-mini-fab color="accent" (click)="addToCart($event)" matTooltip="Ajouter au panier">
            <mat-icon>add_shopping_cart</mat-icon>
          </button>
          <button mat-mini-fab color="white" class="!bg-white !text-gray-800" matTooltip="Aperçu rapide">
            <mat-icon>visibility</mat-icon>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4 flex-grow flex flex-col">
        <!-- Vendeur -->
        <div class="text-xs text-gray-500 mb-1 flex items-center gap-1">
          <mat-icon class="text-xs h-3 w-3">store</mat-icon>
          <span class="truncate">{{ product.vendor?.shopName || 'Vendeur Local' }}</span>
        </div>

        <!-- Titre -->
        <a [routerLink]="['/products', product.id]" class="font-bold text-gray-800 mb-1 hover:text-green-700 line-clamp-2 no-underline">
          {{ product.name }}
        </a>

        <!-- Rating -->
        <div class="mb-2">
            <app-rating-stars [rating]="product.rating || 0" [count]="product.reviewCount || 0" [size]="14"></app-rating-stars>
        </div>

        <div class="flex-grow"></div>

        <!-- Prix et Actions -->
        <div class="mt-2">
          <div class="mb-3">
            <div *ngIf="product.compareAtPrice" class="text-xs text-gray-400 line-through">
              {{ product.compareAtPrice | number:'1.0-0' }} FCFA
            </div>
            <div class="text-lg font-bold text-green-700">
              {{ product.price | number:'1.0-0' }} FCFA
              <span class="text-xs font-normal text-gray-500">/ {{ product.unit }}</span>
            </div>
          </div>
          
          <!-- Bouton Ajouter au panier -->
          <button 
            mat-raised-button 
            color="primary" 
            class="w-full !py-2"
            (click)="addToCart($event)"
            [disabled]="product.stock === 0"
          >
            <mat-icon class="mr-1">add_shopping_cart</mat-icon>
            {{ product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier' }}
          </button>
        </div>
      </div>
    </mat-card>

    <!-- List View -->
    <mat-card *ngIf="viewMode === 'list'" class="product-card-list transition-all duration-300 hover:shadow-lg">
      <div class="flex gap-4 p-4">
        <!-- Image Container -->
        <div class="relative overflow-hidden rounded-lg flex-shrink-0" style="width: 200px; height: 200px;">
          <!-- Badge Local -->
          <div class="absolute top-2 left-2 z-10">
            <span class="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
              <mat-icon class="text-xs h-3 w-3">place</mat-icon>
              {{ product.attributes?.['origin'] || product.vendor?.location?.region || 'Burkina Faso' }}
            </span>
          </div>

          <!-- Badge Promo -->
          <div *ngIf="hasDiscount" class="absolute top-2 right-2 z-10">
            <span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
              -{{ discountPercentage }}%
            </span>
          </div>

          <!-- Product Image -->
          <a [routerLink]="['/products', product.id]" class="block h-full w-full">
            <img 
              [src]="product.images[0]" 
              [alt]="product.name"
              class="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'"
            >
          </a>
        </div>

        <!-- Content -->
        <div class="flex-grow flex flex-col justify-between">
          <div>
            <!-- Vendeur -->
            <div class="text-sm text-gray-500 mb-2 flex items-center gap-1">
              <mat-icon class="text-sm h-4 w-4">store</mat-icon>
              <span>{{ product.vendor?.shopName || 'Vendeur Local' }}</span>
            </div>

            <!-- Titre -->
            <a [routerLink]="['/products', product.id]" class="text-xl font-bold text-gray-800 mb-2 hover:text-green-700 line-clamp-2 no-underline block">
              {{ product.name }}
            </a>

            <!-- Description -->
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">
              {{ product.description }}
            </p>

            <!-- Rating -->
            <div class="mb-2">
              <app-rating-stars [rating]="product.rating || 0" [count]="product.reviewCount || 0" [size]="16"></app-rating-stars>
            </div>

            <!-- Stock Status -->
            <div class="flex items-center gap-2 mb-2">
              <mat-chip *ngIf="product.stock > 0" class="!bg-green-100 !text-green-800 !text-xs !h-6">
                <mat-icon class="text-xs">check_circle</mat-icon>
                En stock ({{ product.stock }})
              </mat-chip>
              <mat-chip *ngIf="product.stock === 0" class="!bg-red-100 !text-red-800 !text-xs !h-6">
                <mat-icon class="text-xs">cancel</mat-icon>
                Rupture de stock
              </mat-chip>
            </div>
          </div>

          <!-- Prix et Actions -->
          <div class="flex items-center justify-between mt-4">
            <div>
              <div *ngIf="product.compareAtPrice" class="text-sm text-gray-400 line-through">
                {{ product.compareAtPrice | number:'1.0-0' }} FCFA
              </div>
              <div class="text-2xl font-bold text-green-700">
                {{ product.price | number:'1.0-0' }} FCFA
                <span class="text-sm font-normal text-gray-500">/ {{ product.unit }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button mat-icon-button matTooltip="Aperçu rapide">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-raised-button color="primary" (click)="addToCart($event)" [disabled]="product.stock === 0">
                <mat-icon>add_shopping_cart</mat-icon>
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </mat-card>
  `,
    styles: [`
    .product-card {
      border: 1px solid #f0f0f0;
    }

    .product-card-list {
      border: 1px solid #f0f0f0;
    }

    .product-card-list:hover {
      border-color: #10b981;
    }

    /* Grid Image Container - Fixed uniform height */
    .image-container-grid {
      width: 100%;
      height: 240px;
      position: relative;
    }

    /* Grid Image - Uniform sizing */
    .product-image-grid {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: transform 0.5s ease;
    }

    .group:hover .product-image-grid {
      transform: scale(1.1);
    }

    /* Fix image overflow */
    img {
      max-width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Line clamp utilities */
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProductCardComponent {
    @Input({ required: true }) product!: Product;
    @Input() viewMode: 'grid' | 'list' = 'grid';
    @Output() addCart = new EventEmitter<Product>();

    constructor(private cartService: CartService) { }

    get hasDiscount(): boolean {
        return !!this.product.compareAtPrice && this.product.compareAtPrice > this.product.price;
    }

    get discountPercentage(): number {
        if (!this.hasDiscount || !this.product.compareAtPrice) return 0;
        return Math.round(((this.product.compareAtPrice - this.product.price) / this.product.compareAtPrice) * 100);
    }

    addToCart(event: Event) {
        event.stopPropagation();
        event.preventDefault();
        this.cartService.addToCart(this.product);
        this.addCart.emit(this.product);
    }
}
