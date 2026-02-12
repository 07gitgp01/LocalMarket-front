import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

import { AuthService } from '@core/services/auth.service';

@Component({
    selector: 'app-vendor-dashboard',
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
        MatMenuModule,
        MatBadgeModule
    ],
    template: `
    <mat-sidenav-container class="h-screen bg-gray-50">
      
      <!-- Sidenav -->
      <mat-sidenav #sidenav mode="side" opened class="w-64 border-r !bg-white shadow-sm">
        
        <div class="h-16 flex items-center justify-center border-b px-4">
           <span class="text-xl font-bold text-green-700 flex items-center gap-2">
             <mat-icon>store</mat-icon> Espace Vendeur
           </span>
        </div>

        <mat-nav-list class="pt-4">
          <a mat-list-item routerLink="./analytics" routerLinkActive="bg-green-50 text-green-700 !font-bold" class="mb-1 mx-2 rounded-md">
             <mat-icon matListItemIcon>dashboard</mat-icon>
             <span matListItemTitle>Tableau de bord</span>
          </a>
          
          <div class="mt-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Gestion</div>
          
          <a mat-list-item routerLink="./products" routerLinkActive="bg-green-50 text-green-700 !font-bold" class="mb-1 mx-2 rounded-md">
             <mat-icon matListItemIcon>inventory_2</mat-icon>
             <span matListItemTitle>Mes Produits</span>
          </a>
          <a mat-list-item routerLink="./orders" routerLinkActive="bg-green-50 text-green-700 !font-bold" class="mb-1 mx-2 rounded-md">
             <mat-icon matListItemIcon>shopping_cart</mat-icon>
             <span matListItemTitle>Commandes</span>
             <span matListItemMeta class="bg-red-500 text-white text-xs rounded-full px-2 py-0.5" *ngIf="pendingOrders > 0">{{ pendingOrders }}</span>
          </a>

          <div class="mt-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Boutique</div>

          <a mat-list-item routerLink="./profile" routerLinkActive="bg-green-50 text-green-700 !font-bold" class="mb-1 mx-2 rounded-md">
             <mat-icon matListItemIcon>storefront</mat-icon>
             <span matListItemTitle>Ma Boutique</span>
          </a>
          <a mat-list-item routerLink="./support" routerLinkActive="bg-green-50 text-green-700 !font-bold" class="mb-1 mx-2 rounded-md">
             <mat-icon matListItemIcon>help_outline</mat-icon>
             <span matListItemTitle>Aide & Support</span>
          </a>
        </mat-nav-list>

        <div class="absolute bottom-0 w-full p-4 border-t bg-gray-50">
           <a mat-button color="warn" class="w-full" (click)="logout()">
             <mat-icon>logout</mat-icon> Déconnexion
           </a>
        </div>
      </mat-sidenav>

      <!-- Content -->
      <mat-sidenav-content class="bg-gray-50 flex flex-col min-h-screen">
        
        <!-- Top Toolbar -->
        <mat-toolbar class="!bg-white border-b !h-16 shadow-none px-6 flex justify-between items-center z-10">
           <button mat-icon-button (click)="sidenav.toggle()" class="mr-4 lg:hidden">
             <mat-icon>menu</mat-icon>
           </button>
           
           <h1 class="text-xl font-bold text-gray-800">
             {{ getPageTitle() }}
           </h1>

           <div class="flex items-center gap-4">
             <button mat-icon-button class="relative">
               <mat-icon>notifications</mat-icon>
               <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             
             <button mat-button [matMenuTriggerFor]="userMenu" class="!flex !items-center !gap-2">
               <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                 V
               </div>
               <span class="hidden sm:inline">{{ user()?.firstName }}</span>
               <mat-icon>arrow_drop_down</mat-icon>
             </button>
             <mat-menu #userMenu="matMenu">
               <button mat-menu-item routerLink="/">
                 <mat-icon>home</mat-icon> Retour au site
               </button>
               <button mat-menu-item>
                 <mat-icon>settings</mat-icon> Paramètres
               </button>
             </mat-menu>
           </div>
        </mat-toolbar>

        <!-- Main View -->
        <div class="p-6 overflow-y-auto flex-grow">
          <router-outlet></router-outlet>
        </div>

      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
    styles: [`
    :host { display: block; height: 100vh; }
    ::ng-deep .mat-drawer-inner-container { overflow-x: hidden; }
  `]
})
export class VendorDashboardComponent {
    authService = inject(AuthService);
    user = this.authService.currentUser;
    pendingOrders = 3; // Mock

    logout() {
        this.authService.logout();
    }

    getPageTitle() {
        // Simple logic, ideally based on router state
        return 'Tableau de bord';
    }
}
