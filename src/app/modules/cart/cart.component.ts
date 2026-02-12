import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule
  ],
  template: `
    <div class="cart-container">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <a routerLink="/">Accueil</a>
        <mat-icon>chevron_right</mat-icon>
        <span>Panier</span>
      </div>

      <!-- Page Title -->
      <div class="page-header">
        <h1>Panier d'achat</h1>
        <p>{{ cartCount() }} article(s) dans votre panier</p>
      </div>

      <!-- Empty Cart -->
      <div *ngIf="cartCount() === 0" class="empty-cart">
        <div class="empty-icon">
          <mat-icon>shopping_cart</mat-icon>
        </div>
        <h2>Votre panier est vide</h2>
        <p>Découvrez nos produits locaux authentiques et remplissez votre panier !</p>
        <a routerLink="/products" mat-flat-button color="primary" class="shop-btn">
          <mat-icon>storefront</mat-icon>
          Commencer mes achats
        </a>
      </div>

      <!-- Cart with Items -->
      <div *ngIf="cartCount() > 0" class="cart-content">
        
        <!-- Cart Table -->
        <div class="cart-table-container">
          <div class="cart-table">
            <!-- Table Header -->
            <div class="table-header">
              <div class="col-product">Produit</div>
              <div class="col-price">Prix</div>
              <div class="col-quantity">Quantité</div>
              <div class="col-subtotal">Sous-total</div>
            </div>

            <!-- Table Body -->
            <div class="table-body">
              <div class="cart-item" *ngFor="let item of cartItems()">
                <!-- Remove Button -->
                <button class="remove-btn" (click)="removeItem(item.productId)" matTooltip="Supprimer">
                  <mat-icon>close</mat-icon>
                </button>

                <!-- Product Info -->
                <div class="product-info">
                  <a [routerLink]="['/products', item.productId]" class="product-image">
                    <img [src]="item.product?.images?.[0]" [alt]="item.product?.name">
                  </a>
                  <div class="product-details">
                    <a [routerLink]="['/products', item.productId]" class="product-name">
                      {{ item.product?.name }}
                    </a>
                    <p class="product-meta">{{ item.product?.unit || 'Unité' }}</p>
                  </div>
                </div>

                <!-- Price -->
                <div class="product-price">
                  {{ item.product?.price | number }} FCFA
                </div>

                <!-- Quantity Controls -->
                <div class="quantity-controls">
                  <button 
                    class="qty-btn" 
                    (click)="updateQuantity(item.productId, item.quantity - 1)"
                    [disabled]="item.quantity <= 1"
                  >
                    <mat-icon>remove</mat-icon>
                  </button>
                  <input 
                    type="number" 
                    class="qty-input" 
                    [value]="item.quantity"
                    (change)="onQuantityChange($event, item.productId)"
                    min="1"
                  >
                  <button 
                    class="qty-btn" 
                    (click)="updateQuantity(item.productId, item.quantity + 1)"
                  >
                    <mat-icon>add</mat-icon>
                  </button>
                </div>

                <!-- Subtotal -->
                <div class="product-subtotal">
                  {{ (item.product?.price || 0) * item.quantity | number }} FCFA
                </div>
              </div>
            </div>
          </div>

          <!-- Cart Actions -->
          <div class="cart-actions">
            <div class="coupon-section">
              <input 
                type="text" 
                class="coupon-input" 
                placeholder="Code promo"
                [(ngModel)]="promoCode"
              >
              <button mat-stroked-button class="apply-coupon-btn" (click)="applyCoupon()">
                Appliquer le coupon
              </button>
            </div>
            <button mat-stroked-button color="warn" class="clear-cart-btn" (click)="clearCart()">
              <mat-icon>delete_outline</mat-icon>
              Vider le panier
            </button>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <h3>Résumé de commande</h3>
          
          <div class="summary-content">
            <div class="summary-row">
              <span class="label">Articles ({{ cartCount() }})</span>
              <span class="value">{{ subtotal() | number }} FCFA</span>
            </div>

            <div class="summary-row">
              <span class="label">Sous-total</span>
              <span class="value">{{ subtotal() | number }} FCFA</span>
            </div>

            <div class="summary-row">
              <span class="label">Livraison</span>
              <span class="value">{{ shippingCost | number }} FCFA</span>
            </div>

            <div class="summary-row">
              <span class="label">Taxes</span>
              <span class="value free">Offertes</span>
            </div>

            <div class="summary-row discount" *ngIf="discount > 0">
              <span class="label">Réduction</span>
              <span class="value">- {{ discount | number }} FCFA</span>
            </div>

            <mat-divider></mat-divider>

            <div class="summary-row total">
              <span class="label">Total</span>
              <span class="value">{{ total() | number }} FCFA</span>
            </div>
          </div>

          <a routerLink="/checkout" mat-flat-button color="primary" class="checkout-btn">
            Procéder au paiement
            <mat-icon>arrow_forward</mat-icon>
          </a>

          <a routerLink="/products" class="continue-shopping">
            <mat-icon>arrow_back</mat-icon>
            Continuer mes achats
          </a>

          <!-- Payment Methods -->
          <div class="payment-methods">
            <p>Paiement sécurisé</p>
            <div class="payment-icons">
              <div class="payment-icon orange-money">
                <span>OM</span>
              </div>
              <div class="payment-icon moov">
                <span>Moov</span>
              </div>
              <div class="payment-icon wave">
                <span>Wave</span>
              </div>
              <div class="payment-icon visa">
                <mat-icon>credit_card</mat-icon>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    /* Breadcrumb */
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
      font-size: 0.9rem;
    }

    .breadcrumb a {
      color: #6b7280;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .breadcrumb a:hover {
      color: #10b981;
    }

    .breadcrumb mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #9ca3af;
    }

    .breadcrumb span {
      color: #1f2937;
      font-weight: 600;
    }

    /* Page Header */
    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .page-header p {
      color: #6b7280;
      font-size: 1rem;
      margin: 0;
    }

    /* Empty Cart */
    .empty-cart {
      background: white;
      border-radius: 16px;
      padding: 4rem 2rem;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      width: 120px;
      height: 120px;
      margin: 0 auto 2rem;
      background: linear-gradient(135deg, #f0fdf4, #d1fae5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-icon mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #10b981;
    }

    .empty-cart h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 1rem 0;
    }

    .empty-cart p {
      color: #6b7280;
      font-size: 1.1rem;
      margin: 0 0 2rem 0;
    }

    .shop-btn {
      height: 56px !important;
      padding: 0 2rem !important;
      font-size: 1.1rem !important;
      font-weight: 600 !important;
    }

    /* Cart Content */
    .cart-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
    }

    @media (max-width: 1024px) {
      .cart-content {
        grid-template-columns: 1fr;
      }
    }

    /* Cart Table */
    .cart-table-container {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .cart-table {
      margin-bottom: 2rem;
    }

    .table-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1.5fr 1fr;
      gap: 1rem;
      padding: 1rem 3rem 1rem 1rem;
      background: #10b981;
      color: white;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
      .table-header {
        display: none;
      }
    }

    .table-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* Cart Item */
    .cart-item {
      position: relative;
      display: grid;
      grid-template-columns: 2fr 1fr 1.5fr 1fr;
      gap: 1rem;
      align-items: center;
      padding: 1.5rem 3rem 1.5rem 1rem;
      background: #f9fafb;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .cart-item:hover {
      background: #f3f4f6;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    @media (max-width: 768px) {
      .cart-item {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    .remove-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 32px;
      height: 32px;
      border: none;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .remove-btn:hover {
      background: #fee2e2;
      color: #ef4444;
      transform: scale(1.1);
    }

    .remove-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Product Info */
    .product-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .product-image {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
      border-radius: 8px;
      overflow: hidden;
      background: white;
      border: 1px solid #e5e7eb;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-details {
      flex: 1;
    }

    .product-name {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      text-decoration: none;
      display: block;
      margin-bottom: 0.25rem;
      transition: color 0.3s ease;
    }

    .product-name:hover {
      color: #10b981;
    }

    .product-meta {
      font-size: 0.85rem;
      color: #6b7280;
      margin: 0;
    }

    /* Price */
    .product-price {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1f2937;
    }

    /* Quantity Controls */
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 0.25rem;
      width: fit-content;
    }

    .qty-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #6b7280;
    }

    .qty-btn:hover:not(:disabled) {
      background: #f3f4f6;
      color: #10b981;
    }

    .qty-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .qty-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .qty-input {
      width: 50px;
      text-align: center;
      border: none;
      background: transparent;
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      outline: none;
    }

    .qty-input::-webkit-inner-spin-button,
    .qty-input::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Subtotal */
    .product-subtotal {
      font-size: 1.25rem;
      font-weight: 800;
      color: #10b981;
      text-align: right;
    }

    /* Cart Actions */
    .cart-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .coupon-section {
      display: flex;
      gap: 0.75rem;
      flex: 1;
      min-width: 300px;
    }

    .coupon-input {
      flex: 1;
      padding: 0.875rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .coupon-input:focus {
      outline: none;
      border-color: #10b981;
    }

    .apply-coupon-btn {
      white-space: nowrap;
    }

    .clear-cart-btn {
      white-space: nowrap;
    }

    /* Order Summary */
    .order-summary {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      height: fit-content;
      position: sticky;
      top: 100px;
    }

    .order-summary h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 1.5rem 0;
    }

    .summary-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.95rem;
    }

    .summary-row .label {
      color: #6b7280;
    }

    .summary-row .value {
      font-weight: 600;
      color: #1f2937;
    }

    .summary-row .value.free {
      color: #10b981;
    }

    .summary-row.discount .value {
      color: #ef4444;
    }

    .summary-row.total {
      margin-top: 1rem;
      padding-top: 1rem;
      font-size: 1.25rem;
    }

    .summary-row.total .label {
      color: #1f2937;
      font-weight: 700;
    }

    .summary-row.total .value {
      font-size: 1.5rem;
      font-weight: 800;
      color: #10b981;
    }

    .checkout-btn {
      width: 100%;
      height: 56px !important;
      font-size: 1.1rem !important;
      font-weight: 600 !important;
      margin-bottom: 1rem;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0.5rem !important;
    }

    .continue-shopping {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: #6b7280;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      padding: 0.75rem;
      transition: color 0.3s ease;
    }

    .continue-shopping:hover {
      color: #10b981;
    }

    .continue-shopping mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Payment Methods */
    .payment-methods {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
      text-align: center;
    }

    .payment-methods p {
      font-size: 0.85rem;
      color: #6b7280;
      margin: 0 0 1rem 0;
    }

    .payment-icons {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .payment-icon {
      width: 56px;
      height: 36px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      transition: all 0.3s ease;
    }

    .payment-icon:hover {
      border-color: #10b981;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
    }

    .payment-icon.orange-money {
      background: #ff6b00;
      color: white;
      border-color: #ff6b00;
    }

    .payment-icon.moov {
      background: #009fe3;
      color: white;
      border-color: #009fe3;
    }

    .payment-icon.wave {
      background: #00d9a3;
      color: white;
      border-color: #00d9a3;
    }

    .payment-icon.visa {
      color: #1a1f71;
    }
  `]
})
export class CartComponent {
  cartItems = this.cartService.cartItems;
  cartCount = this.cartService.itemCount;
  subtotal = this.cartService.totalAmount;

  shippingCost = 2000;
  discount = 0;
  promoCode = '';

  total = computed(() => this.subtotal() + this.shippingCost - this.discount);

  constructor(private cartService: CartService) { }

  updateQuantity(productId: number, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  onQuantityChange(event: any, productId: number) {
    const quantity = parseInt(event.target.value);
    if (quantity > 0) {
      this.updateQuantity(productId, quantity);
    }
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      this.cartService.clearCart();
    }
  }

  applyCoupon() {
    if (this.promoCode.toLowerCase() === 'welcome10') {
      this.discount = this.subtotal() * 0.1;
      alert('Code promo appliqué ! -10% de réduction');
    } else if (this.promoCode) {
      alert('Code promo invalide');
    }
  }
}
