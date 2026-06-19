import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '@core/services/auth.service';
import { OrderService } from '@core/services/order.service';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterLinkActive, RouterOutlet,
    MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule, MatTooltipModule
  ],
  template: `
    <div class="shell">

      <!-- Mobile overlay -->
      <div class="overlay" *ngIf="sidebarOpen" (click)="sidebarOpen = false"></div>

      <!-- ─── Sidebar ─────────────────────────────────────────── -->
      <aside class="sidebar" [class.open]="sidebarOpen">

        <!-- Logo -->
        <div class="sb-logo">
          <div class="sb-logo-mark">
            <mat-icon>storefront</mat-icon>
          </div>
          <div>
            <div class="sb-brand">LocalMarket</div>
            <div class="sb-subtitle">Espace Vendeur</div>
          </div>
        </div>

        <!-- Nav -->
        <nav class="sb-nav">
          <div class="sb-section">
            <span class="sb-section-label">APERÇU</span>
            <a routerLink="./analytics" routerLinkActive="active" [routerLinkActiveOptions]="{exact:false}" class="sb-link">
              <span class="sb-link-icon"><mat-icon>grid_view</mat-icon></span>
              <span>Tableau de bord</span>
            </a>
          </div>

          <div class="sb-section">
            <span class="sb-section-label">GESTION</span>
            <a routerLink="./products" routerLinkActive="active" class="sb-link">
              <span class="sb-link-icon"><mat-icon>inventory_2</mat-icon></span>
              <span>Mes Produits</span>
            </a>
            <a routerLink="./orders" routerLinkActive="active" class="sb-link">
              <span class="sb-link-icon"><mat-icon>shopping_bag</mat-icon></span>
              <span class="sb-link-grow">Commandes</span>
              <span class="sb-pill" *ngIf="pendingOrders > 0">{{ pendingOrders }}</span>
            </a>
          </div>

          <div class="sb-section">
            <span class="sb-section-label">BOUTIQUE</span>
            <a routerLink="./profile" routerLinkActive="active" class="sb-link">
              <span class="sb-link-icon"><mat-icon>store</mat-icon></span>
              <span>Ma Boutique</span>
            </a>
            <a routerLink="./support" routerLinkActive="active" class="sb-link">
              <span class="sb-link-icon"><mat-icon>help_outline</mat-icon></span>
              <span>Aide & Support</span>
            </a>
          </div>
        </nav>

        <!-- User card (bottom) -->
        <div class="sb-user">
          <div class="sb-avatar">{{ initials }}</div>
          <div class="sb-user-info">
            <span class="sb-user-name">{{ user()?.firstName }} {{ user()?.lastName }}</span>
            <span class="sb-user-badge">
              <span class="sb-dot"></span>Vendeur vérifié
            </span>
          </div>
          <button mat-icon-button class="sb-logout" (click)="logout()" matTooltip="Déconnexion" matTooltipPosition="right">
            <mat-icon>logout</mat-icon>
          </button>
        </div>
      </aside>

      <!-- ─── Main ──────────────────────────────────────────────── -->
      <div class="main">

        <!-- Header -->
        <header class="topbar">
          <div class="topbar-left">
            <button class="hamburger" (click)="sidebarOpen = !sidebarOpen">
              <mat-icon>{{ sidebarOpen ? 'close' : 'menu' }}</mat-icon>
            </button>
            <div>
              <h1 class="topbar-title">{{ getPageTitle() }}</h1>
              <p class="topbar-date">{{ currentDate }}</p>
            </div>
          </div>

          <div class="topbar-right">
            <!-- Notifications -->
            <button mat-icon-button class="topbar-icon-btn" [matMenuTriggerFor]="notifMenu">
              <mat-icon>notifications_none</mat-icon>
              <span class="notif-dot" *ngIf="pendingOrders > 0"></span>
            </button>
            <mat-menu #notifMenu="matMenu" class="notif-menu">
              <div class="notif-panel">
                <div class="notif-header">Notifications</div>
                <div class="notif-item" *ngIf="pendingOrders > 0">
                  <div class="notif-icon orange"><mat-icon>shopping_bag</mat-icon></div>
                  <div>
                    <p class="notif-text">{{ pendingOrders }} commande(s) en attente</p>
                    <p class="notif-time">Maintenant</p>
                  </div>
                </div>
                <div class="notif-empty" *ngIf="pendingOrders === 0">
                  <mat-icon>check_circle</mat-icon>
                  <span>Tout est à jour</span>
                </div>
              </div>
            </mat-menu>

            <!-- User menu -->
            <button mat-button class="topbar-user" [matMenuTriggerFor]="userMenu">
              <div class="topbar-avatar">{{ initials }}</div>
              <span class="topbar-name">{{ user()?.firstName }}</span>
              <mat-icon class="topbar-chevron">expand_more</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item routerLink="./profile">
                <mat-icon>store</mat-icon> Ma Boutique
              </button>
              <button mat-menu-item routerLink="/">
                <mat-icon>home</mat-icon> Retour au site
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()" class="logout-item">
                <mat-icon>logout</mat-icon> Déconnexion
              </button>
            </mat-menu>
          </div>
        </header>

        <!-- Page content -->
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex: 1; min-height: 0; }

    /* ── Shell ──────────────────────────────────────────── */
    .shell { display: flex; width: 100%; height: 100%; overflow: hidden; position: relative; }
    .overlay {
      position: fixed; inset: 0;
      background: rgba(2,6,23,0.65);
      backdrop-filter: blur(4px);
      z-index: 99;
    }

    /* ── Sidebar ────────────────────────────────────────── */
    .sidebar {
      width: 256px; flex-shrink: 0;
      background: #020617;
      display: flex; flex-direction: column;
      border-right: 1px solid rgba(255,255,255,0.04);
      z-index: 100;
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    }

    /* Logo */
    .sb-logo {
      display: flex; align-items: center; gap: 12px;
      padding: 20px 18px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .sb-logo-mark {
      width: 38px; height: 38px;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 20px rgba(34,197,94,0.25);
      flex-shrink: 0;
    }
    .sb-logo-mark mat-icon { color: white; font-size: 21px; width: 21px; height: 21px; }
    .sb-brand { font-size: 0.95rem; font-weight: 700; color: #f8fafc; letter-spacing: -0.02em; }
    .sb-subtitle { font-size: 0.65rem; color: rgba(255,255,255,0.3); margin-top: 1px; }

    /* Navigation */
    .sb-nav { flex: 1; overflow-y: auto; padding: 12px 10px; }
    .sb-nav::-webkit-scrollbar { width: 3px; }
    .sb-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

    .sb-section { margin-bottom: 20px; }
    .sb-section-label {
      font-size: 0.58rem; font-weight: 700;
      color: rgba(255,255,255,0.2);
      letter-spacing: 0.12em;
      padding: 0 10px; display: block; margin-bottom: 4px;
    }
    .sb-link {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 10px; border-radius: 8px;
      color: rgba(255,255,255,0.45);
      text-decoration: none; font-size: 0.85rem; font-weight: 500;
      transition: all 0.15s ease;
      margin-bottom: 1px;
    }
    .sb-link:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }
    .sb-link.active {
      background: rgba(34,197,94,0.12);
      color: #4ade80;
      border: 1px solid rgba(74,222,128,0.12);
    }
    .sb-link.active .sb-link-icon mat-icon { color: #4ade80; }
    .sb-link-icon { display: flex; flex-shrink: 0; }
    .sb-link-icon mat-icon { font-size: 18px; width: 18px; height: 18px; color: inherit; }
    .sb-link-grow { flex: 1; }
    .sb-pill {
      background: #ef4444; color: white;
      font-size: 0.6rem; font-weight: 700;
      padding: 2px 6px; border-radius: 20px;
      min-width: 18px; text-align: center;
    }

    /* User card */
    .sb-user {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 14px;
      border-top: 1px solid rgba(255,255,255,0.05);
      background: rgba(255,255,255,0.015);
    }
    .sb-avatar {
      width: 34px; height: 34px; flex-shrink: 0;
      background: linear-gradient(135deg, #22c55e, #15803d);
      border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 700; color: white;
    }
    .sb-user-info { flex: 1; min-width: 0; }
    .sb-user-name { font-size: 0.78rem; font-weight: 600; color: #f1f5f9; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sb-user-badge { display: flex; align-items: center; gap: 4px; font-size: 0.62rem; color: #4ade80; }
    .sb-dot { width: 5px; height: 5px; background: #4ade80; border-radius: 50%; flex-shrink: 0; }
    .sb-logout { color: rgba(255,255,255,0.25) !important; }
    .sb-logout:hover { color: #f87171 !important; }

    /* ── Main ───────────────────────────────────────────── */
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #f8fafc; min-width: 0; }

    /* Topbar */
    .topbar {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      height: 60px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 24px;
      box-shadow: 0 1px 0 rgba(0,0,0,0.04);
    }
    .topbar-left { display: flex; align-items: center; gap: 14px; }
    .hamburger {
      display: none; width: 36px; height: 36px;
      border: 1px solid #e2e8f0; background: white;
      border-radius: 8px; cursor: pointer;
      align-items: center; justify-content: center;
      color: #64748b; transition: all 0.15s;
    }
    .hamburger:hover { background: #f8fafc; border-color: #cbd5e1; }
    .hamburger mat-icon { font-size: 18px; }
    .topbar-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.2; }
    .topbar-date { font-size: 0.7rem; color: #94a3b8; margin: 0; }
    .topbar-right { display: flex; align-items: center; gap: 4px; }
    .topbar-icon-btn { position: relative !important; color: #475569 !important; }
    .notif-dot {
      position: absolute; top: 10px; right: 10px;
      width: 7px; height: 7px;
      background: #ef4444; border-radius: 50%;
      border: 1.5px solid white;
    }
    .topbar-user {
      display: flex !important; align-items: center !important; gap: 8px !important;
      padding: 4px 10px !important; border-radius: 10px !important;
      color: #334155 !important; min-width: unset !important;
    }
    .topbar-user:hover { background: #f8fafc !important; }
    .topbar-avatar {
      width: 30px; height: 30px;
      background: linear-gradient(135deg, #22c55e, #15803d);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.7rem; font-weight: 700; color: white;
    }
    .topbar-name { font-size: 0.85rem; font-weight: 600; }
    .topbar-chevron { font-size: 18px !important; color: #94a3b8; }

    /* Notifications panel */
    .notif-panel { width: 280px; padding: 14px; }
    .notif-header { font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
    .notif-item { display: flex; align-items: flex-start; gap: 10px; padding: 8px; background: #fff7ed; border-radius: 8px; }
    .notif-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .notif-icon.orange { background: #fed7aa; }
    .notif-icon.orange mat-icon { color: #ea580c; font-size: 18px; }
    .notif-text { font-size: 0.8rem; color: #374151; font-weight: 500; }
    .notif-time { font-size: 0.7rem; color: #9ca3af; }
    .notif-empty { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px; color: #9ca3af; font-size: 0.8rem; }
    .notif-empty mat-icon { color: #86efac; font-size: 28px; }
    .logout-item { color: #dc2626 !important; }

    /* Content */
    .content { flex: 1; overflow-y: auto; padding: 24px 28px; }
    .content::-webkit-scrollbar { width: 5px; }
    .content::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    .content::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    /* ── Responsive ─────────────────────────────────────── */
    @media (max-width: 900px) {
      .sidebar {
        position: fixed; top: 0; left: 0; height: 100vh;
        transform: translateX(-100%);
      }
      .sidebar.open { transform: translateX(0); }
      .hamburger { display: flex; }
    }
    @media (max-width: 600px) {
      .topbar-date { display: none; }
      .topbar-name { display: none; }
      .content { padding: 16px; }
    }
  `]
})
export class VendorDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  user = this.authService.currentUser;
  pendingOrders = 0;
  sidebarOpen = false;

  readonly currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  get initials(): string {
    const u = this.user();
    if (!u) return 'V';
    return (`${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`).toUpperCase() || 'V';
  }

  ngOnInit() {
    const vendorId = this.user()?.vendorId || 1;
    this.orderService.getOrders().subscribe(orders => {
      this.pendingOrders = orders.filter(o =>
        o.status === 'pending' &&
        o.items.some((item: any) => item.vendorId === vendorId)
      ).length;
    });
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('analytics')) return 'Tableau de bord';
    if (url.includes('products')) return 'Mes Produits';
    if (url.includes('orders')) return 'Commandes';
    if (url.includes('profile')) return 'Ma Boutique';
    if (url.includes('support')) return 'Aide & Support';
    return 'Tableau de bord';
  }

  logout() { this.authService.logout(); }
}
