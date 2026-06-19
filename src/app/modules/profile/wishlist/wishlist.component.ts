import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Product } from '@shared/models/product.model';
import { WishlistService } from '@core/services/wishlist.service';
import { CartService } from '@core/services/cart.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
    selector: 'app-wishlist',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MatCardModule
    ],
    template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Ma Liste de Souhaits</h2>
      <span class="text-sm text-gray-500">{{ wishlistService.itemCount() }} article(s)</span>
    </div>

    <div *ngIf="wishlistService.itemCount() === 0" class="text-center py-12 bg-gray-50 rounded-lg">
      <mat-icon class="text-6xl text-gray-300 mb-4" style="font-size:64px;width:64px;height:64px">favorite_border</mat-icon>
      <p class="text-gray-500 mb-4">Votre liste de souhaits est vide.</p>
      <a routerLink="/products" mat-stroked-button color="primary">Explorer les produits</a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="wishlistService.itemCount() > 0">
      <mat-card *ngFor="let item of wishlistService.wishlistItems()" class="flex flex-col h-full hover:shadow-lg transition-shadow">
        <div class="relative aspect-video overflow-hidden" *ngIf="item.product">
          <img [src]="item.product.images[0]" [alt]="item.product.name" class="w-full h-full object-cover">
          <button mat-icon-button color="warn" class="absolute top-2 right-2 bg-white" (click)="removeFromWishlist(item.product.id)">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <div class="p-4 flex-grow flex flex-col" *ngIf="item.product">
          <a [routerLink]="['/products', item.product.id]" class="font-bold text-lg mb-1 truncate text-gray-800 hover:text-green-700 no-underline">
            {{ item.product.name }}
          </a>
          <p class="text-xs text-gray-400 mb-2">Ajouté le {{ item.addedAt | date:'dd/MM/yyyy' }}</p>
          <div class="text-green-700 font-bold text-xl mb-4">{{ item.product.price | number }} FCFA</div>

          <div class="mt-auto flex gap-2">
            <button mat-flat-button color="primary" class="flex-grow" (click)="addToCart(item.product)">
              <mat-icon>shopping_cart</mat-icon> Ajouter au panier
            </button>
          </div>
        </div>
      </mat-card>
    </div>
  `
})
export class WishlistComponent {
    wishlistService = inject(WishlistService);
    private cartService = inject(CartService);
    private notification = inject(NotificationService);

    removeFromWishlist(productId: number) {
        this.wishlistService.removeFromWishlist(productId);
    }

    addToCart(product: Product) {
        this.cartService.addToCart(product);
        this.notification.success(`"${product.name}" ajouté au panier !`);
    }
}
