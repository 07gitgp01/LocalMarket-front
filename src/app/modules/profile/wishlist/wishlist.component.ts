import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Product } from '@shared/models/product.model';
import { ProductService } from '@core/services/product.service';
import { CartService } from '@core/services/cart.service';

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
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Ma Liste de Souhaits</h2>

    <div *ngIf="wishlist.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
      <mat-icon class="text-6xl text-gray-300 mb-4">favorite_border</mat-icon>
      <p class="text-gray-500 mb-4">Votre liste de souhaits est vide.</p>
      <a routerLink="/products" mat-stroked-button color="primary">Explorer les produits</a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="wishlist.length > 0">
      <mat-card *ngFor="let product of wishlist" class="flex flex-col h-full hover:shadow-lg transition-shadow">
        <div class="relative aspect-video overflow-hidden">
          <img [src]="product.images[0]" class="w-full h-full object-cover">
          <button mat-icon-button color="warn" class="absolute top-2 right-2 bg-white" (click)="removeFromWishlist(product.id)">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <div class="p-4 flex-grow flex flex-col">
          <h3 class="font-bold text-lg mb-1 truncate">{{ product.name }}</h3>
          <div class="text-green-700 font-bold mb-4">{{ product.price | number }} FCFA</div>
          
          <div class="mt-auto flex gap-2">
            <button mat-flat-button color="primary" class="flex-grow" (click)="addToCart(product)">
              <mat-icon>shopping_cart</mat-icon> Ajouter
            </button>
          </div>
        </div>
      </mat-card>
    </div>
  `
})
export class WishlistComponent implements OnInit {
    wishlist: Product[] = [];

    constructor(
        private productService: ProductService,
        private cartService: CartService
    ) { }

    ngOnInit() {
        // Mock: fetch wishlist from local storage or service
        // For now, load some random products
        this.productService.getProducts().subscribe(products => {
            this.wishlist = products.slice(0, 3);
        });
    }

    removeFromWishlist(id: number) {
        this.wishlist = this.wishlist.filter(p => p.id !== id);
        // Call service to update
    }

    addToCart(product: Product) {
        this.cartService.addToCart(product);
    }
}
