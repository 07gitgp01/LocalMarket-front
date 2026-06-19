import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { OrderService } from '@core/services/order.service';
import { Order } from '@shared/models/order.model';

@Component({
    selector: 'app-checkout-success',
    standalone: true,
    imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
    template: `
<div class="sc-page">
  <!-- Background blobs -->
  <div class="sc-blob sc-blob-1"></div>
  <div class="sc-blob sc-blob-2"></div>

  <div class="sc-wrap">

    <!-- Animated checkmark -->
    <div class="sc-icon-area">
      <div class="sc-ring sc-ring-1"></div>
      <div class="sc-ring sc-ring-2"></div>
      <div class="sc-icon-circle">
        <mat-icon>check</mat-icon>
      </div>
    </div>

    <h1 class="sc-title">Commande confirmée !</h1>
    <p class="sc-sub">Merci pour votre achat. Vous recevrez un email de confirmation dans quelques instants.</p>

    <!-- Order summary card -->
    <div class="sc-card" *ngIf="order">
      <div class="sc-card-hdr">
        <div class="sc-num">{{ order.orderNumber }}</div>
        <span class="sc-badge">En attente</span>
      </div>
      <div class="sc-rows">
        <div class="sc-row">
          <span class="sc-row-lbl"><mat-icon>payments</mat-icon> Montant total</span>
          <span class="sc-row-val">{{ order.total | number }} FCFA</span>
        </div>
        <div class="sc-row">
          <span class="sc-row-lbl"><mat-icon>local_shipping</mat-icon> Livraison estimée</span>
          <span class="sc-row-val">{{ estimatedDeliveryDate | date:'dd MMMM yyyy' }}</span>
        </div>
        <div class="sc-row">
          <span class="sc-row-lbl"><mat-icon>credit_card</mat-icon> Mode de paiement</span>
          <span class="sc-row-val">{{ getPaymentLabel(order.paymentMethod) }}</span>
        </div>
      </div>
    </div>

    <!-- Progress steps -->
    <div class="sc-steps">
      <div class="sc-step sc-step--active">
        <div class="sc-step-ic sc-ic-grn"><mat-icon>check_circle</mat-icon></div>
        <div class="sc-step-lbl">Confirmée</div>
      </div>
      <div class="sc-step-line"></div>
      <div class="sc-step">
        <div class="sc-step-ic sc-ic-blue"><mat-icon>inventory_2</mat-icon></div>
        <div class="sc-step-lbl">Préparation</div>
      </div>
      <div class="sc-step-line"></div>
      <div class="sc-step">
        <div class="sc-step-ic sc-ic-pur"><mat-icon>local_shipping</mat-icon></div>
        <div class="sc-step-lbl">Expédition</div>
      </div>
      <div class="sc-step-line"></div>
      <div class="sc-step">
        <div class="sc-step-ic sc-ic-amb"><mat-icon>home</mat-icon></div>
        <div class="sc-step-lbl">Livraison</div>
      </div>
    </div>

    <!-- Actions -->
    <div class="sc-actions">
      <a routerLink="/orders" class="sc-btn sc-btn-outline">
        <mat-icon>list_alt</mat-icon>
        Suivre ma commande
      </a>
      <a routerLink="/products" class="sc-btn sc-btn-filled">
        <mat-icon>shopping_bag</mat-icon>
        Continuer mes achats
      </a>
    </div>

  </div>
</div>
    `,
    styles: [`
:host { display: block; background: linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 40%, #f8fafc 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 48px 24px; position: relative; overflow: hidden; }

.sc-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.35; pointer-events: none; }
.sc-blob-1 { width: 500px; height: 500px; background: #a7f3d0; top: -150px; right: -100px; }
.sc-blob-2 { width: 400px; height: 400px; background: #bfdbfe; bottom: -120px; left: -80px; }

.sc-wrap { position: relative; z-index: 1; max-width: 560px; width: 100%; text-align: center; animation: sc-fadeup 0.7s ease-out; }
@keyframes sc-fadeup { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.sc-icon-area { position: relative; width: 120px; height: 120px; margin: 0 auto 28px; }
.sc-ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid #a7f3d0; animation: sc-pulse 2s ease-out infinite; }
.sc-ring-1 { animation-delay: 0s; }
.sc-ring-2 { inset: -10px; border-color: #bbf7d0; animation-delay: 0.4s; opacity: 0.6; }
@keyframes sc-pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.35); opacity: 0; } }
.sc-icon-circle { position: absolute; inset: 8px; background: linear-gradient(135deg, #059669, #047857); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(5,150,105,.4); }
.sc-icon-circle mat-icon { font-size: 48px; width: 48px; height: 48px; color: white; }

.sc-title { font-size: 2rem; font-weight: 800; color: #111827; margin: 0 0 12px; }
.sc-sub { font-size: 1rem; color: #6b7280; margin: 0 0 32px; line-height: 1.6; }

.sc-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,.08); margin-bottom: 28px; text-align: left; border: 1px solid #e5e7eb; }
.sc-card-hdr { display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; margin-bottom: 16px; }
.sc-num { font-family: monospace; font-weight: 800; font-size: 1.1rem; color: #111827; }
.sc-badge { background: #fef3c7; color: #92400e; font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
.sc-rows { display: flex; flex-direction: column; gap: 0; }
.sc-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f8fafc; }
.sc-row:last-child { border-bottom: none; }
.sc-row-lbl { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: #6b7280; }
.sc-row-lbl mat-icon { font-size: 16px; width: 16px; height: 16px; color: #059669; }
.sc-row-val { font-weight: 700; color: #111827; font-size: 0.9rem; }

.sc-steps { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 32px; }
.sc-step { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.sc-step-ic { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #e5e7eb; background: #f8fafc; }
.sc-step-ic mat-icon { font-size: 20px; width: 20px; height: 20px; color: #9ca3af; }
.sc-step--active .sc-step-ic { background: #059669; border-color: #059669; box-shadow: 0 0 0 4px rgba(5,150,105,.15); }
.sc-step--active .sc-step-ic mat-icon { color: white; }
.sc-ic-grn mat-icon { color: #059669 !important; }
.sc-ic-blue mat-icon { color: #2563eb !important; }
.sc-ic-pur mat-icon { color: #7c3aed !important; }
.sc-ic-amb mat-icon { color: #d97706 !important; }
.sc-step-lbl { font-size: 0.72rem; color: #9ca3af; font-weight: 500; }
.sc-step--active .sc-step-lbl { color: #059669; font-weight: 700; }
.sc-step-line { width: 48px; height: 2px; background: #e5e7eb; margin-bottom: 24px; }

.sc-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.sc-btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 24px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all .2s; }
.sc-btn mat-icon { font-size: 20px; width: 20px; height: 20px; }
.sc-btn-outline { background: white; color: #374151; border: 1.5px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
.sc-btn-outline:hover { border-color: #d1d5db; background: #f9fafb; transform: translateY(-1px); }
.sc-btn-filled { background: linear-gradient(135deg, #059669, #047857); color: white; border: none; box-shadow: 0 4px 14px rgba(5,150,105,.4); }
.sc-btn-filled:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(5,150,105,.5); }

@media (max-width: 480px) {
  .sc-title { font-size: 1.5rem; }
  .sc-steps { gap: 0; }
  .sc-step-line { width: 28px; }
  .sc-btn { padding: 11px 18px; font-size: 0.85rem; }
}
    `]
})
export class CheckoutSuccessComponent implements OnInit {
    order: Order | undefined;
    estimatedDeliveryDate = new Date();

    constructor(private route: ActivatedRoute, private orderService: OrderService) {
        this.estimatedDeliveryDate.setDate(this.estimatedDeliveryDate.getDate() + 2);
    }

    ngOnInit() {
        const orderId = this.route.snapshot.params['id'];
        if (orderId) {
            this.orderService.getOrder(orderId).subscribe(order => this.order = order);
        }
    }

    getPaymentLabel(method: string): string {
        const m: Record<string, string> = { 'orange_money': 'Orange Money', 'wave': 'Wave', 'cash_on_delivery': 'Paiement à la livraison', 'cash': 'Espèces' };
        return m[method] || method;
    }
}
