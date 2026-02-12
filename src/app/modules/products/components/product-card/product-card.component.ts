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
        MatTooltipModule
    ],
    template: `
    <mat-card class="h-full flex flex-col product-card transition-all duration-300 hover:shadow-lg group">
      <!-- Image Container -->
      <div class="relative overflow-hidden aspect-[4/3]">
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
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
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
        <div class="flex items-center gap-1 mb-2">
          <div class="flex text-yellow-500 text-xs">
            <mat-icon *ngFor="let star of [1,2,3,4,5]" class="text-[14px] h-[14px] w-[14px]">
              {{ star <= product.rating ? 'star' : 'star_border' }}
            </mat-icon>
          </div>
          <span class="text-xs text-gray-400">({{ product.reviewCount }})</span>
        </div>

        <div class="flex-grow"></div>

        <!-- Prix -->
        <div class="flex items-end justify-between mt-2">
          <div>
            <div *ngIf="product.compareAtPrice" class="text-xs text-gray-400 line-through">
              {{ product.compareAtPrice | number:'1.0-0' }} FCFA
            </div>
            <div class="text-lg font-bold text-green-700">
              {{ product.price | number:'1.0-0' }} FCFA
              <span class="text-xs font-normal text-gray-500">/ {{ product.unit }}</span>
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
  `]
})
export class ProductCardComponent {
    @Input({ required: true }) product!: Product;
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
