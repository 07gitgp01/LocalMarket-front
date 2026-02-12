import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';

import { OrderService } from '@core/services/order.service';
import { Order } from '@shared/models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatStepperModule
  ],
  template: `
    <div *ngIf="isLoading" class="flex justify-center p-20">
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    </div>

    <div *ngIf="!isLoading && order" class="container mx-auto px-4 py-8">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
             <a routerLink="/orders" class="text-gray-500 hover:text-green-700">
               <mat-icon inline>arrow_back</mat-icon> Retour
             </a>
             <span class="text-gray-300">|</span>
             <h1 class="text-2xl font-bold text-gray-800 m-0">Commande #{{ order.orderNumber }}</h1>
          </div>
          <div class="text-sm text-gray-500">
            Passée le {{ order.createdAt | date:'medium' }}
          </div>
        </div>
        
        <div class="flex gap-2">
            <button mat-stroked-button color="primary">
                <mat-icon>print</mat-icon> Facture
            </button>
            <button mat-flat-button color="accent">
                <mat-icon>repeat</mat-icon> Commander à nouveau
            </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left: Details -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Tracking Stepper -->
          <mat-card class="p-6">
            <h2 class="font-bold text-lg mb-4">Suivi de commande</h2>
            <mat-stepper [selectedIndex]="getStepIndex(order.status)" class="tracking-stepper">
              <mat-step label="Validée" state="done"></mat-step>
              <mat-step label="En préparation" state="done"></mat-step>
              <mat-step label="Expédiée" state="shipped"></mat-step>
              <mat-step label="Livrée" state="delivered"></mat-step>
            </mat-stepper>
            
            <div class="mt-4 p-4 bg-blue-50 rounded text-blue-800 text-sm flex items-start gap-2" *ngIf="order.status === 'shipped'">
              <mat-icon>local_shipping</mat-icon>
              <div>
                <strong>En cours de livraison</strong><br>
                Votre colis est en route. Livraison estimée : Demain.
              </div>
            </div>
          </mat-card>

          <!-- Items List -->
          <mat-card class="overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b font-bold">
              Articles ({{ order.items.length }})
            </div>
            <div class="divide-y">
              <div *ngFor="let item of order.items" class="p-4 flex gap-4">
                <div class="w-20 h-20 bg-gray-100 rounded border flex-shrink-0"></div> <!-- Placeholder img -->
                <div class="flex-grow">
                  <div class="font-bold text-gray-800">{{ item.name || 'Produit' }}</div>
                  <div class="text-sm text-gray-500">Vendeur: Boutique Partenaire</div>
                  <div class="text-sm mt-1">Qté: {{ item.quantity }} x {{ item.price | number }} FCFA</div>
                </div>
                <div class="font-bold text-right">
                  {{ item.total | number }} FCFA
                </div>
              </div>
            </div>
          </mat-card>

        </div>

        <!-- Right: Summary & Info -->
        <div class="lg:col-span-1 space-y-6">
          
          <mat-card class="p-6">
            <h2 class="font-bold text-lg mb-4">Adresse de livraison</h2>
            <p class="text-gray-600 leading-relaxed">
              {{ order.shippingAddress.street }}<br>
              {{ order.shippingAddress.city }}<br>
              {{ order.shippingAddress.country }}<br>
              <br>
              Tél: +226 70 00 00 00
            </p>
          </mat-card>

          <mat-card class="p-6">
            <h2 class="font-bold text-lg mb-4">Paiement</h2>
            <div class="flex items-center gap-2 mb-2">
               <mat-icon class="text-green-600">check_circle</mat-icon>
               <span>Payé via {{ order.paymentMethod | uppercase }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm mt-4">
              <span class="text-gray-600">Sous-total</span>
              <span class="text-right">{{ order.subtotal | number }} FCFA</span>
              
              <span class="text-gray-600">Livraison</span>
              <span class="text-right">{{ order.shippingCost | number }} FCFA</span>
              
              <mat-divider class="col-span-2 my-2"></mat-divider>
              
              <span class="font-bold text-lg">Total</span>
              <span class="font-bold text-lg text-right text-green-700">{{ order.total | number }} FCFA</span>
            </div>
          </mat-card>
          
          <div class="text-center">
            <a routerLink="/contact" class="text-primary text-sm hover:underline">Besoin d'aide sur cette commande ?</a>
          </div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    .tracking-stepper ::ng-deep .mat-horizontal-stepper-header-container {
      padding: 0;
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  order: Order | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    // Si l'ID vient de l'URL
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadOrder(id);
      }
    });
  }

  loadOrder(id: number) {
    this.orderService.getOrder(id).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  getStepIndex(status: string): number {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  }
}
