import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '@core/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule
    ],
    template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-6 min-h-[600px]">
        
        <!-- Sidebar Navigation -->
        <mat-card class="md:w-64 flex-shrink-0 h-fit p-0 overflow-hidden">
          <div class="p-6 bg-green-50 text-center border-b">
            <div class="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-gray-500 overflow-hidden">
              <span *ngIf="!user()?.avatar">
                {{ user()?.firstName?.charAt(0) }}{{ user()?.lastName?.charAt(0) }}
              </span>
              <img *ngIf="user()?.avatar" [src]="user()?.avatar" class="w-full h-full object-cover">
            </div>
            <h3 class="font-bold text-gray-800 truncate">{{ user()?.firstName }} {{ user()?.lastName }}</h3>
            <p class="text-xs text-gray-500 truncate">{{ user()?.email }}</p>
          </div>

          <mat-nav-list class="pt-0">
            <a mat-list-item routerLink="info" routerLinkActive="bg-green-50 text-green-700 font-semibold" class="hover:bg-gray-50">
              <mat-icon matListItemIcon>person</mat-icon>
              <span matListItemTitle>Mon Profil</span>
            </a>
            <a mat-list-item routerLink="orders" routerLinkActive="bg-green-50 text-green-700 font-semibold" class="hover:bg-gray-50">
              <mat-icon matListItemIcon>shopping_bag</mat-icon>
              <span matListItemTitle>Mes Commandes</span>
            </a>
            <a mat-list-item routerLink="addresses" routerLinkActive="bg-green-50 text-green-700 font-semibold" class="hover:bg-gray-50">
              <mat-icon matListItemIcon>location_on</mat-icon>
              <span matListItemTitle>Mes Adresses</span>
            </a>
            <a mat-list-item routerLink="wishlist" routerLinkActive="bg-green-50 text-green-700 font-semibold" class="hover:bg-gray-50">
              <mat-icon matListItemIcon>favorite</mat-icon>
              <span matListItemTitle>Liste de souhaits</span>
            </a>
            <a mat-list-item routerLink="reviews" routerLinkActive="bg-green-50 text-green-700 font-semibold" class="hover:bg-gray-50">
              <mat-icon matListItemIcon>star</mat-icon>
              <span matListItemTitle>Mes Avis</span>
            </a>
            <a mat-list-item routerLink="notifications" routerLinkActive="bg-green-50 text-green-700 font-semibold" class="hover:bg-gray-50">
              <mat-icon matListItemIcon>notifications</mat-icon>
              <span matListItemTitle>Notifications</span>
            </a>
            
            <mat-divider class="my-2"></mat-divider>
            
            <a mat-list-item (click)="logout()" class="hover:bg-red-50 text-red-600 cursor-pointer">
              <mat-icon matListItemIcon class="text-red-600">logout</mat-icon>
              <span matListItemTitle>Déconnexion</span>
            </a>
          </mat-nav-list>
        </mat-card>

        <!-- Content Area -->
        <div class="flex-grow">
          <router-outlet></router-outlet>
        </div>

      </div>
    </div>
  `,
    styles: [`
    .mat-mdc-list-item-icon {
      color: inherit;
    }
  `]
})
export class ProfileComponent {
    authService = inject(AuthService);
    user = this.authService.currentUser;

    logout() {
        this.authService.logout();
    }
}
