import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { OrderService } from '@core/services/order.service';
import { CartService } from '@core/services/cart.service';
import { Order } from '@shared/models/order.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-order-confirm-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content><p>{{ data.message }}</p></mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Confirmer</button>
    </mat-dialog-actions>
  `
})
export class OrderConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }) {}
}

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatButtonModule, MatIconModule, MatDividerModule,
    MatProgressSpinnerModule, MatChipsModule, MatTooltipModule, MatDialogModule,
    LoadingSpinnerComponent
  ],
  template: `
<div class="od-page">
  <app-loading-spinner *ngIf="isLoading" [fullscreen]="false" message="Chargement de la commande..."></app-loading-spinner>

  <div *ngIf="!isLoading && order" class="od-wrap">

    <!-- HERO HEADER -->
    <div class="od-hero">
      <div class="od-hero-inner">
        <div class="od-hero-left">
          <button class="od-back-btn" (click)="goBack()"><mat-icon>west</mat-icon></button>
          <div>
            <div class="od-hero-num">{{ order.orderNumber }}</div>
            <div class="od-hero-date">Passée le {{ order.createdAt | date:'dd MMMM yyyy à HH:mm' }}</div>
          </div>
          <span class="od-status-pill" [ngClass]="getStatusClass(order.status)">{{ getStatusLabel(order.status) }}</span>
        </div>
        <div class="od-hero-actions">
          <button class="od-act-btn" (click)="printInvoice()"><mat-icon>print</mat-icon> Facture</button>
          <button class="od-act-btn" (click)="downloadInvoice()"><mat-icon>download</mat-icon> PDF</button>
          <button class="od-act-btn od-act-btn--grn" (click)="reorder()" *ngIf="order.status === 'delivered'"><mat-icon>repeat</mat-icon> Recommander</button>
          <button class="od-act-btn od-act-btn--red" (click)="cancelOrder()" *ngIf="canCancelOrder()"><mat-icon>cancel</mat-icon> Annuler</button>
        </div>
      </div>
    </div>

    <!-- BODY -->
    <div class="od-body">

      <!-- LEFT COLUMN -->
      <div class="od-left">

        <!-- TRACKING TIMELINE -->
        <div class="od-card">
          <div class="od-card-hdr">
            <div class="od-card-ic od-ic-blue"><mat-icon>local_shipping</mat-icon></div>
            <h2 class="od-card-title">Suivi de commande</h2>
          </div>

          <div class="od-timeline">
            <div class="od-step" [class.od-step--past]="isStepCompleted('pending') && order.status !== 'pending'" [class.od-step--now]="order.status === 'pending'">
              <div class="od-step-node od-sn-grn">
                <mat-icon *ngIf="isStepCompleted('pending') && order.status !== 'pending'">check</mat-icon>
                <mat-icon *ngIf="order.status === 'pending'">radio_button_checked</mat-icon>
                <mat-icon *ngIf="!isStepCompleted('pending')">radio_button_unchecked</mat-icon>
              </div>
              <div class="od-step-body">
                <div class="od-step-name">Commande validée</div>
                <div class="od-step-date">{{ order.createdAt | date:'dd/MM/yyyy à HH:mm' }}</div>
                <div class="od-step-desc">Votre commande a été reçue et confirmée</div>
              </div>
            </div>

            <div class="od-step" [class.od-step--past]="isStepCompleted('processing') && order.status !== 'processing'" [class.od-step--now]="order.status === 'processing'">
              <div class="od-step-node od-sn-blue">
                <mat-icon *ngIf="isStepCompleted('processing') && order.status !== 'processing'">check</mat-icon>
                <mat-icon *ngIf="order.status === 'processing'">radio_button_checked</mat-icon>
                <mat-icon *ngIf="!isStepCompleted('processing')">radio_button_unchecked</mat-icon>
              </div>
              <div class="od-step-body">
                <div class="od-step-name">En préparation</div>
                <div class="od-step-date" *ngIf="order.updatedAt && isStepCompleted('processing')">{{ order.updatedAt | date:'dd/MM/yyyy à HH:mm' }}</div>
                <div class="od-step-desc">Votre commande est en cours de préparation</div>
              </div>
            </div>

            <div class="od-step" [class.od-step--past]="isStepCompleted('shipped') && order.status !== 'shipped'" [class.od-step--now]="order.status === 'shipped'">
              <div class="od-step-node od-sn-pur">
                <mat-icon *ngIf="isStepCompleted('shipped') && order.status !== 'shipped'">check</mat-icon>
                <mat-icon *ngIf="order.status === 'shipped'">radio_button_checked</mat-icon>
                <mat-icon *ngIf="!isStepCompleted('shipped')">radio_button_unchecked</mat-icon>
              </div>
              <div class="od-step-body">
                <div class="od-step-name">Expédiée</div>
                <div class="od-step-date" *ngIf="order.status === 'shipped' || order.status === 'delivered'">En transit</div>
                <div class="od-step-desc">Votre commande est en route vers vous</div>
                <div class="od-step-alert od-alert-pur" *ngIf="order.status === 'shipped'">
                  <mat-icon>local_shipping</mat-icon> Votre colis est en chemin !
                </div>
              </div>
            </div>

            <div class="od-step od-step--last" [class.od-step--past]="order.status === 'delivered'">
              <div class="od-step-node od-sn-grn">
                <mat-icon *ngIf="order.status === 'delivered'">check</mat-icon>
                <mat-icon *ngIf="order.status !== 'delivered'">radio_button_unchecked</mat-icon>
              </div>
              <div class="od-step-body">
                <div class="od-step-name">Livrée</div>
                <div class="od-step-date" *ngIf="order.status === 'delivered' && order.deliveryDate">{{ order.deliveryDate | date:'dd/MM/yyyy à HH:mm' }}</div>
                <div class="od-step-desc">Commande livrée avec succès</div>
                <div class="od-step-alert od-alert-grn" *ngIf="order.status === 'delivered'">
                  <mat-icon>check_circle</mat-icon> Commande livrée ! Merci pour votre confiance.
                </div>
              </div>
            </div>

            <div class="od-step od-step--last od-step--cancel" *ngIf="order.status === 'cancelled'">
              <div class="od-step-node od-sn-red"><mat-icon>close</mat-icon></div>
              <div class="od-step-body">
                <div class="od-step-name">Annulée</div>
                <div class="od-step-date">{{ order.updatedAt | date:'dd/MM/yyyy à HH:mm' }}</div>
                <div class="od-step-desc">Cette commande a été annulée</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ITEMS LIST -->
        <div class="od-card">
          <div class="od-card-hdr">
            <div class="od-card-ic od-ic-grn"><mat-icon>inventory_2</mat-icon></div>
            <h2 class="od-card-title">Articles commandés ({{ order.items.length }})</h2>
          </div>
          <div class="od-items">
            <div *ngFor="let item of order.items" class="od-item">
              <div class="od-item-img">
                <img *ngIf="item.product && item.product.images && item.product.images[0]" [src]="item.product.images[0]" [alt]="item.name" class="od-item-pic">
                <div *ngIf="!item.product?.images?.[0]" class="od-item-no-img"><mat-icon>image_not_supported</mat-icon></div>
              </div>
              <div class="od-item-info">
                <div class="od-item-name">{{ item.name }}</div>
                <div class="od-item-meta">
                  <span class="od-meta-chip"><mat-icon>store</mat-icon> Vendeur #{{ item.vendorId }}</span>
                  <span class="od-meta-chip">Qté: <strong>{{ item.quantity }}</strong></span>
                  <span class="od-meta-chip">{{ item.price | number:'1.0-0' }} FCFA/u</span>
                </div>
              </div>
              <div class="od-item-right">
                <div class="od-item-total">{{ (item.price * item.quantity) | number:'1.0-0' }} FCFA</div>
                <a class="od-item-link" [routerLink]="['/products', item.productId]"><mat-icon>visibility</mat-icon> Voir</a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN -->
      <div class="od-right">

        <div class="od-card">
          <div class="od-card-hdr">
            <div class="od-card-ic od-ic-grn"><mat-icon>location_on</mat-icon></div>
            <h2 class="od-card-title">Adresse de livraison</h2>
          </div>
          <div class="od-addr">
            <div class="od-addr-name">{{ order.shippingAddress?.fullName || 'Client' }}</div>
            <div class="od-addr-line">{{ order.shippingAddress?.street }}</div>
            <div class="od-addr-line">{{ order.shippingAddress?.city }}, {{ order.shippingAddress?.region }}</div>
            <div class="od-addr-line">{{ order.shippingAddress?.country }}</div>
            <div class="od-addr-phone"><mat-icon>phone</mat-icon> {{ order.shippingAddress?.phone || '+226 70 00 00 00' }}</div>
          </div>
        </div>

        <div class="od-card">
          <div class="od-card-hdr">
            <div class="od-card-ic od-ic-pur"><mat-icon>credit_card</mat-icon></div>
            <h2 class="od-card-title">Paiement</h2>
          </div>
          <div class="od-pay-rows">
            <div class="od-pay-row"><span class="od-pay-lbl">Mode</span><span class="od-pay-val">{{ getPaymentMethodLabel(order.paymentMethod) }}</span></div>
            <div class="od-pay-row"><span class="od-pay-lbl">Statut</span><span class="od-pay-pill" [ngClass]="getPaymentStatusClass(order.paymentStatus)">{{ getPaymentStatusLabel(order.paymentStatus) }}</span></div>
          </div>
          <div class="od-totals">
            <div class="od-tot-row"><span>Sous-total</span><span>{{ order.subtotal | number:'1.0-0' }} FCFA</span></div>
            <div class="od-tot-row"><span>Livraison</span><span>{{ order.shippingCost | number:'1.0-0' }} FCFA</span></div>
            <div class="od-tot-row od-tot-disc" *ngIf="order.discount"><span>Réduction</span><span>-{{ order.discount | number:'1.0-0' }} FCFA</span></div>
            <div class="od-tot-row" *ngIf="order.tax"><span>Taxes</span><span>{{ order.tax | number:'1.0-0' }} FCFA</span></div>
            <div class="od-tot-final"><span>Total</span><span>{{ order.total | number:'1.0-0' }} FCFA</span></div>
          </div>
        </div>

        <div class="od-help-card">
          <div class="od-help-ic"><mat-icon>support_agent</mat-icon></div>
          <div class="od-help-body">
            <h3 class="od-help-title">Besoin d'aide ?</h3>
            <p class="od-help-sub">Notre équipe est disponible pour vous assister</p>
          </div>
          <a routerLink="/contact" class="od-help-btn">Contacter le support</a>
        </div>

      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
:host { display: block; background: #f8fafc; min-height: 100vh; }

.od-hero { background: linear-gradient(135deg, #065f46, #047857); color: white; padding: 20px 0; }
.od-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.od-hero-left { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.od-back-btn { background: rgba(255,255,255,.15); border: none; color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background .2s; flex-shrink: 0; }
.od-back-btn:hover { background: rgba(255,255,255,.25); }
.od-hero-num { font-size: 1.2rem; font-weight: 800; font-family: monospace; }
.od-hero-date { font-size: 0.78rem; opacity: 0.8; margin-top: 2px; }
.od-status-pill { padding: 4px 14px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; background: rgba(255,255,255,.2); }
.od-hero-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.od-act-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.3); color: white; border-radius: 8px; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all .2s; }
.od-act-btn:hover { background: rgba(255,255,255,.25); }
.od-act-btn--grn { background: rgba(167,243,208,.2); border-color: #a7f3d0; }
.od-act-btn--red { background: rgba(254,202,202,.2); border-color: #fca5a5; }
.od-act-btn mat-icon { font-size: 16px; width: 16px; height: 16px; }

.od-body { max-width: 1200px; margin: 28px auto; padding: 0 24px; display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
@media (max-width: 900px) { .od-body { grid-template-columns: 1fr; } }

.od-left { display: flex; flex-direction: column; gap: 20px; }
.od-right { display: flex; flex-direction: column; gap: 16px; }

.od-card { background: white; border-radius: 14px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.06); }
.od-card-hdr { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
.od-card-ic { width: 44px; height: 44px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.od-card-ic mat-icon { font-size: 22px; width: 22px; height: 22px; }
.od-ic-grn { background: #dcfce7; color: #059669; }
.od-ic-blue { background: #dbeafe; color: #2563eb; }
.od-ic-pur { background: #ede9fe; color: #7c3aed; }
.od-card-title { font-size: 1.1rem; font-weight: 700; color: #111827; margin: 0; }

.od-timeline { position: relative; padding-left: 52px; }
.od-timeline::before { content: ''; position: absolute; left: 17px; top: 8px; bottom: 8px; width: 2px; background: #e5e7eb; border-radius: 2px; }
.od-step { position: relative; margin-bottom: 28px; }
.od-step--last { margin-bottom: 0; }
.od-step-node { position: absolute; left: -52px; top: 0; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #f1f5f9; border: 2px solid #e5e7eb; z-index: 1; }
.od-step-node mat-icon { font-size: 18px; width: 18px; height: 18px; color: #9ca3af; }
.od-step--past .od-sn-grn { background: #dcfce7; border-color: #059669; }
.od-step--past .od-sn-grn mat-icon { color: #059669; }
.od-step--past .od-sn-blue { background: #dbeafe; border-color: #2563eb; }
.od-step--past .od-sn-blue mat-icon { color: #2563eb; }
.od-step--past .od-sn-pur { background: #ede9fe; border-color: #7c3aed; }
.od-step--past .od-sn-pur mat-icon { color: #7c3aed; }
.od-step--now .od-sn-grn { background: #059669; border-color: #059669; box-shadow: 0 0 0 4px rgba(5,150,105,.2); }
.od-step--now .od-sn-grn mat-icon { color: white; }
.od-step--now .od-sn-blue { background: #2563eb; border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,.2); }
.od-step--now .od-sn-blue mat-icon { color: white; }
.od-step--now .od-sn-pur { background: #7c3aed; border-color: #7c3aed; box-shadow: 0 0 0 4px rgba(124,58,237,.2); }
.od-step--now .od-sn-pur mat-icon { color: white; }
.od-sn-red { background: #fee2e2 !important; border-color: #ef4444 !important; }
.od-sn-red mat-icon { color: #ef4444 !important; }
.od-step-name { font-weight: 700; font-size: 0.9rem; color: #111827; }
.od-step-date { font-size: 0.78rem; color: #6b7280; margin-top: 2px; }
.od-step-desc { font-size: 0.82rem; color: #6b7280; margin-top: 4px; }
.od-step-alert { display: flex; align-items: center; gap: 8px; margin-top: 10px; padding: 10px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; }
.od-step-alert mat-icon { font-size: 18px; width: 18px; height: 18px; }
.od-alert-grn { background: #f0fdf4; color: #059669; }
.od-alert-pur { background: #f5f3ff; color: #7c3aed; }

.od-items { display: flex; flex-direction: column; }
.od-item { display: flex; gap: 16px; align-items: center; padding: 16px 0; border-bottom: 1px solid #f1f5f9; }
.od-item:last-child { border-bottom: none; }
.od-item-pic { width: 72px; height: 72px; object-fit: cover; border-radius: 10px; border: 1px solid #f1f5f9; flex-shrink: 0; }
.od-item-no-img { width: 72px; height: 72px; background: #f1f5f9; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #9ca3af; flex-shrink: 0; }
.od-item-info { flex: 1; min-width: 0; }
.od-item-name { font-weight: 700; font-size: 0.9rem; color: #111827; margin-bottom: 8px; }
.od-item-meta { display: flex; flex-wrap: wrap; gap: 8px; }
.od-meta-chip { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: #6b7280; background: #f8fafc; padding: 3px 10px; border-radius: 20px; border: 1px solid #e5e7eb; }
.od-meta-chip mat-icon { font-size: 14px; width: 14px; height: 14px; }
.od-item-right { text-align: right; flex-shrink: 0; }
.od-item-total { font-weight: 800; font-size: 1rem; color: #059669; }
.od-item-link { display: inline-flex; align-items: center; gap: 4px; margin-top: 8px; font-size: 0.78rem; color: #059669; text-decoration: none; padding: 4px 10px; border: 1px solid #a7f3d0; border-radius: 6px; transition: all .2s; }
.od-item-link:hover { background: #f0fdf4; }
.od-item-link mat-icon { font-size: 14px; width: 14px; height: 14px; }

.od-addr { background: #f8fafc; border-radius: 10px; padding: 16px; }
.od-addr-name { font-weight: 700; color: #111827; margin-bottom: 6px; }
.od-addr-line { font-size: 0.875rem; color: #6b7280; line-height: 1.7; }
.od-addr-phone { display: flex; align-items: center; gap: 6px; margin-top: 10px; font-size: 0.875rem; color: #374151; font-weight: 500; }
.od-addr-phone mat-icon { font-size: 16px; width: 16px; height: 16px; color: #059669; }

.od-pay-rows { background: #f8fafc; border-radius: 10px; padding: 14px; margin-bottom: 16px; }
.od-pay-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; }
.od-pay-lbl { font-size: 0.8rem; color: #6b7280; }
.od-pay-val { font-weight: 600; color: #111827; font-size: 0.875rem; }
.od-pay-pill { font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.od-totals { display: flex; flex-direction: column; }
.od-tot-row { display: flex; justify-content: space-between; font-size: 0.875rem; color: #6b7280; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
.od-tot-disc span:last-child { color: #059669; }
.od-tot-final { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; margin-top: 8px; background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1px solid #bbf7d0; border-radius: 10px; font-weight: 700; color: #065f46; }
.od-tot-final span:last-child { font-size: 1.2rem; font-weight: 800; }

.od-help-card { background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1px solid #bfdbfe; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; }
.od-help-ic { width: 48px; height: 48px; background: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.od-help-ic mat-icon { font-size: 24px; width: 24px; height: 24px; color: white; }
.od-help-title { font-weight: 700; color: #1e3a5f; margin: 0; font-size: 0.95rem; }
.od-help-sub { font-size: 0.8rem; color: #3b82f6; margin: 4px 0 0; }
.od-help-btn { display: inline-block; padding: 9px 20px; background: #2563eb; color: white; border-radius: 8px; font-size: 0.82rem; font-weight: 600; text-decoration: none; transition: all .2s; }
.od-help-btn:hover { background: #1d4ed8; transform: translateY(-1px); }

@media (max-width: 600px) {
  .od-hero-inner { flex-direction: column; align-items: flex-start; }
  .od-body { padding: 0 16px; margin: 16px auto; }
  .od-card { padding: 18px 14px; }
}
  `]
})
export class OrderDetailComponent implements OnInit {
  order: Order | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private notification: NotificationService,
    private cartService: CartService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) this.loadOrder(id);
    });
  }

  loadOrder(id: number) {
    this.orderService.getOrder(id).subscribe({
      next: (order) => { this.order = order; this.isLoading = false; },
      error: () => { this.isLoading = false; this.notification.error('Commande introuvable'); this.router.navigate(['/orders']); }
    });
  }

  goBack() { this.router.navigate(['/orders']); }
  printInvoice() { this.notification.info('Impression de la facture...'); window.print(); }
  downloadInvoice() { this.notification.info('Téléchargement de la facture en cours...'); }

  reorder() {
    if (!this.order) return;
    let addedCount = 0;
    this.order.items.forEach(item => { if (item.product) { this.cartService.addToCart(item.product, item.quantity); addedCount++; } });
    if (addedCount > 0) { this.notification.success(`${addedCount} article(s) ajouté(s) au panier !`); this.router.navigate(['/cart']); }
    else this.notification.warning('Impossible de récupérer les articles de cette commande.');
  }

  cancelOrder() {
    if (!this.order) return;
    this.dialog.open(OrderConfirmDialogComponent, {
      data: { title: 'Annuler la commande', message: `Êtes-vous sûr de vouloir annuler la commande ${this.order.orderNumber} ? Cette action est irréversible.` },
      width: '400px'
    }).afterClosed().subscribe(confirmed => {
      if (confirmed && this.order) {
        this.orderService.updateOrderStatus(this.order.id, 'cancelled').subscribe({
          next: () => { this.notification.success('Commande annulée avec succès'); if (this.order) this.order.status = 'cancelled'; },
          error: () => this.notification.error('Erreur lors de l\'annulation')
        });
      }
    });
  }

  canCancelOrder(): boolean { return this.order?.status === 'pending' || this.order?.status === 'processing'; }

  isStepCompleted(step: string): boolean {
    if (!this.order) return false;
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    return statusOrder.indexOf(step) <= statusOrder.indexOf(this.order.status);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = { 'pending': 'bg-yellow-100 text-yellow-800', 'processing': 'bg-blue-100 text-blue-800', 'shipped': 'bg-purple-100 text-purple-800', 'delivered': 'bg-green-100 text-green-800', 'cancelled': 'bg-red-100 text-red-800' };
    return map[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { 'pending': 'En attente', 'processing': 'En traitement', 'shipped': 'Expédiée', 'delivered': 'Livrée', 'cancelled': 'Annulée' };
    return map[status] || status;
  }

  getPaymentMethodLabel(method: string): string {
    const map: Record<string, string> = { 'cash': 'Espèces', 'orange_money': 'Orange Money', 'wave': 'Wave', 'mobile_money': 'Mobile Money', 'card': 'Carte bancaire', 'cash_on_delivery': 'Paiement à la livraison' };
    return map[method] || method;
  }

  getPaymentStatusClass(status: string): string {
    const map: Record<string, string> = { 'paid': 'bg-green-100 text-green-700', 'pending': 'bg-yellow-100 text-yellow-700', 'failed': 'bg-red-100 text-red-700' };
    return map[status] || 'bg-gray-100 text-gray-700';
  }

  getPaymentStatusLabel(status: string): string {
    const map: Record<string, string> = { 'paid': 'Payé', 'pending': 'En attente', 'failed': 'Échoué' };
    return map[status] || status;
  }
}
