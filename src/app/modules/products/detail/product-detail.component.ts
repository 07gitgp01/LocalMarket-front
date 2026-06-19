import { Component, OnInit, inject, signal, computed, Inject } from '@angular/core';
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
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-image-zoom-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="zoom-dialog">
      <button mat-icon-button class="close-btn" (click)="dialogRef.close()">
        <mat-icon>close</mat-icon>
      </button>
      <div class="zoom-image-wrapper">
        <img [src]="images[currentIndex]" [alt]="'Image ' + (currentIndex + 1)" class="zoom-image">
      </div>
      <div class="zoom-controls" *ngIf="images.length > 1">
        <button mat-icon-button (click)="prev()" [disabled]="currentIndex === 0">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <span class="zoom-counter">{{ currentIndex + 1 }} / {{ images.length }}</span>
        <button mat-icon-button (click)="next()" [disabled]="currentIndex === images.length - 1">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
      <div class="zoom-thumbnails" *ngIf="images.length > 1">
        <img *ngFor="let img of images; let i = index" [src]="img" class="thumb"
          [class.active]="i === currentIndex" (click)="currentIndex = i">
      </div>
    </div>
  `,
  styles: [`
    .zoom-dialog { display: flex; flex-direction: column; align-items: center; background: #000; position: relative; min-height: 60vh; }
    .close-btn { position: absolute; top: 8px; right: 8px; color: white; z-index: 10; background: rgba(255,255,255,0.15); }
    .zoom-image-wrapper { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .zoom-image { max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 4px; }
    .zoom-controls { display: flex; align-items: center; gap: 1rem; color: white; padding: 0.5rem; }
    .zoom-controls button { color: white; }
    .zoom-counter { font-size: 0.9rem; min-width: 60px; text-align: center; }
    .zoom-thumbnails { display: flex; gap: 0.5rem; padding: 0.75rem; overflow-x: auto; }
    .thumb { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; cursor: pointer; opacity: 0.6; border: 2px solid transparent; transition: all 0.2s; }
    .thumb.active { opacity: 1; border-color: #10b981; }
    .thumb:hover { opacity: 0.9; }
  `]
})
export class ImageZoomDialogComponent {
  dialogRef = inject(MatDialogRef<ImageZoomDialogComponent>);
  data = inject<{ images: string[]; startIndex: number }>(MAT_DIALOG_DATA);
  images = this.data.images;
  currentIndex = this.data.startIndex;
  prev() { if (this.currentIndex > 0) this.currentIndex--; }
  next() { if (this.currentIndex < this.images.length - 1) this.currentIndex++; }
}

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
    CommonModule, RouterLink, FormsModule,
    MatButtonModule, MatIconModule, MatTabsModule, MatChipsModule,
    MatProgressSpinnerModule, MatDividerModule, MatCardModule, MatBadgeModule,
    MatSelectModule, MatFormFieldModule, MatPaginatorModule,
    MatDialogModule, MatTooltipModule,
    LoadingSpinnerComponent, EmptyStateComponent
  ],
  template: `
<app-loading-spinner *ngIf="isLoading" [fullscreen]="false" message="Chargement du produit..."></app-loading-spinner>

<div *ngIf="!isLoading && product" class="pd-page">

  <!-- ── BREADCRUMB ── -->
  <div class="bc-bar">
    <nav class="bc-nav">
      <a routerLink="/">Accueil</a>
      <mat-icon>chevron_right</mat-icon>
      <a routerLink="/products">Produits</a>
      <mat-icon>chevron_right</mat-icon>
      <a [routerLink]="['/products']" [queryParams]="{category: product.category}">{{ product.category }}</a>
      <mat-icon>chevron_right</mat-icon>
      <span>{{ product.name }}</span>
    </nav>
    <div class="bc-acts">
      <button class="bc-btn" (click)="toggleWishlist()"
              [matTooltip]="isInWishlist() ? 'Retirer des favoris' : 'Ajouter aux favoris'">
        <mat-icon [class.wl-on]="isInWishlist()">{{ isInWishlist() ? 'favorite' : 'favorite_border' }}</mat-icon>
      </button>
    </div>
  </div>

  <!-- ── MAIN ── -->
  <div class="pd-main">

    <!-- Gallery -->
    <div class="gallery-col">
      <div class="main-img-wrap" (click)="openImageZoom()">
        <img [src]="selectedImage || product.images[0]" [alt]="product.name" class="main-img">

        <div class="img-badges">
          <span class="ibadge ibadge-g" *ngIf="product.attributes?.['origin']">
            <mat-icon>place</mat-icon>{{ product.attributes?.['origin'] }}
          </span>
          <span class="ibadge ibadge-b" *ngIf="product.attributes?.['certification']">
            {{ product.attributes?.['certification'] }}
          </span>
          <span class="ibadge ibadge-gold" *ngIf="product.featured">⭐ Coup de cœur</span>
        </div>

        <div class="img-disc" *ngIf="product.compareAtPrice">
          -{{ getDiscountPct(product) }}%
        </div>

        <div class="img-zoom">
          <mat-icon>zoom_in</mat-icon>
        </div>
      </div>

      <div class="thumbs">
        <button *ngFor="let img of product.images; let i = index"
                class="thumb" [class.thumb-on]="selectedImage === img"
                (click)="selectedImage = img">
          <img [src]="img" [alt]="product.name">
        </button>
      </div>
    </div>

    <!-- Info -->
    <div class="info-col">

      <div class="info-top">
        <span class="cat-pill">{{ product.category }}</span>
        <span class="pid">#{{ product.id }}</span>
      </div>

      <h1 class="pname">{{ product.name }}</h1>

      <a class="vendor-row" routerLink="/vendors/{{product.vendorId}}">
        <div class="va">{{ (product.vendor?.shopName || 'V').charAt(0) }}</div>
        <div class="vi">
          <span class="vi-by">Vendu par</span>
          <span class="vi-name">{{ product.vendor?.shopName || 'Boutique Partenaire' }}</span>
        </div>
        <span class="v-verified" *ngIf="product.vendor?.verified">
          <mat-icon>verified</mat-icon> Vérifié
        </span>
        <mat-icon class="v-arr">chevron_right</mat-icon>
      </a>

      <div class="rating-row">
        <div class="stars">
          <mat-icon *ngFor="let s of [1,2,3,4,5]">{{ s <= product.rating ? 'star' : 'star_border' }}</mat-icon>
        </div>
        <span class="rv">{{ product.rating }}</span>
        <span class="rc">({{ product.reviewCount }} avis)</span>
        <span class="dot">•</span>
        <div class="stock-pill"
             [class.sp-ok]="product.stock > 20"
             [class.sp-low]="product.stock > 0 && product.stock <= 20"
             [class.sp-out]="product.stock <= 0">
          <span class="sp-dot"></span>
          {{ product.stock > 20 ? 'En stock (' + product.stock + ')' :
             product.stock > 0  ? 'Stock limité (' + product.stock + ')' : 'Rupture' }}
        </div>
      </div>

      <div class="price-block">
        <span class="price-main">{{ product.price | number:'1.0-0' }} FCFA</span>
        <div class="price-row" *ngIf="product.compareAtPrice">
          <span class="price-old">{{ product.compareAtPrice | number:'1.0-0' }} FCFA</span>
          <span class="price-save">Économisez {{ product.compareAtPrice - product.price | number:'1.0-0' }} FCFA</span>
        </div>
        <span class="price-unit">/ {{ product.unit }}</span>
      </div>

      <p class="pdesc">{{ product.description }}</p>

      <div class="tags-row" *ngIf="product.tags?.length">
        <span *ngFor="let t of product.tags" class="tag">#{{ t }}</span>
      </div>

      <div class="limits" *ngIf="product.minOrder || product.maxOrder">
        <div *ngIf="product.minOrder"><mat-icon>info_outline</mat-icon>Min: {{ product.minOrder }} {{ product.unit }}</div>
        <div *ngIf="product.maxOrder"><mat-icon>info_outline</mat-icon>Max: {{ product.maxOrder }} {{ product.unit }}</div>
      </div>

      <div class="cta-row">
        <div class="qty">
          <button (click)="decrementQuantity()" [disabled]="quantity <= (product.minOrder || 1)">
            <mat-icon>remove</mat-icon>
          </button>
          <input type="number" [(ngModel)]="quantity" (change)="validateQuantity()"
                 [min]="product.minOrder || 1" [max]="product.maxOrder || product.stock">
          <button (click)="incrementQuantity()" [disabled]="quantity >= (product.maxOrder || product.stock)">
            <mat-icon>add</mat-icon>
          </button>
        </div>
        <button class="btn-cart" (click)="addToCart()" [disabled]="product.stock <= 0">
          <mat-icon>shopping_cart</mat-icon>
          {{ product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock' }}
        </button>
        <button class="btn-wl" (click)="toggleWishlist()" [class.btn-wl-on]="isInWishlist()">
          <mat-icon>{{ isInWishlist() ? 'favorite' : 'favorite_border' }}</mat-icon>
        </button>
      </div>

      <div class="trust-grid">
        <div class="trust-item">
          <div class="ti-icon ti-g"><mat-icon>verified_user</mat-icon></div>
          <span>Paiement sécurisé</span>
        </div>
        <div class="trust-item">
          <div class="ti-icon ti-b"><mat-icon>local_shipping</mat-icon></div>
          <span>Livraison nationale</span>
        </div>
        <div class="trust-item">
          <div class="ti-icon ti-a"><mat-icon>published_with_changes</mat-icon></div>
          <span>Retour gratuit 7j</span>
        </div>
        <div class="trust-item">
          <div class="ti-icon ti-p"><mat-icon>support_agent</mat-icon></div>
          <span>Support 24/7</span>
        </div>
      </div>
    </div>
  </div>

  <!-- ── TABS ── -->
  <div class="tabs-wrap">
    <mat-tab-group animationDuration="0ms">

      <mat-tab label="Description">
        <div class="tab-body">
          <h3>À propos de ce produit</h3>
          <p>{{ product.description }}</p>
          <h4>Caractéristiques</h4>
          <div class="attrs">
            <div class="attr">
              <span class="ak">Origine</span>
              <span class="av">{{ product.attributes?.['origin'] ?? 'Burkina Faso' }}</span>
            </div>
            <div class="attr">
              <span class="ak">Catégorie</span>
              <span class="av">{{ product.category }}</span>
            </div>
            <div class="attr" *ngIf="product.attributes?.['weight']">
              <span class="ak">Poids</span>
              <span class="av">{{ product.attributes?.['weight'] }}</span>
            </div>
            <div class="attr">
              <span class="ak">Unité</span>
              <span class="av">{{ product.unit }}</span>
            </div>
          </div>
        </div>
      </mat-tab>

      <mat-tab>
        <ng-template mat-tab-label>
          Avis clients
          <span class="tab-cnt">{{ reviews.length }}</span>
        </ng-template>
        <div class="tab-body">

          <!-- Skeleton while loading -->
          <div class="rv-skeleton" *ngIf="isLoadingReviews">
            <div class="sk sk-w50"></div>
            <div class="sk sk-w80" style="margin-top:.5rem"></div>
            <div class="sk sk-w60" style="margin-top:.5rem"></div>
          </div>

          <ng-container *ngIf="!isLoadingReviews">

            <div class="rv-summary" *ngIf="reviews.length > 0">
              <div class="rsum-score">
                <div class="rsum-big">{{ product.rating }}</div>
                <div class="rsum-stars">
                  <mat-icon *ngFor="let s of [1,2,3,4,5]">{{ s <= product.rating ? 'star' : 'star_border' }}</mat-icon>
                </div>
                <div class="rsum-lbl">{{ reviews.length }} avis</div>
              </div>
              <div class="rsum-bars">
                <div *ngFor="let r of [5,4,3,2,1]" class="rsb">
                  <span class="rsb-l">{{ r }}★</span>
                  <div class="rsb-track"><div class="rsb-fill" [style.width.%]="getReviewPercentage(r)"></div></div>
                  <span class="rsb-c">{{ getReviewCount(r) }}</span>
                </div>
              </div>
              <button class="btn-write">
                <mat-icon>rate_review</mat-icon> Écrire un avis
              </button>
            </div>

            <div class="rv-filters" *ngIf="reviews.length > 0">
              <mat-form-field class="rf">
                <mat-label>Note</mat-label>
                <mat-select [(value)]="selectedRatingFilter" (selectionChange)="filterReviews()">
                  <mat-option [value]="0">Toutes</mat-option>
                  <mat-option *ngFor="let r of [5,4,3,2,1]" [value]="r">{{ r }} ★</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field class="rf">
                <mat-label>Trier</mat-label>
                <mat-select [(value)]="selectedSortOption" (selectionChange)="sortReviews()">
                  <mat-option value="recent">Plus récents</mat-option>
                  <mat-option value="helpful">Plus utiles</mat-option>
                  <mat-option value="rating-high">Note ↓</mat-option>
                  <mat-option value="rating-low">Note ↑</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <app-empty-state
              *ngIf="reviews.length === 0"
              icon="rate_review" title="Aucun avis"
              description="Soyez le premier à donner votre avis!"
              actionText="Écrire un avis">
            </app-empty-state>

            <div *ngIf="filteredReviews.length === 0 && reviews.length > 0" class="rv-no-match">
              Aucun avis ne correspond à ce filtre.
            </div>

            <div class="rv-list">
              <div *ngFor="let review of paginatedReviews" class="rv-card"
                   [class.rv5]="review.rating === 5"
                   [class.rv4]="review.rating === 4"
                   [class.rv3]="review.rating === 3"
                   [class.rv-low]="review.rating <= 2">
                <div class="rv-top">
                  <div class="rv-av">{{ getInitials(review.userId) }}</div>
                  <div class="rv-meta">
                    <div class="rv-user">Client {{ review.userId }}</div>
                    <div class="rv-date">{{ getTimeAgo(review.createdAt) }}</div>
                  </div>
                  <div class="rv-stars">
                    <mat-icon *ngFor="let s of [1,2,3,4,5]">{{ s <= review.rating ? 'star' : 'star_border' }}</mat-icon>
                  </div>
                </div>
                <h4 class="rv-title">{{ review.title }}</h4>
                <p class="rv-comment">{{ review.comment }}</p>
                <div class="rv-foot">
                  <button class="rv-helpful"><mat-icon>thumb_up</mat-icon> Utile ({{ review.helpful }})</button>
                  <span class="rv-verified" *ngIf="review.verified">
                    <mat-icon>verified</mat-icon> Achat vérifié
                  </span>
                </div>
              </div>
            </div>

            <mat-paginator
              *ngIf="filteredReviews.length > pageSize"
              [length]="filteredReviews.length" [pageSize]="pageSize"
              [pageSizeOptions]="[5,10,20]" (page)="onPageChange($event)">
            </mat-paginator>
          </ng-container>
        </div>
      </mat-tab>

      <mat-tab label="Vendeur">
        <div class="tab-body" *ngIf="product.vendor">
          <div class="vc">
            <img [src]="product.vendor.logo" class="vc-logo">
            <div class="vc-info">
              <h3>{{ product.vendor.shopName }}</h3>
              <p>{{ product.vendor.description }}</p>
              <div class="vc-meta">
                <span><mat-icon>place</mat-icon>{{ product.vendor.location.city }}</span>
                <span><mat-icon>inventory_2</mat-icon>{{ product.vendor.productCount }} produits</span>
              </div>
              <button class="btn-visit" [routerLink]="['/vendors', product.vendor.id]">
                <mat-icon>store</mat-icon> Visiter la boutique
              </button>
            </div>
          </div>
        </div>
      </mat-tab>
    </mat-tab-group>
  </div>

  <!-- ── SIMILAR PRODUCTS ── -->
  <div class="sim-section" *ngIf="!isLoadingSimilar && similarProducts.length > 0">
    <div class="sim-head">
      <h2>Produits similaires</h2>
      <a routerLink="/products" [queryParams]="{category: product.category}" class="see-all">
        Voir tout <mat-icon>arrow_forward</mat-icon>
      </a>
    </div>
    <div class="sim-grid">
      <div *ngFor="let sim of similarProducts" class="sim-card" [routerLink]="['/products', sim.id]">
        <div class="sim-img">
          <img [src]="sim.images[0]" [alt]="sim.name">
          <div class="sim-wl-btn"><mat-icon>favorite_border</mat-icon></div>
          <div class="sim-disc" *ngIf="sim.compareAtPrice">-{{ getDiscountPct(sim) }}%</div>
        </div>
        <div class="sim-body">
          <div class="sim-stars">
            <mat-icon *ngFor="let s of [1,2,3,4,5]">{{ s <= sim.rating ? 'star' : 'star_border' }}</mat-icon>
            <span>({{ sim.reviewCount }})</span>
          </div>
          <h3 class="sim-name">{{ sim.name }}</h3>
          <div class="sim-price">
            <span class="sp-main">{{ sim.price | number:'1.0-0' }} FCFA</span>
            <span class="sp-old" *ngIf="sim.compareAtPrice">{{ sim.compareAtPrice | number:'1.0-0' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Similar skeleton -->
  <div class="sim-section" *ngIf="isLoadingSimilar">
    <div class="sk sk-title"></div>
    <div class="sim-grid">
      <div *ngFor="let i of [1,2,3,4]" class="sim-card-sk">
        <div class="sk-sq"></div>
        <div style="padding:1rem">
          <div class="sk sk-w60"></div>
          <div class="sk sk-w80" style="margin-top:.5rem"></div>
          <div class="sk sk-w40" style="margin-top:.5rem"></div>
        </div>
      </div>
    </div>
  </div>

</div>
  `,
  styles: [`
:host { display: block; background: #f8fafc; }

.pd-page {
  max-width: 1280px; margin: 0 auto; padding: 0 2rem 5rem;
  animation: fade-up .45s ease-out both;
}
@keyframes fade-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }

/* ── BREADCRUMB ── */
.bc-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 0; border-bottom: 1px solid #f1f5f9; margin-bottom: 2.5rem;
}
.bc-nav {
  display: flex; align-items: center; gap: .3rem;
  font-size: .83rem; flex-wrap: wrap;
}
.bc-nav a { color: #64748b; text-decoration: none; transition: color .15s; }
.bc-nav a:hover { color: #10b981; }
.bc-nav mat-icon { font-size: 14px; width: 14px; height: 14px; color: #cbd5e1; }
.bc-nav span { color: #1e293b; font-weight: 600; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bc-acts { display: flex; gap: .5rem; }
.bc-btn {
  width: 36px; height: 36px; border-radius: 10px;
  border: 1.5px solid #e2e8f0; background: white; cursor: pointer;
  color: #64748b; display: flex; align-items: center; justify-content: center; transition: all .2s;
}
.bc-btn:hover { border-color: #ef4444; color: #ef4444; }
.bc-btn mat-icon { font-size: 18px; }
.wl-on { color: #ef4444 !important; }

/* ── MAIN ── */
.pd-main {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 4rem; margin-bottom: 4rem; align-items: start;
}

/* Gallery */
.gallery-col { position: sticky; top: 80px; }
.main-img-wrap {
  position: relative; border-radius: 22px; overflow: hidden;
  cursor: zoom-in; background: #f1f5f9; aspect-ratio: 1;
}
.main-img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.main-img-wrap:hover .main-img { transform: scale(1.07); }

.img-badges { position: absolute; top: 1rem; left: 1rem; display: flex; flex-direction: column; gap: .4rem; }
.ibadge {
  display: inline-flex; align-items: center; gap: .3rem;
  font-size: .72rem; font-weight: 700; padding: .3rem .75rem; border-radius: 999px;
  backdrop-filter: blur(8px);
}
.ibadge mat-icon { font-size: 12px; width: 12px; height: 12px; }
.ibadge-g  { background: rgba(5,150,105,.9);   color: white; }
.ibadge-b  { background: rgba(37,99,235,.9);   color: white; }
.ibadge-gold { background: rgba(217,119,6,.9); color: white; }

.img-disc {
  position: absolute; top: 1rem; right: 1rem;
  background: #ef4444; color: white;
  font-size: .77rem; font-weight: 800;
  padding: .3rem .65rem; border-radius: 10px;
}
.img-zoom {
  position: absolute; bottom: 1rem; right: 1rem;
  background: rgba(0,0,0,.45); color: white;
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity .2s;
}
.main-img-wrap:hover .img-zoom { opacity: 1; }
.img-zoom mat-icon { font-size: 1.2rem; }

.thumbs { display: flex; gap: .625rem; margin-top: .875rem; overflow-x: auto; padding-bottom: .25rem; }
.thumb {
  width: 78px; height: 78px; flex-shrink: 0; border-radius: 14px; overflow: hidden;
  border: 2.5px solid transparent; background: none; padding: 0; cursor: pointer; transition: all .2s;
}
.thumb:hover { transform: translateY(-2px); }
.thumb-on { border-color: #10b981; box-shadow: 0 4px 12px rgba(16,185,129,.3); }
.thumb img { width: 100%; height: 100%; object-fit: cover; }

/* Info col */
.info-col { display: flex; flex-direction: column; gap: 0; }

.info-top { display: flex; align-items: center; gap: .75rem; margin-bottom: 1rem; }
.cat-pill {
  background: #f0fdf4; color: #059669;
  font-size: .77rem; font-weight: 700; padding: .3rem .9rem; border-radius: 999px;
  border: 1px solid #bbf7d0;
}
.pid { font-size: .73rem; color: #cbd5e1; }

.pname {
  font-size: clamp(1.7rem, 3vw, 2.5rem); font-weight: 900; color: #0f172a;
  line-height: 1.15; letter-spacing: -.025em; margin: 0 0 1.25rem;
}

.vendor-row {
  display: flex; align-items: center; gap: .875rem;
  padding: .875rem 1.125rem; border-radius: 16px;
  background: #f8fafc; border: 1px solid #f1f5f9;
  text-decoration: none; margin-bottom: 1.375rem; transition: all .2s;
}
.vendor-row:hover { background: #f0fdf4; border-color: #bbf7d0; }
.va {
  width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white; font-size: .9rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.vi { flex: 1; }
.vi-by { display: block; font-size: .7rem; color: #94a3b8; }
.vi-name { display: block; font-size: .9rem; font-weight: 700; color: #1e293b; }
.v-verified {
  display: flex; align-items: center; gap: .2rem;
  font-size: .72rem; font-weight: 700; color: #2563eb;
  background: #eff6ff; padding: .2rem .55rem; border-radius: 999px;
}
.v-verified mat-icon { font-size: 13px; width: 13px; height: 13px; }
.v-arr { color: #cbd5e1; font-size: 18px; }

.rating-row {
  display: flex; align-items: center; gap: .6rem; margin-bottom: 1.5rem; flex-wrap: wrap;
}
.stars { display: flex; color: #f59e0b; }
.stars mat-icon { font-size: 17px; width: 17px; height: 17px; }
.rv { font-size: .9rem; font-weight: 700; color: #1e293b; }
.rc { font-size: .82rem; color: #94a3b8; }
.dot { color: #e2e8f0; }
.stock-pill {
  display: flex; align-items: center; gap: .4rem;
  font-size: .77rem; font-weight: 700; padding: .3rem .8rem; border-radius: 999px;
}
.sp-ok  { background: #f0fdf4; color: #059669; }
.sp-low { background: #fff7ed; color: #d97706; }
.sp-out { background: #fef2f2; color: #dc2626; }
.sp-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.sp-ok  .sp-dot { background: #10b981; }
.sp-low .sp-dot { background: #f97316; animation: pulse-dot 1.5s ease-in-out infinite; }
.sp-out .sp-dot { background: #ef4444; }
@keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.6)} }

.price-block {
  padding: 1.5rem; border-radius: 18px; margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  border: 1.5px solid #bbf7d0;
}
.price-main {
  display: block; font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 900; color: #059669; line-height: 1; letter-spacing: -.03em;
}
.price-row { display: flex; align-items: center; gap: .75rem; margin-top: .4rem; }
.price-old { font-size: 1rem; color: #94a3b8; text-decoration: line-through; }
.price-save {
  background: #fef2f2; color: #dc2626;
  font-size: .74rem; font-weight: 700; padding: .2rem .55rem; border-radius: 999px;
}
.price-unit { display: block; font-size: .77rem; color: #94a3b8; margin-top: .3rem; }

.pdesc { font-size: .92rem; color: #475569; line-height: 1.7; margin-bottom: 1.25rem; }

.tags-row { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: 1.25rem; }
.tag { background: #f1f5f9; color: #64748b; font-size: .73rem; font-weight: 600; padding: .25rem .65rem; border-radius: 999px; }

.limits {
  background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px;
  padding: .75rem 1rem; margin-bottom: 1.25rem;
  font-size: .8rem; color: #92400e;
  display: flex; flex-direction: column; gap: .25rem;
}
.limits > div { display: flex; align-items: center; gap: .4rem; }
.limits mat-icon { font-size: 15px; width: 15px; height: 15px; }

.cta-row { display: flex; gap: .75rem; margin-bottom: 1.5rem; align-items: stretch; }
.qty {
  display: flex; align-items: center; flex-shrink: 0;
  border: 2px solid #e2e8f0; border-radius: 14px; overflow: hidden; transition: border-color .2s;
}
.qty:focus-within { border-color: #10b981; }
.qty button {
  width: 44px; height: 52px; border: none; background: transparent;
  cursor: pointer; color: #64748b; display: flex; align-items: center; justify-content: center;
  transition: all .2s;
}
.qty button:hover:not([disabled]) { background: #f0fdf4; color: #10b981; }
.qty button[disabled] { opacity: .4; cursor: not-allowed; }
.qty button mat-icon { font-size: 18px; }
.qty input {
  width: 50px; text-align: center; border: none; outline: none;
  font-size: 1rem; font-weight: 700; color: #0f172a; background: transparent;
}
.btn-cart {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: .5rem;
  background: linear-gradient(135deg, #10b981, #059669); color: white;
  border: none; border-radius: 14px; font-size: 1rem; font-weight: 700;
  cursor: pointer; min-height: 52px; padding: 0 1.25rem;
  box-shadow: 0 6px 20px rgba(16,185,129,.35); transition: all .2s;
}
.btn-cart:hover:not([disabled]) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(16,185,129,.45); }
.btn-cart[disabled] { opacity: .6; cursor: not-allowed; background: #94a3b8; box-shadow: none; transform: none; }
.btn-cart mat-icon { font-size: 1.15rem; }
.btn-wl {
  width: 52px; height: 52px; flex-shrink: 0;
  border: 2px solid #e2e8f0; border-radius: 14px;
  background: white; cursor: pointer; color: #94a3b8;
  display: flex; align-items: center; justify-content: center; transition: all .2s;
}
.btn-wl:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }
.btn-wl-on { border-color: #ef4444 !important; color: #ef4444 !important; background: #fef2f2 !important; }

.trust-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .625rem; }
.trust-item {
  display: flex; align-items: center; gap: .75rem;
  padding: .875rem 1rem; background: white;
  border: 1px solid #f1f5f9; border-radius: 14px;
  font-size: .79rem; color: #475569; font-weight: 500;
}
.ti-icon {
  width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.ti-icon mat-icon { font-size: 1.1rem; width: 1.1rem; height: 1.1rem; }
.ti-g { background: #d1fae5; } .ti-g mat-icon { color: #059669; }
.ti-b { background: #dbeafe; } .ti-b mat-icon { color: #2563eb; }
.ti-a { background: #fef9c3; } .ti-a mat-icon { color: #d97706; }
.ti-p { background: #ede9fe; } .ti-p mat-icon { color: #7c3aed; }

/* ── TABS ── */
.tabs-wrap {
  background: white; border-radius: 22px; overflow: hidden;
  border: 1px solid #f1f5f9; box-shadow: 0 4px 24px rgba(0,0,0,.06);
  margin-bottom: 3.5rem;
}
.tab-body { padding: 2.5rem; }
.tab-cnt {
  background: #f1f5f9; color: #64748b;
  font-size: .7rem; font-weight: 700; padding: .1rem .45rem; border-radius: 999px; margin-left: .4rem;
}
.tab-body h3 { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0 0 1rem; }
.tab-body h4 { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 1.5rem 0 .875rem; }
.tab-body p  { color: #475569; line-height: 1.7; margin: 0; }
.attrs { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px,1fr)); gap: .75rem; }
.attr { padding: .875rem 1rem; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 14px; }
.ak { display: block; font-size: .7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; margin-bottom: .2rem; }
.av { display: block; font-size: .9rem; font-weight: 700; color: #1e293b; }

/* Skeleton */
.sk {
  height: 14px; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%; border-radius: 7px;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.sk-w40 { width: 40%; } .sk-w50 { width: 50%; } .sk-w60 { width: 60%; } .sk-w80 { width: 80%; }
.sk-title { height: 28px; width: 220px; border-radius: 8px; margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%; animation: shimmer 1.5s infinite; }
.sk-sq { height: 200px; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%; animation: shimmer 1.5s infinite; }
.rv-skeleton { padding: .5rem 0; }

/* Reviews */
.rv-summary {
  display: grid; grid-template-columns: auto 1fr auto;
  gap: 2rem; padding: 1.5rem; background: #f8fafc; border-radius: 18px;
  margin-bottom: 1.5rem; align-items: center;
}
.rsum-big { font-size: 3.5rem; font-weight: 900; color: #0f172a; line-height: 1; }
.rsum-stars { display: flex; color: #f59e0b; margin: .35rem 0; }
.rsum-stars mat-icon { font-size: 1.1rem; }
.rsum-lbl { font-size: .77rem; color: #94a3b8; }
.rsb { display: flex; align-items: center; gap: .75rem; margin-bottom: .4rem; }
.rsb-l { font-size: .77rem; color: #64748b; width: 26px; text-align: right; flex-shrink: 0; }
.rsb-track { flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
.rsb-fill { height: 100%; background: #f59e0b; border-radius: 4px; transition: width .5s; }
.rsb-c { font-size: .73rem; color: #94a3b8; width: 18px; flex-shrink: 0; }
.btn-write {
  display: flex; align-items: center; gap: .5rem;
  background: #059669; color: white; border: none; border-radius: 12px;
  padding: .75rem 1.25rem; font-size: .875rem; font-weight: 700; cursor: pointer; transition: all .2s;
}
.btn-write:hover { background: #047857; transform: translateY(-1px); }
.btn-write mat-icon { font-size: 1rem; }

.rv-filters { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
.rf { width: 150px; }

.rv-no-match { text-align: center; padding: 2rem; color: #94a3b8; font-size: .9rem; }

.rv-list { display: flex; flex-direction: column; gap: 1rem; }
.rv-card {
  padding: 1.25rem; border-radius: 16px;
  border: 1.5px solid #f1f5f9; border-left-width: 4px;
  background: white;
}
.rv5 { border-left-color: #10b981; } .rv4 { border-left-color: #3b82f6; }
.rv3 { border-left-color: #f59e0b; } .rv-low { border-left-color: #ef4444; }
.rv-top { display: flex; align-items: center; gap: .75rem; margin-bottom: .75rem; }
.rv-av {
  width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
  background: linear-gradient(135deg,#10b981,#059669);
  color: white; font-size: .82rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.rv-meta { flex: 1; }
.rv-user { font-size: .85rem; font-weight: 700; color: #1e293b; }
.rv-date { font-size: .72rem; color: #94a3b8; }
.rv-stars { display: flex; color: #f59e0b; }
.rv-stars mat-icon { font-size: 15px; width: 15px; height: 15px; }
.rv-title { font-size: .9rem; font-weight: 700; color: #1e293b; margin: 0 0 .4rem; }
.rv-comment { font-size: .83rem; color: #475569; line-height: 1.6; margin: 0 0 .875rem; }
.rv-foot { display: flex; align-items: center; gap: 1rem; }
.rv-helpful {
  display: flex; align-items: center; gap: .35rem;
  font-size: .77rem; color: #94a3b8;
  background: none; border: none; cursor: pointer; padding: 0; transition: color .2s;
}
.rv-helpful:hover { color: #10b981; }
.rv-helpful mat-icon { font-size: 15px; }
.rv-verified { display: flex; align-items: center; gap: .25rem; font-size: .75rem; font-weight: 700; color: #2563eb; }
.rv-verified mat-icon { font-size: 14px; }

/* Vendor tab */
.vc { display: flex; gap: 1.5rem; align-items: flex-start; }
.vc-logo { width: 90px; height: 90px; object-fit: cover; border-radius: 16px; flex-shrink: 0; border: 2px solid #e2e8f0; }
.vc-info h3 { font-size: 1.2rem; font-weight: 800; color: #0f172a; margin: 0 0 .4rem; }
.vc-info p { font-size: .875rem; color: #64748b; line-height: 1.6; margin: 0 0 .875rem; }
.vc-meta { display: flex; gap: 1rem; font-size: .82rem; color: #64748b; margin-bottom: 1rem; }
.vc-meta span { display: flex; align-items: center; gap: .3rem; }
.vc-meta mat-icon { font-size: 15px; }
.btn-visit {
  display: inline-flex; align-items: center; gap: .5rem;
  background: white; color: #059669; border: 1.5px solid #bbf7d0; border-radius: 12px;
  padding: .7rem 1.25rem; font-size: .875rem; font-weight: 700; cursor: pointer; transition: all .2s;
}
.btn-visit:hover { background: #f0fdf4; border-color: #10b981; }
.btn-visit mat-icon { font-size: 1rem; }

/* ── SIMILAR ── */
.sim-section { padding-bottom: 2rem; }
.sim-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.sim-head h2 { font-size: 1.625rem; font-weight: 900; color: #0f172a; margin: 0; }
.see-all { display: flex; align-items: center; gap: .3rem; font-size: .85rem; font-weight: 700; color: #10b981; text-decoration: none; }
.see-all mat-icon { font-size: 16px; }
.sim-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.25rem; }
.sim-card {
  border-radius: 18px; overflow: hidden; cursor: pointer;
  background: white; border: 1px solid #f1f5f9; box-shadow: 0 2px 12px rgba(0,0,0,.06);
  transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s;
}
.sim-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,.12); }
.sim-img { position: relative; aspect-ratio: 1; overflow: hidden; background: #f8fafc; }
.sim-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
.sim-card:hover .sim-img img { transform: scale(1.07); }
.sim-wl-btn {
  position: absolute; top: .75rem; right: .75rem;
  background: rgba(255,255,255,.9); border-radius: 50%; width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .2s; color: #94a3b8;
}
.sim-card:hover .sim-wl-btn { opacity: 1; }
.sim-wl-btn mat-icon { font-size: 16px; }
.sim-disc {
  position: absolute; top: .75rem; left: .75rem;
  background: #ef4444; color: white; font-size: .7rem; font-weight: 800; padding: .2rem .5rem; border-radius: 8px;
}
.sim-body { padding: .875rem 1rem; }
.sim-stars { display: flex; align-items: center; gap: .25rem; margin-bottom: .35rem; }
.sim-stars mat-icon { font-size: 12px; width: 12px; height: 12px; color: #f59e0b; }
.sim-stars span { font-size: .72rem; color: #94a3b8; }
.sim-name {
  font-size: .875rem; font-weight: 700; color: #1e293b; margin: 0 0 .5rem;
  overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
}
.sim-card:hover .sim-name { color: #059669; }
.sim-price { display: flex; align-items: baseline; gap: .5rem; }
.sp-main { font-size: 1.05rem; font-weight: 800; color: #059669; }
.sp-old { font-size: .77rem; color: #94a3b8; text-decoration: line-through; }
.sim-card-sk { border-radius: 18px; overflow: hidden; background: white; border: 1px solid #f1f5f9; }

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .sim-grid { grid-template-columns: repeat(2,1fr); }
  .rv-summary { grid-template-columns: auto 1fr; }
  .rv-summary > .btn-write { grid-column: span 2; }
}
@media (max-width: 768px) {
  .pd-main { grid-template-columns: 1fr; gap: 2rem; }
  .gallery-col { position: static; }
  .trust-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .pd-page { padding: 0 1rem 3rem; }
  .pname { font-size: 1.7rem; }
  .cta-row { flex-wrap: wrap; }
  .btn-cart { order: 1; width: 100%; }
  .qty { order: 0; }
  .btn-wl { order: 2; }
  .sim-grid { grid-template-columns: 1fr 1fr; }
  .tab-body { padding: 1.5rem 1rem; }
  .vc { flex-direction: column; }
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
  isLoadingReviews = true;
  isLoadingSimilar = true;

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
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) this.loadProduct(id);
    });
  }

  loadProduct(id: number) {
    this.isLoading = true;
    this.isLoadingReviews = true;
    this.isLoadingSimilar = true;

    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.quantity = product.minOrder || 1;
        this.selectedImage = product.images[0];
        this.isLoading = false;

        this.seoService.updateTags({
          title: product.name,
          description: product.description.substring(0, 160),
          image: product.images[0],
          type: 'product'
        });
        this.seoService.setProductStructuredData(product);

        this.loadReviews(id);
        this.loadSimilarProducts(product.category, id);
      },
      error: () => {
        this.isLoading = false;
        this.isLoadingReviews = false;
        this.isLoadingSimilar = false;
      }
    });
  }

  loadReviews(id: number) {
    this.productService.getProductReviews(id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.filteredReviews = [...reviews];
        this.sortReviews();
        this.updatePaginatedReviews();
        this.isLoadingReviews = false;
      },
      error: () => this.isLoadingReviews = false
    });
  }

  loadSimilarProducts(category: string, excludeId: number) {
    this.productService.getProducts({ category, limit: 8 }).subscribe({
      next: (products) => {
        this.similarProducts = products.filter(p => p.id !== excludeId).slice(0, 4);
        this.isLoadingSimilar = false;
      },
      error: () => this.isLoadingSimilar = false
    });
  }

  incrementQuantity() {
    if (this.product) {
      const max = this.product.maxOrder || this.product.stock;
      if (this.quantity < max) this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.product) {
      const min = this.product.minOrder || 1;
      if (this.quantity > min) this.quantity--;
    }
  }

  validateQuantity() {
    if (this.product) {
      const min = this.product.minOrder || 1;
      const max = this.product.maxOrder || this.product.stock;
      if (this.quantity < min) this.quantity = min;
      else if (this.quantity > max) this.quantity = max;
    }
  }

  addToCart() {
    if (this.product) this.cartService.addToCart(this.product, this.quantity);
  }

  toggleWishlist() {
    if (this.product) this.wishlistService.toggleWishlist(this.product);
  }

  isInWishlist(): boolean {
    return this.product ? this.wishlistService.isInWishlist(this.product.id) : false;
  }

  filterReviews() {
    this.filteredReviews = this.selectedRatingFilter === 0
      ? [...this.reviews]
      : this.reviews.filter(r => r.rating === this.selectedRatingFilter);
    this.sortReviews();
    this.currentPage = 0;
    this.updatePaginatedReviews();
  }

  sortReviews() {
    switch (this.selectedSortOption) {
      case 'recent':   this.filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'helpful':  this.filteredReviews.sort((a, b) => b.helpful - a.helpful); break;
      case 'rating-high': this.filteredReviews.sort((a, b) => b.rating - a.rating); break;
      case 'rating-low':  this.filteredReviews.sort((a, b) => a.rating - b.rating); break;
    }
    this.updatePaginatedReviews();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedReviews();
  }

  updatePaginatedReviews() {
    const start = this.currentPage * this.pageSize;
    this.paginatedReviews = this.filteredReviews.slice(start, start + this.pageSize);
  }

  getReviewCount(rating: number): number {
    return this.reviews.filter(r => r.rating === rating).length;
  }

  getReviewPercentage(rating: number): number {
    return this.reviews.length === 0 ? 0 : (this.getReviewCount(rating) / this.reviews.length) * 100;
  }

  getDiscountPct(product: { price: number; compareAtPrice?: number | null }): number {
    if (!product.compareAtPrice) return 0;
    return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
  }

  getInitials(userId: number): string { return `U${userId}`; }

  getTimeAgo(dateString: string): string {
    const diffDays = Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000);
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7)   return `Il y a ${diffDays} jours`;
    if (diffDays < 30)  return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
    return `Il y a ${Math.floor(diffDays / 365)} ans`;
  }

  openImageZoom() {
    const startIndex = this.product?.images.indexOf(this.selectedImage || this.product.images[0]) ?? 0;
    this.dialog.open(ImageZoomDialogComponent, {
      data: { images: this.product!.images, startIndex: Math.max(startIndex, 0) },
      maxWidth: '90vw', maxHeight: '95vh', panelClass: 'zoom-dialog-panel'
    });
  }
}
