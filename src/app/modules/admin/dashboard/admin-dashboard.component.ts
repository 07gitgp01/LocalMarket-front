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
    <mat-sidenav-container class="h-screen bg-gray-100">
      
      <!-- Sidenav -->
      <mat-sidenav #sidenav mode="side" opened class="w-64 border-r !bg-gray-900 text-white shadow-xl">
        
        <div class="h-16 flex items-center px-6 border-b border-gray-700">
           <span class="text-xl font-bold flex items-center gap-2 tracking-wider">
             <mat-icon class="text-secondary">admin_panel_settings</mat-icon> ADMIN
           </span>
        </div>

        <mat-nav-list class="pt-4 space-y-1">
          <a mat-list-item routerLink="./analytics" routerLinkActive="!bg-gray-800 !text-secondary border-r-4 border-secondary" class="hover:bg-gray-800 text-gray-300 mx-0 rounded-none transition-all">
             <mat-icon matListItemIcon class="">dashboard</mat-icon>
             <span matListItemTitle>Vue d'ensemble</span>
          </a>
          
          <div class="mt-6 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Gestion</div>
          
          <a mat-list-item routerLink="./users" routerLinkActive="!bg-gray-800 !text-secondary border-r-4 border-secondary" class="hover:bg-gray-800 text-gray-300 mx-0 rounded-none transition-all">
             <mat-icon matListItemIcon>people</mat-icon>
             <span matListItemTitle>Utilisateurs</span>
          </a>
          <a mat-list-item routerLink="./products" routerLinkActive="!bg-gray-800 !text-secondary border-r-4 border-secondary" class="hover:bg-gray-800 text-gray-300 mx-0 rounded-none transition-all">
             <mat-icon matListItemIcon>inventory_2</mat-icon>
             <span matListItemTitle>Produits & Cats</span>
          </a>
          <a mat-list-item routerLink="./orders" routerLinkActive="!bg-gray-800 !text-secondary border-r-4 border-secondary" class="hover:bg-gray-800 text-gray-300 mx-0 rounded-none transition-all">
             <mat-icon matListItemIcon>shopping_cart</mat-icon>
             <span matListItemTitle>Commandes</span>
          </a>

          <div class="mt-6 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Contenu</div>

          <a mat-list-item routerLink="./content" routerLinkActive="!bg-gray-800 !text-secondary border-r-4 border-secondary" class="hover:bg-gray-800 text-gray-300 mx-0 rounded-none transition-all">
             <mat-icon matListItemIcon>article</mat-icon>
             <span matListItemTitle>CMS & Bannières</span>
          </a>

          <div class="mt-6 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Système</div>

          <a mat-list-item routerLink="./system" routerLinkActive="!bg-gray-800 !text-secondary border-r-4 border-secondary" class="hover:bg-gray-800 text-gray-300 mx-0 rounded-none transition-all">
             <mat-icon matListItemIcon>settings</mat-icon>
             <span matListItemTitle>Configuration</span>
          </a>
        </mat-nav-list>

      </mat-sidenav>

      <!-- Content -->
      <mat-sidenav-content class="flex flex-col min-h-screen">
        
        <!-- Top Toolbar -->
        <mat-toolbar class="!bg-white border-b !h-16 shadow-none px-6 flex justify-between items-center z-10 sticky top-0">
           <button mat-icon-button (click)="sidenav.toggle()" class="mr-4 lg:hidden text-gray-600">
             <mat-icon>menu</mat-icon>
           </button>
           
           <h1 class="text-lg font-medium text-gray-500">
             Administration LocaleMarket
           </h1>

           <div class="flex items-center gap-4">
             <button mat-icon-button>
                <mat-icon class="text-gray-600">search</mat-icon>
             </button>
             <button mat-icon-button class="relative">
               <mat-icon class="text-gray-600">notifications</mat-icon>
               <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             
             <button mat-button [matMenuTriggerFor]="adminMenu" class="!flex !items-center !gap-2 !px-2 rounded-full hover:bg-gray-100">
               <div class="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
                 A
               </div>
               <span class="hidden sm:inline text-sm font-medium">Administrateur</span>
               <mat-icon class="text-gray-500 icon-sm">arrow_drop_down</mat-icon>
             </button>
             <mat-menu #adminMenu="matMenu">
               <button mat-menu-item routerLink="/">
                 <mat-icon>home</mat-icon> Retour au site
               </button>
               <mat-divider></mat-divider>
               <button mat-menu-item (click)="logout()" class="text-red-600">
                 <mat-icon color="warn">logout</mat-icon> Déconnexion
               </button>
             </mat-menu>
           </div>
        </mat-toolbar>

        <!-- Main View -->
        <div class="p-8 overflow-y-auto flex-grow max-w-[1600px] mx-auto w-full">
          <router-outlet></router-outlet>
        </div>

      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
    styles: [`
    :host { display: block; height: 100vh; }
    .icon-sm { font-size: 20px; width: 20px; height: 20px; }
    ::ng-deep .mat-drawer-inner-container { overflow-x: hidden; }
  `]
})
export class AdminDashboardComponent {
    authService = inject(AuthService);

    logout() {
        this.authService.logout();
    }
}
