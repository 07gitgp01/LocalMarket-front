import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '@core/services/auth.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule
    ],
    template: `
    <div class="dashboard-container">
      <!-- Compact Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <mat-icon class="logo-icon">storefront</mat-icon>
            <span class="logo-text">LocalMarket</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section">
            <div class="nav-label">MAIN MENU</div>
            <a routerLink="./analytics" routerLinkActive="active" class="nav-item">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </a>
          </div>

          <div class="nav-section">
            <div class="nav-label">GESTION</div>
            <a routerLink="./users" routerLinkActive="active" class="nav-item">
              <mat-icon>people</mat-icon>
              <span>Users</span>
            </a>
            <a routerLink="./vendors" routerLinkActive="active" class="nav-item">
              <mat-icon>store</mat-icon>
              <span>Vendors</span>
            </a>
            <a routerLink="./products" routerLinkActive="active" class="nav-item">
              <mat-icon>inventory_2</mat-icon>
              <span>Products</span>
            </a>
            <a routerLink="./orders" routerLinkActive="active" class="nav-item">
              <mat-icon>shopping_cart</mat-icon>
              <span>Orders</span>
            </a>
            <a routerLink="./regions" routerLinkActive="active" class="nav-item">
              <mat-icon>map</mat-icon>
              <span>Regions</span>
            </a>
          </div>

          <div class="nav-section">
            <div class="nav-label">SYSTÈME</div>
            <a routerLink="./content" routerLinkActive="active" class="nav-item">
              <mat-icon>article</mat-icon>
              <span>Content</span>
            </a>
            <a routerLink="./system" routerLinkActive="active" class="nav-item">
              <mat-icon>settings</mat-icon>
              <span>Settings</span>
            </a>
          </div>
        </nav>

        <div class="sidebar-footer">
          <button mat-button class="logout-btn" (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Top Header -->
        <header class="top-header">
          <div class="header-left">
            <h1 class="page-title">Analytics</h1>
            <div class="breadcrumb">
              <span>Full Statistics</span>
              <span class="separator">•</span>
              <span class="active">Results Summary</span>
            </div>
          </div>

          <div class="header-right">
            <button mat-icon-button class="header-btn">
              <mat-icon>search</mat-icon>
            </button>
            <button mat-icon-button class="header-btn notification-btn">
              <mat-icon>notifications_none</mat-icon>
              <span class="badge">3</span>
            </button>
            <button mat-icon-button class="header-btn">
              <mat-icon>add</mat-icon>
            </button>
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
              <div class="avatar">
                <img src="https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff" alt="Admin">
              </div>
            </button>
            <mat-menu #userMenu="matMenu" class="user-menu">
              <button mat-menu-item routerLink="/">
                <mat-icon>home</mat-icon>
                <span>Retour au site</span>
              </button>
              <button mat-menu-item>
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Déconnexion</span>
              </button>
            </mat-menu>
          </div>
        </header>

        <!-- Content Area -->
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }

    .dashboard-container {
      display: flex;
      height: 100vh;
      background: #f8f9fa;
    }

    /* Sidebar */
    .sidebar {
      width: 240px;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
    }

    .sidebar-header {
      padding: 1.5rem 1.25rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      font-size: 32px;
      color: #4F46E5;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      letter-spacing: -0.02em;
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0.75rem;
    }

    .nav-section {
      margin-bottom: 1.5rem;
    }

    .nav-label {
      font-size: 0.6875rem;
      font-weight: 700;
      color: #9ca3af;
      letter-spacing: 0.05em;
      padding: 0 0.75rem;
      margin-bottom: 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: 8px;
      color: #6b7280;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      margin-bottom: 0.25rem;
    }

    .nav-item mat-icon {
      width: 20px;
      height: 20px;
      font-size: 20px;
      color: inherit;
    }

    .nav-item:hover {
      background: #f3f4f6;
      color: #4F46E5;
    }

    .nav-item.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      color: #6b7280;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .logout-btn:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .top-header {
      background: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 72px;
    }

    .header-left {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #9ca3af;
    }

    .breadcrumb .separator {
      color: #d1d5db;
    }

    .breadcrumb .active {
      color: #4F46E5;
      font-weight: 500;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .header-btn {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: #f9fafb;
      color: #6b7280;
      transition: all 0.2s ease;
    }

    .header-btn:hover {
      background: #f3f4f6;
      color: #4F46E5;
    }

    .notification-btn {
      position: relative;
    }

    .notification-btn .badge {
      position: absolute;
      top: 6px;
      right: 6px;
      background: #ef4444;
      color: white;
      font-size: 0.625rem;
      font-weight: 700;
      padding: 0.125rem 0.375rem;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
    }

    .user-btn {
      padding: 0.25rem;
      border-radius: 12px;
      min-width: auto;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      overflow: hidden;
      border: 2px solid #e5e7eb;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .content-area {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
      background: #f8f9fa;
    }

    /* Scrollbar */
    .sidebar-nav::-webkit-scrollbar,
    .content-area::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar-nav::-webkit-scrollbar-track,
    .content-area::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar-nav::-webkit-scrollbar-thumb,
    .content-area::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 3px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb:hover,
    .content-area::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }

    ::ng-deep .user-menu {
      margin-top: 0.5rem;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class AdminDashboardComponent {
    authService = inject(AuthService);

    logout() {
        this.authService.logout();
    }
}
