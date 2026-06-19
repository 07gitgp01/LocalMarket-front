import { Routes } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';

import { VendorDashboardComponent } from './vendor-dashboard.component';
import { VendorAnalyticsComponent } from './analytics/vendor-analytics.component';
import { VendorProductsComponent } from './products/vendor-products.component';
import { VendorOrdersComponent } from './orders/vendor-orders.component';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

// ── Vendor Profile Component ────────────────────────────────────────────────
@Component({
  selector: 'app-vendor-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDividerModule
  ],
  template: `
    <!-- Header -->
    <div class="pr-header">
      <div>
        <h1 class="pr-title">Ma Boutique</h1>
        <p class="pr-sub">Personnalisez votre profil vendeur</p>
      </div>
    </div>

    <div class="pr-layout">

      <!-- ── Left: Identity card ── -->
      <div class="pr-id-card">
        <div class="pr-avatar-wrap">
          <div class="pr-avatar">{{ initials }}</div>
          <div class="pr-verified">
            <mat-icon>verified</mat-icon> Vendeur vérifié
          </div>
        </div>
        <h2 class="pr-name">{{ user()?.firstName }} {{ user()?.lastName }}</h2>
        <p class="pr-email">{{ user()?.email }}</p>

        <div class="pr-divider"></div>

        <div class="pr-meta-list">
          <div class="pr-meta-item">
            <div class="pr-meta-icon"><mat-icon>location_on</mat-icon></div>
            <div>
              <div class="pr-meta-val">{{ form.value.city || '—' }}</div>
              <div class="pr-meta-lbl">Ville</div>
            </div>
          </div>
          <div class="pr-meta-item">
            <div class="pr-meta-icon"><mat-icon>map</mat-icon></div>
            <div>
              <div class="pr-meta-val">{{ form.value.region || '—' }}</div>
              <div class="pr-meta-lbl">Région</div>
            </div>
          </div>
          <div class="pr-meta-item">
            <div class="pr-meta-icon"><mat-icon>phone</mat-icon></div>
            <div>
              <div class="pr-meta-val">{{ form.value.phone || 'Non renseigné' }}</div>
              <div class="pr-meta-lbl">Téléphone</div>
            </div>
          </div>
        </div>

        <button mat-stroked-button class="pr-logo-btn">
          <mat-icon>upload</mat-icon> Changer le logo
        </button>
      </div>

      <!-- ── Right: Edit form ── -->
      <div class="pr-form-card">
        <form [formGroup]="form" (ngSubmit)="save()">

          <div class="pr-section">
            <div class="pr-section-head">
              <div class="pr-section-icon"><mat-icon>store</mat-icon></div>
              <div>
                <div class="pr-section-title">Informations de la boutique</div>
                <div class="pr-section-sub">Nom et description visibles par vos clients</div>
              </div>
            </div>
            <mat-form-field appearance="outline" class="pr-field">
              <mat-label>Nom de la boutique</mat-label>
              <input matInput formControlName="shopName" placeholder="Ex: Ferme Bio Sawadogo">
              <mat-icon matPrefix>storefront</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline" class="pr-field">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3"
                placeholder="Décrivez votre activité, vos produits, votre région..."></textarea>
            </mat-form-field>
          </div>

          <div class="pr-section">
            <div class="pr-section-head">
              <div class="pr-section-icon green"><mat-icon>location_on</mat-icon></div>
              <div>
                <div class="pr-section-title">Localisation</div>
                <div class="pr-section-sub">Région et ville d'activité</div>
              </div>
            </div>
            <div class="pr-row2">
              <mat-form-field appearance="outline" class="pr-field">
                <mat-label>Région</mat-label>
                <mat-select formControlName="region">
                  <mat-option value="Centre">Centre</mat-option>
                  <mat-option value="Hauts-Bassins">Hauts-Bassins</mat-option>
                  <mat-option value="Cascades">Cascades</mat-option>
                  <mat-option value="Sahel">Sahel</mat-option>
                  <mat-option value="Est">Est</mat-option>
                  <mat-option value="Nord">Nord</mat-option>
                  <mat-option value="Boucle du Mouhoun">Boucle du Mouhoun</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="pr-field">
                <mat-label>Ville</mat-label>
                <input matInput formControlName="city">
              </mat-form-field>
            </div>
          </div>

          <div class="pr-section">
            <div class="pr-section-head">
              <div class="pr-section-icon violet"><mat-icon>contacts</mat-icon></div>
              <div>
                <div class="pr-section-title">Contact professionnel</div>
                <div class="pr-section-sub">Numéro utilisé pour les commandes</div>
              </div>
            </div>
            <mat-form-field appearance="outline" class="pr-field">
              <mat-label>Téléphone</mat-label>
              <input matInput formControlName="phone" placeholder="+226 XX XX XX XX">
              <mat-icon matPrefix>phone</mat-icon>
            </mat-form-field>
          </div>

          <div class="pr-footer">
            <button type="button" mat-button class="pr-cancel" (click)="form.reset()">Annuler</button>
            <button type="submit" mat-flat-button color="primary" class="pr-save" [disabled]="form.invalid || isLoading">
              <mat-icon>{{ isLoading ? 'hourglass_empty' : 'save' }}</mat-icon>
              {{ isLoading ? 'Enregistrement…' : 'Sauvegarder' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .pr-header { margin-bottom: 20px; }
    .pr-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; }
    .pr-sub { font-size: 0.78rem; color: #94a3b8; margin: 4px 0 0; }

    .pr-layout { display: grid; grid-template-columns: 280px 1fr; gap: 20px; }

    /* Identity card */
    .pr-id-card {
      background: linear-gradient(160deg, #0f172a 0%, #1e293b 100%);
      border-radius: 16px; padding: 24px;
      display: flex; flex-direction: column; align-items: center;
      color: white;
    }
    .pr-avatar-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 12px; }
    .pr-avatar {
      width: 72px; height: 72px;
      background: linear-gradient(135deg, #22c55e, #15803d);
      border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.6rem; font-weight: 800; color: white;
      box-shadow: 0 8px 24px rgba(34,197,94,0.3);
    }
    .pr-verified {
      display: flex; align-items: center; gap: 4px;
      background: rgba(74,222,128,0.15); border: 1px solid rgba(74,222,128,0.25);
      color: #4ade80; font-size: 0.68rem; font-weight: 700;
      padding: 3px 10px; border-radius: 20px;
    }
    .pr-verified mat-icon { font-size: 13px; }
    .pr-name { font-size: 1rem; font-weight: 700; color: #f1f5f9; margin: 0 0 4px; text-align: center; }
    .pr-email { font-size: 0.72rem; color: rgba(255,255,255,0.4); margin: 0; text-align: center; }
    .pr-divider { width: 100%; height: 1px; background: rgba(255,255,255,0.07); margin: 16px 0; }
    .pr-meta-list { width: 100%; display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
    .pr-meta-item { display: flex; align-items: center; gap: 10px; }
    .pr-meta-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: rgba(255,255,255,0.07);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .pr-meta-icon mat-icon { font-size: 16px; color: rgba(255,255,255,0.5); }
    .pr-meta-val { font-size: 0.82rem; font-weight: 600; color: #f1f5f9; }
    .pr-meta-lbl { font-size: 0.65rem; color: rgba(255,255,255,0.3); }
    .pr-logo-btn { width: 100%; color: rgba(255,255,255,0.6) !important; border-color: rgba(255,255,255,0.15) !important; border-radius: 10px !important; font-size: 0.8rem !important; }

    /* Form card */
    .pr-form-card {
      background: white; border-radius: 16px; padding: 24px;
      border: 1px solid #f1f5f9;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .pr-section { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #f8fafc; }
    .pr-section:last-of-type { border-bottom: none; }
    .pr-section-head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
    .pr-section-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      display: flex; align-items: center; justify-content: center;
    }
    .pr-section-icon.green  { background: linear-gradient(135deg, #22c55e, #15803d); }
    .pr-section-icon.violet { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
    .pr-section-icon mat-icon { font-size: 18px; color: white; }
    .pr-section-title { font-size: 0.9rem; font-weight: 700; color: #0f172a; }
    .pr-section-sub { font-size: 0.72rem; color: #94a3b8; margin-top: 2px; }
    .pr-field { width: 100%; display: block; margin-bottom: 4px; }
    .pr-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .pr-footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 8px; }
    .pr-cancel { color: #64748b !important; border-radius: 10px !important; }
    .pr-save { border-radius: 10px !important; font-weight: 600 !important; }

    @media (max-width: 900px) {
      .pr-layout { grid-template-columns: 1fr; }
      .pr-id-card { flex-direction: row; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
      .pr-meta-list { flex-direction: row; flex-wrap: wrap; gap: 12px; margin-bottom: 0; }
      .pr-logo-btn { width: auto; }
    }
  `]
})
export class VendorProfileComponent {
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private fb = inject(FormBuilder);

  user = this.authService.currentUser;
  isLoading = false;

  get initials() {
    const u = this.user();
    if (!u) return 'V';
    return `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase() || 'V';
  }

  form: FormGroup = this.fb.group({
    shopName:    ['Ma Boutique Locale', Validators.required],
    description: [''],
    region:      ['Centre'],
    city:        ['Ouagadougou'],
    phone:       ['']
  });

  save() {
    if (this.form.invalid) return;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.notification.success('Boutique mise à jour avec succès');
    }, 800);
  }
}

// ── Vendor Support Component ─────────────────────────────────────────────────
@Component({
  selector: 'app-vendor-support',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatExpansionModule, MatChipsModule
  ],
  template: `
    <!-- Header -->
    <div class="sp-header">
      <div>
        <h1 class="sp-title">Aide & Support</h1>
        <p class="sp-sub">Comment pouvons-nous vous aider aujourd'hui ?</p>
      </div>
    </div>

    <!-- Contact channels -->
    <div class="sp-channels">
      <div class="sp-channel">
        <div class="sp-ch-icon blue"><mat-icon>chat_bubble</mat-icon></div>
        <div class="sp-ch-label">Chat en direct</div>
        <div class="sp-ch-info">Lun-Ven 8h–18h</div>
        <div class="sp-ch-status online"><span></span>En ligne</div>
      </div>
      <div class="sp-channel">
        <div class="sp-ch-icon green"><mat-icon>phone_in_talk</mat-icon></div>
        <div class="sp-ch-label">+226 25 30 00 00</div>
        <div class="sp-ch-info">Support téléphonique</div>
        <div class="sp-ch-status">Lun-Sam 7h–20h</div>
      </div>
      <div class="sp-channel">
        <div class="sp-ch-icon amber"><mat-icon>mail_outline</mat-icon></div>
        <div class="sp-ch-label">vendeurs&#64;localmarket.bf</div>
        <div class="sp-ch-info">E-mail support</div>
        <div class="sp-ch-status">Réponse sous 24h</div>
      </div>
    </div>

    <!-- Main content -->
    <div class="sp-layout">

      <!-- ── FAQ ── -->
      <div class="sp-faq-card">
        <div class="sp-card-head">
          <div class="sp-head-icon"><mat-icon>quiz</mat-icon></div>
          <div>
            <div class="sp-card-title">Questions fréquentes</div>
            <div class="sp-card-sub">{{ faqs.length }} réponses disponibles</div>
          </div>
        </div>

        <mat-accordion class="sp-accordion">
          <mat-expansion-panel *ngFor="let faq of faqs; let i = index" class="sp-panel">
            <mat-expansion-panel-header class="sp-panel-header">
              <mat-panel-title class="sp-panel-title">
                <span class="sp-faq-num">{{ i + 1 }}</span>
                {{ faq.question }}
              </mat-panel-title>
            </mat-expansion-panel-header>
            <div class="sp-panel-body">{{ faq.answer }}</div>
          </mat-expansion-panel>
        </mat-accordion>
      </div>

      <!-- ── Message form ── -->
      <div class="sp-form-card">
        <div class="sp-card-head">
          <div class="sp-head-icon violet"><mat-icon>send</mat-icon></div>
          <div>
            <div class="sp-card-title">Envoyer un message</div>
            <div class="sp-card-sub">Notre équipe répond sous 24h</div>
          </div>
        </div>

        <form [formGroup]="contactForm" (ngSubmit)="sendMessage()">
          <mat-form-field appearance="outline" class="sp-field">
            <mat-label>Sujet</mat-label>
            <mat-select formControlName="subject">
              <mat-option value="commande">Problème de commande</mat-option>
              <mat-option value="produit">Gestion de produit</mat-option>
              <mat-option value="paiement">Paiement</mat-option>
              <mat-option value="compte">Compte vendeur</mat-option>
              <mat-option value="autre">Autre demande</mat-option>
            </mat-select>
            <mat-icon matPrefix>label_outline</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="sp-field">
            <mat-label>Votre message</mat-label>
            <textarea matInput formControlName="message" rows="5"
              placeholder="Décrivez votre problème en détail…"></textarea>
          </mat-form-field>
          <button type="submit" mat-flat-button color="primary" class="sp-send-btn"
            [disabled]="contactForm.invalid || isSending">
            <mat-icon>{{ isSending ? 'hourglass_empty' : 'send' }}</mat-icon>
            {{ isSending ? 'Envoi en cours…' : 'Envoyer le message' }}
          </button>
        </form>

        <div class="sp-reassure">
          <mat-icon>security</mat-icon>
          Vos informations sont confidentielles et protégées.
        </div>
      </div>

    </div>
  `,
  styles: [`
    .sp-header { margin-bottom: 20px; }
    .sp-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; }
    .sp-sub { font-size: 0.78rem; color: #94a3b8; margin: 4px 0 0; }

    /* Channels */
    .sp-channels { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
    .sp-channel {
      background: white; border-radius: 14px; padding: 18px;
      border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .sp-channel:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.07); transform: translateY(-1px); }
    .sp-ch-icon {
      width: 40px; height: 40px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; margin-bottom: 6px;
    }
    .sp-ch-icon mat-icon { font-size: 20px; color: white; }
    .sp-ch-icon.blue  { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .sp-ch-icon.green { background: linear-gradient(135deg, #22c55e, #15803d); }
    .sp-ch-icon.amber { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .sp-ch-label { font-size: 0.85rem; font-weight: 700; color: #1e293b; }
    .sp-ch-info  { font-size: 0.7rem; color: #94a3b8; }
    .sp-ch-status { font-size: 0.68rem; color: #64748b; display: flex; align-items: center; gap: 4px; }
    .sp-ch-status.online { color: #16a34a; }
    .sp-ch-status.online span { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; }

    /* Layout */
    .sp-layout { display: grid; grid-template-columns: 1fr 360px; gap: 18px; }

    .sp-faq-card, .sp-form-card {
      background: white; border-radius: 14px; padding: 22px;
      border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .sp-card-head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 18px; }
    .sp-head-icon {
      width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
      background: linear-gradient(135deg, #22c55e, #15803d);
      display: flex; align-items: center; justify-content: center;
    }
    .sp-head-icon.violet { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
    .sp-head-icon mat-icon { font-size: 19px; color: white; }
    .sp-card-title { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
    .sp-card-sub   { font-size: 0.72rem; color: #94a3b8; margin-top: 2px; }

    /* FAQ accordion */
    .sp-accordion { display: flex; flex-direction: column; gap: 6px; }
    ::ng-deep .sp-panel {
      border-radius: 10px !important; border: 1px solid #f1f5f9 !important;
      box-shadow: none !important; margin: 0 !important;
    }
    ::ng-deep .sp-panel .mat-expansion-panel-header { border-radius: 10px !important; padding: 0 16px !important; }
    ::ng-deep .sp-panel.mat-expanded .mat-expansion-panel-header { background: #f8fafc !important; border-radius: 10px 10px 0 0 !important; }
    .sp-panel-title { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600; color: #1e293b; }
    .sp-faq-num {
      width: 22px; height: 22px; border-radius: 6px;
      background: #f1f5f9; color: #64748b;
      font-size: 0.65rem; font-weight: 800;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    ::ng-deep .sp-panel.mat-expanded .sp-faq-num { background: #dcfce7; color: #16a34a; }
    .sp-panel-body { font-size: 0.82rem; color: #475569; line-height: 1.7; padding: 0 16px 12px; }

    /* Form */
    .sp-field { width: 100%; display: block; margin-bottom: 4px; }
    .sp-send-btn { width: 100%; border-radius: 10px !important; font-weight: 600 !important; margin-top: 4px; }
    .sp-reassure {
      display: flex; align-items: center; gap: 6px;
      font-size: 0.7rem; color: #94a3b8; margin-top: 12px;
    }
    .sp-reassure mat-icon { font-size: 14px; color: #cbd5e1; }

    @media (max-width: 900px) {
      .sp-channels { grid-template-columns: 1fr; }
      .sp-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class VendorSupportComponent {
  private notification = inject(NotificationService);
  private fb = inject(FormBuilder);

  isSending = false;

  faqs = [
    { question: 'Comment ajouter un nouveau produit ?', answer: 'Allez dans "Mes Produits" puis cliquez sur "Nouveau Produit". Remplissez les informations et publiez votre produit.' },
    { question: 'Comment traiter une commande ?', answer: 'Dans "Commandes", cliquez sur "Traiter" pour les commandes en attente. Le client recevra une notification.' },
    { question: 'Comment modifier mes informations de boutique ?', answer: 'Allez dans "Ma Boutique" et modifiez vos informations. Les changements sont visibles immédiatement.' },
    { question: 'Quand suis-je payé pour mes ventes ?', answer: 'Les paiements sont effectués tous les lundis pour les commandes livrées de la semaine précédente, sur votre compte Mobile Money enregistré.' },
    { question: 'Comment signaler un problème avec une commande ?', answer: 'Utilisez le formulaire de contact ci-contre ou appelez notre équipe support. Précisez le numéro de commande.' },
  ];

  contactForm: FormGroup = this.fb.group({
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  sendMessage() {
    if (this.contactForm.invalid) return;
    this.isSending = true;
    setTimeout(() => {
      this.isSending = false;
      this.contactForm.reset();
      this.notification.success('Message envoyé ! Notre équipe vous répondra sous 24h.');
    }, 800);
  }
}

// ── Routes ───────────────────────────────────────────────────────────────────
export const VENDOR_DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: VendorDashboardComponent,
        children: [
            { path: '', redirectTo: 'analytics', pathMatch: 'full' },
            { path: 'analytics', component: VendorAnalyticsComponent },
            { path: 'products', component: VendorProductsComponent },
            { path: 'orders', component: VendorOrdersComponent },
            { path: 'profile', component: VendorProfileComponent },
            { path: 'support', component: VendorSupportComponent },
        ]
    }
];
