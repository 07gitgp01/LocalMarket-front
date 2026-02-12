import { Component, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule
  ],
  template: `
    <header class="modern-header" [class.scrolled]="isScrolled">
      <div class="header-container">
        <!-- Logo -->
        <a routerLink="/" class="logo-section">
          <div class="logo-icon">
            <mat-icon>storefront</mat-icon>
          </div>
          <div class="logo-text">
            <span class="brand-name">LocalMarket</span>
            <span class="brand-tagline">.bf</span>
          </div>
        </a>

        <!-- Search Bar (Desktop) -->
        <div class="search-section">
          <div class="search-wrapper">
            <mat-icon class="search-icon">search</mat-icon>
            <input 
              type="text" 
              placeholder="Rechercher des produits locaux..." 
              class="search-input"
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
            >
            <button mat-icon-button class="search-btn" (click)="onSearch()">
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>
        </div>

        <!-- Navigation Links (Desktop) -->
        <nav class="nav-links">
          <a routerLink="/products" routerLinkActive="active" class="nav-link">
            <mat-icon>shopping_bag</mat-icon>
            <span>Produits</span>
          </a>
          <a routerLink="/vendors" routerLinkActive="active" class="nav-link">
            <mat-icon>store</mat-icon>
            <span>Vendeurs</span>
          </a>
          <a routerLink="/regions" routerLinkActive="active" class="nav-link">
            <mat-icon>place</mat-icon>
            <span>Régions</span>
          </a>
        </nav>

        <!-- Actions -->
        <div class="header-actions">
          <!-- Region Selector -->
          <button mat-button [matMenuTriggerFor]="regionMenu" class="region-btn">
            <mat-icon>place</mat-icon>
            <span class="region-text">{{ selectedRegion }}</span>
            <mat-icon class="dropdown-icon">arrow_drop_down</mat-icon>
          </button>

          <!-- Cart -->
          <a routerLink="/cart" class="cart-btn" mat-icon-button>
            <mat-icon [matBadge]="cartCount()" [matBadgeHidden]="cartCount() === 0" matBadgeColor="warn">
              shopping_cart
            </mat-icon>
          </a>

          <!-- User Menu -->
          <ng-container *ngIf="isAuthenticated(); else loginBtn">
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
              <img 
                [src]="userAvatar() || 'https://ui-avatars.com/api/?name=' + userName() + '&background=10b981&color=fff'" 
                class="user-avatar"
                alt="Avatar"
              >
              <span class="user-name">{{ userName() }}</span>
              <mat-icon class="dropdown-icon">arrow_drop_down</mat-icon>
            </button>
          </ng-container>

          <ng-template #loginBtn>
            <a routerLink="/auth/login" mat-flat-button color="primary" class="login-btn">
              <mat-icon>login</mat-icon>
              <span>Connexion</span>
            </a>
          </ng-template>

          <!-- Mobile Menu -->
          <button mat-icon-button class="mobile-menu-btn" (click)="toggleMobileMenu()">
            <mat-icon>menu</mat-icon>
          </button>
        </div>
      </div>
    </header>

    <!-- Menus -->
    <mat-menu #regionMenu="matMenu" class="custom-menu">
      <button mat-menu-item (click)="selectRegion('Toutes')">
        <mat-icon>public</mat-icon>
        <span>Toutes les régions</span>
      </button>
      <mat-divider></mat-divider>
      <button mat-menu-item (click)="selectRegion('Ouagadougou')">
        <mat-icon>location_city</mat-icon>
        <span>Ouagadougou</span>
      </button>
      <button mat-menu-item (click)="selectRegion('Bobo-Dioulasso')">
        <mat-icon>location_city</mat-icon>
        <span>Bobo-Dioulasso</span>
      </button>
      <button mat-menu-item (click)="selectRegion('Koudougou')">
        <mat-icon>location_city</mat-icon>
        <span>Koudougou</span>
      </button>
    </mat-menu>

    <mat-menu #userMenu="matMenu" class="custom-menu user-menu">
      <div class="user-menu-header">
        <img [src]="userAvatar() || 'https://ui-avatars.com/api/?name=' + userName()" class="menu-avatar">
        <div class="menu-user-info">
          <div class="menu-user-name">{{ userName() }}</div>
          <div class="menu-user-email">{{ userEmail() }}</div>
        </div>
      </div>
      <mat-divider></mat-divider>
      <button mat-menu-item routerLink="/profile">
        <mat-icon>person</mat-icon>
        <span>Mon Profil</span>
      </button>
      <button mat-menu-item routerLink="/orders">
        <mat-icon>receipt</mat-icon>
        <span>Mes Commandes</span>
      </button>
      
      <ng-container *ngIf="isVendor()">
        <mat-divider></mat-divider>
        <button mat-menu-item routerLink="/vendors/dashboard" class="vendor-link">
          <mat-icon>store</mat-icon>
          <span>Espace Vendeur</span>
        </button>
      </ng-container>

      <ng-container *ngIf="isAdmin()">
        <mat-divider></mat-divider>
        <button mat-menu-item routerLink="/admin" class="admin-link">
          <mat-icon>admin_panel_settings</mat-icon>
          <span>Administration</span>
        </button>
      </ng-container>

      <mat-divider></mat-divider>
      <button mat-menu-item (click)="logout()" class="logout-btn">
        <mat-icon>logout</mat-icon>
        <span>Déconnexion</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .modern-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .modern-header.scrolled {
      background: rgba(16, 185, 129, 0.95);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }

    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    /* Logo */
    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: white;
      transition: transform 0.3s ease;
    }

    .logo-section:hover {
      transform: scale(1.05);
    }

    .logo-icon {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .brand-tagline {
      font-size: 0.75rem;
      opacity: 0.9;
      font-weight: 500;
    }

    /* Search */
    .search-section {
      flex: 1;
      max-width: 600px;
      display: none;
    }

    @media (min-width: 768px) {
      .search-section {
        display: block;
      }
    }

    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      padding: 0.5rem 1rem;
      transition: all 0.3s ease;
    }

    .search-wrapper:focus-within {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .search-icon {
      color: rgba(255, 255, 255, 0.8);
      margin-right: 0.5rem;
    }

    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: white;
      font-size: 0.95rem;
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .search-btn {
      color: white;
    }

    /* Navigation */
    .nav-links {
      display: none;
      gap: 0.5rem;
    }

    @media (min-width: 1024px) {
      .nav-links {
        display: flex;
      }
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 12px;
      color: white;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-link mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    .nav-link.active {
      background: rgba(255, 255, 255, 0.2);
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 3px;
      background: white;
      border-radius: 3px 3px 0 0;
    }

    /* Actions */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .region-btn {
      color: white !important;
      display: none;
    }

    @media (min-width: 640px) {
      .region-btn {
        display: flex;
      }
    }

    .region-text {
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dropdown-icon {
      margin-left: -4px;
    }

    .cart-btn {
      color: white !important;
    }

    .user-btn {
      color: white !important;
      display: none;
    }

    @media (min-width: 768px) {
      .user-btn {
        display: flex;
      }
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.3);
      object-fit: cover;
    }

    .user-name {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .login-btn {
      display: none;
    }

    @media (min-width: 768px) {
      .login-btn {
        display: flex;
      }
    }

    .mobile-menu-btn {
      color: white !important;
      display: flex;
    }

    @media (min-width: 1024px) {
      .mobile-menu-btn {
        display: none;
      }
    }

    /* Custom Menu Styles */
    ::ng-deep .custom-menu {
      margin-top: 8px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }

    ::ng-deep .custom-menu .mat-mdc-menu-content {
      padding: 0.5rem 0;
    }

    ::ng-deep .custom-menu .mat-mdc-menu-item {
      min-height: 44px;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-menu-header {
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .menu-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }

    .menu-user-info {
      flex: 1;
    }

    .menu-user-name {
      font-weight: 600;
      font-size: 0.95rem;
      color: #1f2937;
    }

    .menu-user-email {
      font-size: 0.8rem;
      color: #6b7280;
    }

    .vendor-link {
      color: #10b981 !important;
    }

    .admin-link {
      color: #ef4444 !important;
    }

    .logout-btn {
      color: #ef4444 !important;
    }
  `]
})
export class HeaderComponent {
  searchQuery = '';
  selectedRegion = 'Burkina Faso';
  isScrolled = false;

  // Signals
  cartCount = this.cartService.itemCount;
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;

  // Computed helpers
  userName = computed(() => this.currentUser()?.firstName || 'Utilisateur');
  userEmail = computed(() => this.currentUser()?.email || '');
  userAvatar = computed(() => this.currentUser()?.avatar);
  isVendor = this.authService.isVendor;
  isAdmin = this.authService.isAdmin;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private notification: NotificationService
  ) { }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery } });
    }
  }

  selectRegion(region: string) {
    this.selectedRegion = region;
    this.notification.info(`Région sélectionnée: ${region}`);
  }

  logout() {
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.notification.info('Menu mobile à venir');
  }
}
