import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';
import { OrderService } from '@core/services/order.service';
import { NotificationService } from '@core/services/notification.service';
import { CheckoutData, PaymentMethod } from '@shared/models/order.model';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule,
        MatInputModule, MatButtonModule, MatRadioModule, MatSelectModule,
        MatIconModule, MatCardModule, MatDividerModule, MatProgressSpinnerModule
    ],
    template: `
<div class="co-page">

  <!-- HERO WITH STEP PROGRESS -->
  <div class="co-hero">
    <div class="co-hero-inner">
      <div class="co-hero-left">
        <h1 class="co-hero-title">Finaliser la commande</h1>
        <p class="co-hero-sub">Quelques étapes pour recevoir vos produits</p>
      </div>
      <div class="co-steps-bar">
        <ng-container *ngFor="let s of steps; let i = index">
          <div class="co-step-dot" [class.co-step-dot--done]="stepper.selectedIndex > i" [class.co-step-dot--active]="stepper.selectedIndex === i">
            <div class="co-step-num">
              <mat-icon *ngIf="stepper.selectedIndex > i" class="co-chk">check</mat-icon>
              <span *ngIf="stepper.selectedIndex <= i">{{ i + 1 }}</span>
            </div>
            <span class="co-step-lbl">{{ s }}</span>
          </div>
          <div *ngIf="i < steps.length - 1" class="co-step-line" [class.co-step-line--done]="stepper.selectedIndex > i"></div>
        </ng-container>
      </div>
    </div>
  </div>

  <!-- BODY -->
  <div class="co-body">

    <!-- MAIN STEPPER -->
    <div class="co-main">
      <mat-stepper linear #stepper class="co-stepper">

        <!-- ── STEP 1: LIVRAISON ── -->
        <mat-step [stepControl]="shippingForm">
          <ng-template matStepLabel>Livraison</ng-template>
          <form [formGroup]="shippingForm" class="co-card">
            <div class="co-card-hdr">
              <div class="co-card-ic co-ic-grn"><mat-icon>location_on</mat-icon></div>
              <div>
                <h2 class="co-card-title">Adresse de livraison</h2>
                <p class="co-card-sub">Où souhaitez-vous être livré ?</p>
              </div>
            </div>

            <div class="co-f2">
              <mat-form-field appearance="outline" class="co-f"><mat-label>Prénom</mat-label><input matInput formControlName="firstName" required></mat-form-field>
              <mat-form-field appearance="outline" class="co-f"><mat-label>Nom</mat-label><input matInput formControlName="lastName" required></mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="co-fw">
              <mat-label>Téléphone</mat-label>
              <span matTextPrefix>+226 &nbsp;</span>
              <input matInput formControlName="phone" required placeholder="70 00 00 00">
            </mat-form-field>
            <mat-form-field appearance="outline" class="co-fw">
              <mat-label>Ville / Région</mat-label>
              <mat-select formControlName="city" required>
                <mat-option value="Ouagadougou">Ouagadougou</mat-option>
                <mat-option value="Bobo-Dioulasso">Bobo-Dioulasso</mat-option>
                <mat-option value="Koudougou">Koudougou</mat-option>
                <mat-option value="Kaya">Kaya</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="co-fw">
              <mat-label>Quartier / Secteur / Rue</mat-label>
              <textarea matInput formControlName="street" rows="2" required placeholder="Ex: Patte d'oie, Secteur 15, face à la pharmacie..."></textarea>
              <mat-hint>Donnez des précisions pour faciliter la livraison</mat-hint>
            </mat-form-field>

            <div class="co-actions">
              <button class="co-btn-next" matStepperNext [disabled]="shippingForm.invalid">
                Suivant <mat-icon>east</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- ── STEP 2: MODE DE LIVRAISON ── -->
        <mat-step [stepControl]="deliveryForm">
          <ng-template matStepLabel>Mode de Livraison</ng-template>
          <form [formGroup]="deliveryForm" class="co-card">
            <div class="co-card-hdr">
              <div class="co-card-ic co-ic-blue"><mat-icon>local_shipping</mat-icon></div>
              <div>
                <h2 class="co-card-title">Mode de livraison</h2>
                <p class="co-card-sub">Choisissez la méthode qui vous convient</p>
              </div>
            </div>

            <mat-radio-group formControlName="method" class="co-opts">
              <label class="co-opt" [class.co-opt--sel]="deliveryForm.value.method === 'standard'" (click)="setDeliveryMethod('standard', 1000)">
                <mat-radio-button value="standard" class="co-radio"></mat-radio-button>
                <div class="co-opt-ic co-oi-std"><mat-icon>schedule</mat-icon></div>
                <div class="co-opt-txt">
                  <div class="co-opt-name">Livraison Standard</div>
                  <div class="co-opt-desc">24h - 48h à domicile</div>
                </div>
                <span class="co-opt-cost">1 000 FCFA</span>
              </label>

              <label class="co-opt" [class.co-opt--sel]="deliveryForm.value.method === 'express'" (click)="setDeliveryMethod('express', 2000)">
                <mat-radio-button value="express" class="co-radio"></mat-radio-button>
                <div class="co-opt-ic co-oi-exp"><mat-icon>bolt</mat-icon></div>
                <div class="co-opt-txt">
                  <div class="co-opt-name">Express <span class="co-tag co-tag-amb">Rapide</span></div>
                  <div class="co-opt-desc">Dans la journée (commande avant 12h)</div>
                </div>
                <span class="co-opt-cost co-cost-amb">2 000 FCFA</span>
              </label>

              <label class="co-opt" [class.co-opt--sel]="deliveryForm.value.method === 'pickup'" (click)="setDeliveryMethod('pickup', 500)">
                <mat-radio-button value="pickup" class="co-radio"></mat-radio-button>
                <div class="co-opt-ic co-oi-pur"><mat-icon>store</mat-icon></div>
                <div class="co-opt-txt">
                  <div class="co-opt-name">Point Relais <span class="co-tag co-tag-grn">Économique</span></div>
                  <div class="co-opt-desc">Récupérer dans un point partenaire</div>
                </div>
                <span class="co-opt-cost co-cost-grn">500 FCFA</span>
              </label>
            </mat-radio-group>

            <div class="co-actions co-actions-2">
              <button class="co-btn-back" matStepperPrevious><mat-icon>west</mat-icon> Retour</button>
              <button class="co-btn-next" matStepperNext>Suivant <mat-icon>east</mat-icon></button>
            </div>
          </form>
        </mat-step>

        <!-- ── STEP 3: PAIEMENT ── -->
        <mat-step [stepControl]="paymentForm">
          <ng-template matStepLabel>Paiement</ng-template>
          <form [formGroup]="paymentForm" class="co-card">
            <div class="co-card-hdr">
              <div class="co-card-ic co-ic-pur"><mat-icon>credit_card</mat-icon></div>
              <div>
                <h2 class="co-card-title">Moyen de paiement</h2>
                <p class="co-card-sub">Choisissez votre méthode préférée</p>
              </div>
            </div>

            <mat-radio-group formControlName="method" class="co-opts">
              <label class="co-opt" [class.co-opt--sel]="paymentForm.value.method === 'orange_money'">
                <mat-radio-button value="orange_money" class="co-radio"></mat-radio-button>
                <div class="co-pay-logo co-pl-om">OM</div>
                <div class="co-opt-txt">
                  <div class="co-opt-name">Orange Money</div>
                  <div class="co-opt-desc">Paiement mobile sécurisé</div>
                </div>
                <span class="co-tag co-tag-org">Populaire</span>
              </label>

              <label class="co-opt" [class.co-opt--sel]="paymentForm.value.method === 'wave'">
                <mat-radio-button value="wave" class="co-radio"></mat-radio-button>
                <div class="co-pay-logo co-pl-wave">W</div>
                <div class="co-opt-txt">
                  <div class="co-opt-name">Wave</div>
                  <div class="co-opt-desc">1% de frais seulement</div>
                </div>
                <span class="co-tag co-tag-grn">Économique</span>
              </label>

              <label class="co-opt" [class.co-opt--sel]="paymentForm.value.method === 'cash_on_delivery'">
                <mat-radio-button value="cash_on_delivery" class="co-radio"></mat-radio-button>
                <div class="co-opt-ic co-oi-cash"><mat-icon>payments</mat-icon></div>
                <div class="co-opt-txt">
                  <div class="co-opt-name">Paiement à la livraison</div>
                  <div class="co-opt-desc">Espèces à la réception du colis</div>
                </div>
                <span class="co-tag co-tag-neu">Sans frais</span>
              </label>
            </mat-radio-group>

            <div class="co-actions co-actions-2">
              <button class="co-btn-back" matStepperPrevious><mat-icon>west</mat-icon> Retour</button>
              <button class="co-btn-next" matStepperNext [disabled]="paymentForm.invalid">Suivant <mat-icon>east</mat-icon></button>
            </div>
          </form>
        </mat-step>

        <!-- ── STEP 4: CONFIRMATION ── -->
        <mat-step>
          <ng-template matStepLabel>Confirmation</ng-template>
          <div class="co-card">
            <div class="co-card-hdr">
              <div class="co-card-ic co-ic-grn"><mat-icon>fact_check</mat-icon></div>
              <div>
                <h2 class="co-card-title">Vérifiez votre commande</h2>
                <p class="co-card-sub">Tout est correct ? Confirmez pour passer commande.</p>
              </div>
            </div>

            <div class="co-confirm-box">
              <div class="co-conf-row">
                <div class="co-conf-ic co-conf-ic-grn"><mat-icon>location_on</mat-icon></div>
                <div class="co-conf-body">
                  <div class="co-conf-lbl">Adresse de livraison</div>
                  <div class="co-conf-val">{{ shippingForm.value.firstName }} {{ shippingForm.value.lastName }}</div>
                  <div class="co-conf-sub">{{ shippingForm.value.city }} — {{ shippingForm.value.street }}</div>
                  <div class="co-conf-sub">+226 {{ shippingForm.value.phone }}</div>
                </div>
              </div>
              <div class="co-conf-div"></div>
              <div class="co-conf-row">
                <div class="co-conf-ic co-conf-ic-blue"><mat-icon>local_shipping</mat-icon></div>
                <div class="co-conf-body">
                  <div class="co-conf-lbl">Mode de livraison</div>
                  <div class="co-conf-val">{{ getDeliveryLabel() }}</div>
                  <div class="co-conf-sub">{{ deliveryCost | number }} FCFA</div>
                </div>
              </div>
              <div class="co-conf-div"></div>
              <div class="co-conf-row">
                <div class="co-conf-ic co-conf-ic-pur"><mat-icon>credit_card</mat-icon></div>
                <div class="co-conf-body">
                  <div class="co-conf-lbl">Paiement</div>
                  <div class="co-conf-val">{{ getPaymentLabel() }}</div>
                </div>
              </div>
            </div>

            <div class="co-secure-badge">
              <mat-icon>lock</mat-icon>
              <span>Vos données sont protégées. En confirmant, vous acceptez nos CGV.</span>
            </div>

            <div class="co-actions co-actions-2">
              <button class="co-btn-back" matStepperPrevious><mat-icon>west</mat-icon> Retour</button>
              <button class="co-btn-confirm" (click)="placeOrder()" [disabled]="isLoading">
                <mat-spinner *ngIf="isLoading" diameter="20" class="co-spin"></mat-spinner>
                <mat-icon *ngIf="!isLoading">check_circle</mat-icon>
                <span>{{ isLoading ? 'Traitement...' : 'Confirmer · ' + (totalAmount | number) + ' FCFA' }}</span>
              </button>
            </div>
          </div>
        </mat-step>

      </mat-stepper>
    </div>

    <!-- SIDEBAR -->
    <div class="co-aside">
      <div class="co-aside-wrap">
        <div class="co-aside-hdr">
          <mat-icon>shopping_bag</mat-icon>
          <span>Votre panier ({{ cartCount() }})</span>
        </div>

        <div class="co-aside-items">
          <div *ngFor="let item of cartItems()" class="co-aitem">
            <div class="co-aitem-img-wrap">
              <img [src]="item.product?.images?.[0]" class="co-aitem-img" alt="">
              <span class="co-aitem-qty">{{ item.quantity }}</span>
            </div>
            <div class="co-aitem-info">
              <div class="co-aitem-name">{{ item.product?.name }}</div>
              <div class="co-aitem-price">{{ (item.product?.price || 0) * item.quantity | number }} FCFA</div>
            </div>
          </div>
        </div>

        <div class="co-aside-totals">
          <div class="co-atot-row"><span>Sous-total</span><span>{{ subtotal() | number }} FCFA</span></div>
          <div class="co-atot-row"><span>Livraison</span><span>{{ deliveryCost | number }} FCFA</span></div>
          <div class="co-atot-final">
            <span>Total à payer</span>
            <strong>{{ totalAmount | number }} FCFA</strong>
          </div>
        </div>

        <div class="co-trust-grid">
          <div class="co-trust-item"><div class="co-tric co-tric-g"><mat-icon>security</mat-icon></div><span>Sécurisé</span></div>
          <div class="co-trust-item"><div class="co-tric co-tric-b"><mat-icon>local_shipping</mat-icon></div><span>Livraison rapide</span></div>
          <div class="co-trust-item"><div class="co-tric co-tric-a"><mat-icon>replay</mat-icon></div><span>Retours faciles</span></div>
          <div class="co-trust-item"><div class="co-tric co-tric-p"><mat-icon>support_agent</mat-icon></div><span>Support 7j/7</span></div>
        </div>
      </div>
    </div>

  </div>
</div>
    `,
    styles: [`
:host { display: block; background: #f8fafc; min-height: 100vh; }

.co-hero { background: linear-gradient(135deg, #065f46 0%, #047857 60%, #059669 100%); color: white; padding: 24px 0; }
.co-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.co-hero-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
.co-hero-sub { font-size: 0.875rem; opacity: 0.85; margin: 4px 0 0; }

.co-steps-bar { display: flex; align-items: center; }
.co-step-dot { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.co-step-num { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; background: rgba(255,255,255,.2); border: 2px solid rgba(255,255,255,.35); transition: all .3s; }
.co-step-dot--active .co-step-num { background: white; color: #059669; border-color: white; box-shadow: 0 0 0 4px rgba(255,255,255,.25); }
.co-step-dot--done .co-step-num { background: #a7f3d0; color: #065f46; border-color: #a7f3d0; }
.co-step-lbl { font-size: 0.7rem; opacity: 0.8; white-space: nowrap; }
.co-step-dot--active .co-step-lbl { opacity: 1; font-weight: 600; }
.co-step-line { width: 48px; height: 2px; background: rgba(255,255,255,.3); margin: 0 6px 22px; transition: background .3s; }
.co-step-line--done { background: #a7f3d0; }
.co-chk { font-size: 18px !important; width: 18px !important; height: 18px !important; }

.co-body { max-width: 1200px; margin: 32px auto; padding: 0 24px; display: grid; grid-template-columns: 1fr 360px; gap: 28px; align-items: start; }
@media (max-width: 900px) { .co-body { grid-template-columns: 1fr; } .co-aside { order: -1; } }

::ng-deep .mat-horizontal-stepper-header-container { display: none !important; }
::ng-deep .mat-horizontal-content-container { padding: 0 !important; }
::ng-deep .co-stepper { box-shadow: none !important; background: transparent !important; }
::ng-deep .co-stepper .mat-horizontal-stepper-wrapper { background: transparent !important; }

.co-card { background: white; border-radius: 16px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06); }
.co-card-hdr { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.co-card-ic { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.co-card-ic mat-icon { font-size: 24px; width: 24px; height: 24px; }
.co-ic-grn { background: #dcfce7; color: #059669; }
.co-ic-blue { background: #dbeafe; color: #2563eb; }
.co-ic-pur { background: #ede9fe; color: #7c3aed; }
.co-card-title { font-size: 1.2rem; font-weight: 700; color: #111827; margin: 0; }
.co-card-sub { font-size: 0.85rem; color: #6b7280; margin: 3px 0 0; }

.co-f2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 600px) { .co-f2 { grid-template-columns: 1fr; } }
.co-f { width: 100%; }
.co-fw { width: 100%; display: block; }

.co-actions { display: flex; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
.co-actions-2 { justify-content: space-between; }
.co-btn-next { display: flex; align-items: center; gap: 8px; padding: 12px 28px; background: linear-gradient(135deg, #059669, #047857); color: white; border: none; border-radius: 10px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all .2s; box-shadow: 0 4px 12px rgba(5,150,105,.35); }
.co-btn-next:hover:not([disabled]) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(5,150,105,.45); }
.co-btn-next[disabled] { opacity: 0.5; cursor: not-allowed; }
.co-btn-back { display: flex; align-items: center; gap: 6px; padding: 12px 20px; background: transparent; color: #6b7280; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all .2s; }
.co-btn-back:hover { background: #f9fafb; border-color: #d1d5db; color: #374151; }

.co-opts { display: flex; flex-direction: column; gap: 12px; }
.co-opt { display: flex; align-items: center; gap: 14px; padding: 16px 20px; border: 1.5px solid #e5e7eb; border-radius: 12px; cursor: pointer; transition: all .2s; }
.co-opt:hover { border-color: #a7f3d0; background: #f9fffe; }
.co-opt--sel { border-color: #059669 !important; background: #f0fdf4 !important; }
.co-opt-ic { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.co-opt-ic mat-icon { font-size: 22px; width: 22px; height: 22px; }
.co-oi-std { background: #e0f2fe; color: #0284c7; }
.co-oi-exp { background: #fef3c7; color: #d97706; }
.co-oi-pur { background: #f3e8ff; color: #7c3aed; }
.co-oi-cash { background: #dcfce7; color: #059669; }
.co-opt-txt { flex: 1; min-width: 0; }
.co-opt-name { font-weight: 600; font-size: 0.9rem; color: #111827; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.co-opt-desc { font-size: 0.8rem; color: #6b7280; margin-top: 2px; }
.co-opt-cost { font-weight: 700; font-size: 0.95rem; color: #374151; white-space: nowrap; }
.co-cost-amb { color: #d97706; }
.co-cost-grn { color: #059669; }
.co-radio { flex-shrink: 0; }

.co-pay-logo { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; flex-shrink: 0; }
.co-pl-om { background: #ff6b00; color: white; }
.co-pl-wave { background: #1a56db; color: white; }

.co-tag { font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: .03em; }
.co-tag-org { background: #ffedd5; color: #ea580c; }
.co-tag-amb { background: #fef3c7; color: #b45309; }
.co-tag-grn { background: #dcfce7; color: #059669; }
.co-tag-neu { background: #f1f5f9; color: #475569; }

.co-confirm-box { background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
.co-conf-row { display: flex; align-items: flex-start; gap: 14px; padding: 12px 0; }
.co-conf-div { border-top: 1px solid #d1fae5; }
.co-conf-ic { width: 38px; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.co-conf-ic mat-icon { font-size: 20px; width: 20px; height: 20px; }
.co-conf-ic-grn { background: #dcfce7; color: #059669; }
.co-conf-ic-blue { background: #dbeafe; color: #2563eb; }
.co-conf-ic-pur { background: #ede9fe; color: #7c3aed; }
.co-conf-lbl { font-size: 0.7rem; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; font-weight: 600; }
.co-conf-val { font-size: 0.9rem; font-weight: 700; color: #111827; margin-top: 2px; }
.co-conf-sub { font-size: 0.8rem; color: #6b7280; margin-top: 1px; }

.co-secure-badge { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; color: #6b7280; background: #f8fafc; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; }
.co-secure-badge mat-icon { font-size: 18px; width: 18px; height: 18px; color: #059669; }

.co-btn-confirm { display: flex; align-items: center; gap: 10px; padding: 13px 28px; background: linear-gradient(135deg, #059669, #047857); color: white; border: none; border-radius: 10px; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all .2s; box-shadow: 0 4px 16px rgba(5,150,105,.4); }
.co-btn-confirm:hover:not([disabled]) { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(5,150,105,.5); }
.co-btn-confirm[disabled] { opacity: 0.6; cursor: not-allowed; }
::ng-deep .co-spin { display: inline-flex !important; width: 20px !important; height: 20px !important; }
::ng-deep .co-spin svg { width: 20px !important; height: 20px !important; }
::ng-deep .co-spin circle { stroke: white !important; }

.co-aside-wrap { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06); position: sticky; top: 88px; }
.co-aside-hdr { display: flex; align-items: center; gap: 10px; font-size: 1rem; font-weight: 700; color: #111827; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
.co-aside-hdr mat-icon { color: #059669; }
.co-aside-items { max-height: 260px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; padding-right: 4px; }
.co-aitem { display: flex; gap: 12px; align-items: center; }
.co-aitem-img-wrap { position: relative; flex-shrink: 0; }
.co-aitem-img { width: 54px; height: 54px; object-fit: cover; border-radius: 8px; border: 1px solid #f1f5f9; }
.co-aitem-qty { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; background: #059669; color: white; font-size: 0.7rem; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.co-aitem-info { flex: 1; min-width: 0; }
.co-aitem-name { font-size: 0.82rem; font-weight: 600; color: #374151; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.co-aitem-price { font-size: 0.8rem; color: #059669; font-weight: 600; margin-top: 2px; }
.co-aside-totals { margin-bottom: 20px; }
.co-atot-row { display: flex; justify-content: space-between; font-size: 0.875rem; color: #6b7280; padding: 6px 0; }
.co-atot-final { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1px solid #bbf7d0; border-radius: 10px; margin-top: 8px; font-size: 0.875rem; font-weight: 600; color: #065f46; }
.co-atot-final strong { font-size: 1.1rem; font-weight: 800; }
.co-trust-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
.co-trust-item { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: #6b7280; }
.co-tric { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.co-tric mat-icon { font-size: 14px; width: 14px; height: 14px; }
.co-tric-g { background: #dcfce7; color: #059669; }
.co-tric-b { background: #dbeafe; color: #2563eb; }
.co-tric-a { background: #fef3c7; color: #b45309; }
.co-tric-p { background: #f3e8ff; color: #7c3aed; }

@media (max-width: 600px) {
  .co-hero-inner { flex-direction: column; align-items: flex-start; }
  .co-steps-bar { display: none; }
  .co-body { padding: 0 16px; margin: 16px auto; }
  .co-card { padding: 20px 16px; }
}
    `]
})
export class CheckoutComponent implements OnInit {
    readonly steps = ['Livraison', 'Mode de livraison', 'Paiement', 'Confirmation'];

    shippingForm: FormGroup;
    deliveryForm: FormGroup;
    paymentForm: FormGroup;

    cartItems = this.cartService.cartItems;
    cartCount = this.cartService.itemCount;
    subtotal = this.cartService.totalAmount;

    deliveryCost = 1000;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private cartService: CartService,
        private orderService: OrderService,
        private authService: AuthService,
        private router: Router,
        private notification: NotificationService
    ) {
        this.shippingForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phone: ['', Validators.required],
            city: ['Ouagadougou', Validators.required],
            street: ['', Validators.required]
        });
        this.deliveryForm = this.fb.group({ method: ['standard', Validators.required] });
        this.paymentForm = this.fb.group({ method: ['cash_on_delivery', Validators.required] });
    }

    ngOnInit() {
        if (this.cartItems().length === 0) {
            this.router.navigate(['/cart']);
            return;
        }
        const user = this.authService.currentUser();
        if (user) {
            this.shippingForm.patchValue({
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                city: user.address?.city || 'Ouagadougou',
                street: user.address?.street || ''
            });
        }
    }

    setDeliveryMethod(method: string, cost: number) {
        this.deliveryForm.get('method')?.setValue(method);
        this.deliveryCost = cost;
    }

    get totalAmount() { return this.subtotal() + this.deliveryCost; }

    getDeliveryLabel() {
        const method = this.deliveryForm.get('method')?.value;
        switch (method) {
            case 'express': return 'Express (dans la journée)';
            case 'pickup': return 'Point Relais';
            default: return 'Standard (24h - 48h)';
        }
    }

    getPaymentLabel() {
        const method = this.paymentForm.get('method')?.value;
        switch (method) {
            case 'orange_money': return 'Orange Money';
            case 'wave': return 'Wave';
            case 'cash_on_delivery': return 'Paiement à la livraison';
            default: return method;
        }
    }

    placeOrder() {
        if (this.shippingForm.invalid || this.paymentForm.invalid) return;
        this.isLoading = true;
        const mockOrder: any = {
            userId: this.authService.currentUser()?.id || 1,
            orderNumber: 'ORD-' + Date.now(),
            status: 'pending',
            items: this.cartItems().map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product?.price || 0,
                total: (item.product?.price || 0) * item.quantity,
                name: item.product?.name || 'Produit',
                vendorId: item.product?.vendorId || 0
            })),
            subtotal: this.subtotal(),
            shippingCost: this.deliveryCost,
            tax: 0, discount: 0,
            total: this.totalAmount,
            paymentMethod: this.paymentForm.value.method,
            paymentStatus: 'pending',
            shippingAddress: {
                street: this.shippingForm.value.street,
                city: this.shippingForm.value.city,
                region: 'Centre', postalCode: '00000', country: 'Burkina Faso'
            },
            createdAt: new Date().toISOString()
        };
        this.orderService.createOrder(mockOrder).subscribe({
            next: (order) => {
                this.isLoading = false;
                this.cartService.clearCart();
                this.notification.success('Commande validée avec succès !');
                this.router.navigate(['/checkout/success', order.id]);
            },
            error: () => {
                this.isLoading = false;
                this.notification.error('Erreur lors de la commande. Veuillez réessayer.');
            }
        });
    }
}
