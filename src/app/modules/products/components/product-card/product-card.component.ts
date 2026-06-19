import { Component, Input, Output, EventEmitter, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Product } from '@shared/models/product.model';
import { CartService } from '@core/services/cart.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-product-quick-view-dialog',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="qv-dialog">
      <button mat-icon-button class="qv-close" (click)="dialogRef.close()"><mat-icon>close</mat-icon></button>
      <div class="qv-image">
        <img [src]="product.images[0]" [alt]="product.name">
        <span *ngIf="hasDiscount" class="qv-badge">-{{ discountPct }}%</span>
      </div>
      <div class="qv-body">
        <p class="qv-vendor">{{ product.vendor?.shopName || 'Vendeur Local' }}</p>
        <h2 class="qv-title">{{ product.name }}</h2>
        <div class="qv-rating">
          <span *ngFor="let s of [1,2,3,4,5]" class="star" [class.filled]="s <= product.rating">★</span>
          <span class="qv-reviews">({{ product.reviewCount }} avis)</span>
        </div>
        <div class="qv-price">
          <span class="qv-compare" *ngIf="product.compareAtPrice">{{ product.compareAtPrice | number }} FCFA</span>
          <span class="qv-main-price">{{ product.price | number }} FCFA</span>
          <span class="qv-unit">/ {{ product.unit }}</span>
        </div>
        <p class="qv-desc">{{ product.description | slice:0:120 }}...</p>
        <div class="qv-stock" [class.in-stock]="product.stock > 0" [class.out-stock]="product.stock === 0">
          <mat-icon>{{ product.stock > 0 ? 'check_circle' : 'cancel' }}</mat-icon>
          {{ product.stock > 0 ? 'En stock (' + product.stock + ' disponibles)' : 'Rupture de stock' }}
        </div>
        <div class="qv-actions">
          <button mat-flat-button color="primary" class="qv-add-btn" (click)="addToCart()" [disabled]="product.stock === 0">
            <mat-icon>add_shopping_cart</mat-icon> Ajouter au panier
          </button>
          <a [routerLink]="['/products', product.id]" mat-stroked-button (click)="dialogRef.close()">
            Voir le détail
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .qv-dialog { display: flex; flex-direction: column; max-height: 90vh; }
    .qv-close { position: absolute; top: 8px; right: 8px; z-index: 10; }
    .qv-image { position: relative; height: 260px; overflow: hidden; background: #f9fafb; }
    .qv-image img { width: 100%; height: 100%; object-fit: cover; }
    .qv-badge { position: absolute; top: 12px; left: 12px; background: #ef4444; color: white; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
    .qv-body { padding: 1.25rem; overflow-y: auto; }
    .qv-vendor { font-size: 0.8rem; color: #10b981; font-weight: 600; margin: 0 0 0.25rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .qv-title { font-size: 1.25rem; font-weight: 700; color: #1f2937; margin: 0 0 0.75rem; }
    .qv-rating { display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.75rem; }
    .star { color: #d1d5db; font-size: 1rem; }
    .star.filled { color: #f59e0b; }
    .qv-reviews { font-size: 0.8rem; color: #6b7280; margin-left: 0.25rem; }
    .qv-price { display: flex; align-items: baseline; gap: 0.5rem; margin-bottom: 0.75rem; }
    .qv-compare { text-decoration: line-through; color: #9ca3af; font-size: 0.9rem; }
    .qv-main-price { font-size: 1.5rem; font-weight: 800; color: #10b981; }
    .qv-unit { font-size: 0.8rem; color: #6b7280; }
    .qv-desc { font-size: 0.9rem; color: #6b7280; line-height: 1.6; margin-bottom: 0.75rem; }
    .qv-stock { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem; }
    .qv-stock.in-stock { color: #10b981; }
    .qv-stock.out-stock { color: #ef4444; }
    .qv-stock mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .qv-actions { display: flex; flex-direction: column; gap: 0.5rem; }
    .qv-add-btn { width: 100%; }
  `]
})
export class ProductQuickViewDialogComponent {
  dialogRef = inject(MatDialogRef<ProductQuickViewDialogComponent>);
  product = inject<Product>(MAT_DIALOG_DATA);
  private cartService = inject(CartService);
  private notification = inject(NotificationService);

  get hasDiscount() { return !!this.product.compareAtPrice && this.product.compareAtPrice > this.product.price; }
  get discountPct() {
    if (!this.hasDiscount || !this.product.compareAtPrice) return 0;
    return Math.round(((this.product.compareAtPrice - this.product.price) / this.product.compareAtPrice) * 100);
  }
  addToCart() {
    this.cartService.addToCart(this.product);
    this.notification.success(`"${this.product.name}" ajouté au panier !`);
    this.dialogRef.close();
  }
}

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
        MatDialogModule
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
          <button mat-mini-fab color="white" class="!bg-white !text-gray-800" matTooltip="Aperçu rapide" (click)="openQuickView($event)">
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
    @Input() viewMode: 'grid' | 'list' = 'grid';
    @Output() addCart = new EventEmitter<Product>();

    private cartService = inject(CartService);
    private dialog = inject(MatDialog);

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

    openQuickView(event: Event) {
        event.stopPropagation();
        event.preventDefault();
        this.dialog.open(ProductQuickViewDialogComponent, {
            data: this.product,
            width: '480px',
            maxHeight: '90vh'
        });
    }
}
