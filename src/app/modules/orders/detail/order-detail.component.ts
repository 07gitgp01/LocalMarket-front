import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

import { OrderService } from '@core/services/order.service';
import { Order } from '@shared/models/order.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from '@core/services/notification.service';

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
    MatStepperModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    LoadingSpinnerComponent
  ],
  template: `
    <app-loading-spinner *ngIf="isLoading" [fullscreen]="false" message="Chargement de la commande..."></app-loading-spinner>

    <div *ngIf="!isLoading && order" class="container mx-auto px-4 py-8">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div class="flex items-center gap-3 mb-2">
             <button mat-icon-button (click)="goBack()" class="!-ml-2">
               <mat-icon>arrow_back</mat-icon>
             </button>
             <h1 class="text-3xl font-bold text-gray-900 m-0">{{ order.orderNumber }}</h1>
             <span class="px-3 py-1 rounded-full text-sm font-bold" [ngClass]="getStatusClass(order.status)">
               {{ getStatusLabel(order.status) }}
             </span>
          </div>
          <div class="flex items-center gap-4 text-sm text-gray-500 ml-12">
            <span class="flex items-center gap-1">
              <mat-icon class="text-[18px]">calendar_today</mat-icon>
              Passée le {{ order.createdAt | date:'dd/MM/yyyy à HH:mm' }}
            </span>
            <span class="flex items-center gap-1" *ngIf="order.deliveryDate">
              <mat-icon class="text-[18px]">local_shipping</mat-icon>
              Livraison prévue: {{ order.deliveryDate | date:'dd/MM/yyyy' }}
            </span>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2">
            <button mat-stroked-button (click)="printInvoice()">
                <mat-icon>print</mat-icon> Facture
            </button>
            <button mat-stroked-button (click)="downloadInvoice()">
                <mat-icon>download</mat-icon> Télécharger
            </button>
            <button mat-flat-button color="primary" (click)="reorder()" *ngIf="order.status === 'delivered'">
                <mat-icon>repeat</mat-icon> Commander à nouveau
            </button>
            <button mat-flat-button color="warn" (click)="cancelOrder()" *ngIf="canCancelOrder()">
                <mat-icon>cancel</mat-icon> Annuler
            </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left: Details -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Order Tracking Timeline -->
          <mat-card class="!shadow-md">
            <mat-card-content class="!p-6">
              <h2 class="font-bold text-xl mb-6 flex items-center gap-2">
                <mat-icon class="text-green-600">local_shipping</mat-icon>
                Suivi de commande
              </h2>
              
              <!-- Timeline -->
              <div class="relative">
                <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div class="space-y-6">
                  <!-- Step: Pending -->
                  <div class="relative flex items-start gap-4">
                    <div class="relative z-10 flex-shrink-0">
                      <div class="w-12 h-12 rounded-full flex items-center justify-center" 
                           [class.bg-green-100]="isStepCompleted('pending')"
                           [class.bg-gray-100]="!isStepCompleted('pending')">
                        <mat-icon [class.text-green-600]="isStepCompleted('pending')"
                                  [class.text-gray-400]="!isStepCompleted('pending')">
                          {{ isStepCompleted('pending') ? 'check_circle' : 'radio_button_unchecked' }}
                        </mat-icon>
                      </div>
                    </div>
                    <div class="flex-grow pt-2">
                      <h3 class="font-bold text-gray-900">Commande validée</h3>
                      <p class="text-sm text-gray-500">{{ order.createdAt | date:'dd/MM/yyyy à HH:mm' }}</p>
                      <p class="text-sm text-gray-600 mt-1">Votre commande a été reçue et validée</p>
                    </div>
                  </div>

                  <!-- Step: Processing -->
                  <div class="relative flex items-start gap-4">
                    <div class="relative z-10 flex-shrink-0">
                      <div class="w-12 h-12 rounded-full flex items-center justify-center" 
                           [class.bg-blue-100]="isStepCompleted('processing')"
                           [class.bg-gray-100]="!isStepCompleted('processing')">
                        <mat-icon [class.text-blue-600]="isStepCompleted('processing')"
                                  [class.text-gray-400]="!isStepCompleted('processing')">
                          {{ isStepCompleted('processing') ? 'check_circle' : 'radio_button_unchecked' }}
                        </mat-icon>
                      </div>
                    </div>
                    <div class="flex-grow pt-2">
                      <h3 class="font-bold text-gray-900">En préparation</h3>
                      <p class="text-sm text-gray-500" *ngIf="order.updatedAt">{{ order.updatedAt | date:'dd/MM/yyyy à HH:mm' }}</p>
                      <p class="text-sm text-gray-600 mt-1">Votre commande est en cours de préparation</p>
                    </div>
                  </div>

                  <!-- Step: Shipped -->
                  <div class="relative flex items-start gap-4">
                    <div class="relative z-10 flex-shrink-0">
                      <div class="w-12 h-12 rounded-full flex items-center justify-center" 
                           [class.bg-purple-100]="isStepCompleted('shipped')"
                           [class.bg-gray-100]="!isStepCompleted('shipped')">
                        <mat-icon [class.text-purple-600]="isStepCompleted('shipped')"
                                  [class.text-gray-400]="!isStepCompleted('shipped')">
                          {{ isStepCompleted('shipped') ? 'check_circle' : 'radio_button_unchecked' }}
                        </mat-icon>
                      </div>
                    </div>
                    <div class="flex-grow pt-2">
                      <h3 class="font-bold text-gray-900">Expédiée</h3>
                      <p class="text-sm text-gray-500" *ngIf="order.status === 'shipped' || order.status === 'delivered'">En transit</p>
                      <p class="text-sm text-gray-600 mt-1">Votre commande est en cours de livraison</p>
                      <div class="mt-2 p-3 bg-purple-50 rounded-lg text-sm" *ngIf="order.status === 'shipped'">
                        <div class="flex items-center gap-2 text-purple-700 font-medium mb-1">
                          <mat-icon class="text-[18px]">local_shipping</mat-icon>
                          En cours de livraison
                        </div>
                        <p class="text-purple-600">Votre colis est en route vers vous</p>
                      </div>
                    </div>
                  </div>

                  <!-- Step: Delivered -->
                  <div class="relative flex items-start gap-4">
                    <div class="relative z-10 flex-shrink-0">
                      <div class="w-12 h-12 rounded-full flex items-center justify-center" 
                           [class.bg-green-100]="order.status === 'delivered'"
                           [class.bg-gray-100]="order.status !== 'delivered'">
                        <mat-icon [class.text-green-600]="order.status === 'delivered'"
                                  [class.text-gray-400]="order.status !== 'delivered'">
                          {{ order.status === 'delivered' ? 'check_circle' : 'radio_button_unchecked' }}
                        </mat-icon>
                      </div>
                    </div>
                    <div class="flex-grow pt-2">
                      <h3 class="font-bold text-gray-900">Livrée</h3>
                      <p class="text-sm text-gray-500" *ngIf="order.status === 'delivered' && order.deliveryDate">
                        {{ order.deliveryDate | date:'dd/MM/yyyy à HH:mm' }}
                      </p>
                      <p class="text-sm text-gray-600 mt-1">Votre commande a été livrée avec succès</p>
                      <div class="mt-2 p-3 bg-green-50 rounded-lg text-sm" *ngIf="order.status === 'delivered'">
                        <div class="flex items-center gap-2 text-green-700 font-medium">
                          <mat-icon class="text-[18px]">check_circle</mat-icon>
                          Commande livrée avec succès!
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Cancelled State -->
                  <div class="relative flex items-start gap-4" *ngIf="order.status === 'cancelled'">
                    <div class="relative z-10 flex-shrink-0">
                      <div class="w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
                        <mat-icon class="text-red-600">cancel</mat-icon>
                      </div>
                    </div>
                    <div class="flex-grow pt-2">
                      <h3 class="font-bold text-gray-900">Commande annulée</h3>
                      <p class="text-sm text-gray-500">{{ order.updatedAt | date:'dd/MM/yyyy à HH:mm' }}</p>
                      <p class="text-sm text-gray-600 mt-1">Cette commande a été annulée</p>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Items List -->
          <mat-card class="!shadow-md">
            <div class="px-6 py-4 bg-gray-50 border-b">
              <h2 class="font-bold text-xl flex items-center gap-2">
                <mat-icon class="text-green-600">inventory_2</mat-icon>
                Articles commandés ({{ order.items.length }})
              </h2>
            </div>
            <mat-card-content class="!p-0">
              <div class="divide-y">
                <div *ngFor="let item of order.items" class="p-6 flex gap-4 hover:bg-gray-50 transition">
                  <div class="w-24 h-24 bg-gray-100 rounded-lg border flex-shrink-0 overflow-hidden">
                    <img *ngIf="item.product && item.product.images && item.product.images[0]" 
                         [src]="item.product.images[0]" 
                         [alt]="item.name" 
                         class="w-full h-full object-cover">
                  </div>
                  <div class="flex-grow">
                    <h3 class="font-bold text-gray-900 mb-1">{{ item.name }}</h3>
                    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <mat-icon class="text-[16px]">store</mat-icon>
                      <span>Vendeur: Boutique {{ item.vendorId }}</span>
                    </div>
                    <div class="flex items-center gap-4 text-sm">
                      <span class="text-gray-600">Quantité: <strong>{{ item.quantity }}</strong></span>
                      <span class="text-gray-600">Prix unitaire: <strong>{{ item.price | number:'1.0-0' }} FCFA</strong></span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-xl font-bold text-green-700">{{ (item.price * item.quantity) | number:'1.0-0' }} FCFA</div>
                    <button mat-stroked-button class="mt-2" size="small" [routerLink]="['/products', item.productId]">
                      <mat-icon class="text-[18px]">visibility</mat-icon>
                      Voir produit
                    </button>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

        </div>

        <!-- Right: Summary & Info -->
        <div class="lg:col-span-1 space-y-6">
          
          <mat-card class="!shadow-md">
            <mat-card-content class="!p-6">
              <h2 class="font-bold text-xl mb-4 flex items-center gap-2">
                <mat-icon class="text-green-600">location_on</mat-icon>
                Adresse de livraison
              </h2>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-gray-900 font-medium mb-1">{{ order.shippingAddress.fullName || 'Client' }}</p>
                <p class="text-gray-600 leading-relaxed">
                  {{ order.shippingAddress.street }}<br>
                  {{ order.shippingAddress.city }}, {{ order.shippingAddress.region }}<br>
                  {{ order.shippingAddress.postalCode }}<br>
                  {{ order.shippingAddress.country }}
                </p>
                <div class="flex items-center gap-2 mt-3 text-sm text-gray-600">
                  <mat-icon class="text-[18px]">phone</mat-icon>
                  <span>{{ order.shippingAddress.phone || '+226 70 00 00 00' }}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="!shadow-md">
            <mat-card-content class="!p-6">
              <h2 class="font-bold text-xl mb-4 flex items-center gap-2">
                <mat-icon class="text-green-600">payment</mat-icon>
                Paiement
              </h2>
              <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-gray-600">Mode de paiement</span>
                  <span class="font-medium text-gray-900">{{ getPaymentMethodLabel(order.paymentMethod) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Statut</span>
                  <span class="px-3 py-1 rounded-full text-xs font-bold" [ngClass]="getPaymentStatusClass(order.paymentStatus)">
                    {{ getPaymentStatusLabel(order.paymentStatus) }}
                  </span>
                </div>
              </div>

              <mat-divider class="my-4"></mat-divider>

              <div class="space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Sous-total</span>
                  <span class="font-medium">{{ order.subtotal | number:'1.0-0' }} FCFA</span>
                </div>
                
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Livraison</span>
                  <span class="font-medium">{{ order.shippingCost | number:'1.0-0' }} FCFA</span>
                </div>

                <div class="flex items-center justify-between text-sm" *ngIf="order.tax">
                  <span class="text-gray-600">Taxes</span>
                  <span class="font-medium">{{ order.tax | number:'1.0-0' }} FCFA</span>
                </div>
                
                <div class="flex items-center justify-between text-sm" *ngIf="order.discount">
                  <span class="text-gray-600">Réduction</span>
                  <span class="font-medium text-green-600">-{{ order.discount | number:'1.0-0' }} FCFA</span>
                </div>
                
                <mat-divider></mat-divider>
                
                <div class="flex items-center justify-between">
                  <span class="font-bold text-lg text-gray-900">Total</span>
                  <span class="font-bold text-2xl text-green-700">{{ order.total | number:'1.0-0' }} FCFA</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="!shadow-md !bg-blue-50 !border-blue-200">
            <mat-card-content class="!p-4">
              <div class="flex items-start gap-3">
                <mat-icon class="text-blue-600">help_outline</mat-icon>
                <div>
                  <h3 class="font-bold text-blue-900 mb-1">Besoin d'aide ?</h3>
                  <p class="text-sm text-blue-700 mb-3">Notre équipe est là pour vous assister</p>
                  <a routerLink="/contact" mat-stroked-button color="primary" class="w-full">
                    <mat-icon>support_agent</mat-icon>
                    Contacter le support
                  </a>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class OrderDetailComponent implements OnInit {
  order: Order | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private notification: NotificationService
  ) { }

  ngOnInit() {
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
      error: () => {
        this.isLoading = false;
        this.notification.error('Commande introuvable');
        this.router.navigate(['/orders']);
      }
    });
  }

  // Navigation
  goBack() {
    this.router.navigate(['/orders']);
  }

  // Order Actions
  printInvoice() {
    this.notification.info('Impression de la facture...');
    window.print();
  }

  downloadInvoice() {
    this.notification.info('Téléchargement de la facture en cours...');
    // TODO: Implement PDF download
  }

  reorder() {
    if (this.order) {
      this.notification.success('Articles ajoutés au panier!');
      this.router.navigate(['/cart']);
      // TODO: Add order items to cart
    }
  }

  cancelOrder() {
    if (this.order && confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      this.orderService.updateOrderStatus(this.order.id, 'cancelled').subscribe({
        next: () => {
          this.notification.success('Commande annulée avec succès');
          if (this.order) {
            this.order.status = 'cancelled';
          }
        },
        error: () => {
          this.notification.error('Erreur lors de l\'annulation');
        }
      });
    }
  }

  canCancelOrder(): boolean {
    return this.order?.status === 'pending' || this.order?.status === 'processing';
  }

  // Tracking utilities
  isStepCompleted(step: string): boolean {
    if (!this.order) return false;
    
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(this.order.status);
    const stepIndex = statusOrder.indexOf(step);
    
    return stepIndex <= currentIndex;
  }

  // Status utilities
  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'processing': 'En traitement',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };
    return labels[status] || status;
  }

  // Payment utilities
  getPaymentMethodLabel(method: string): string {
    const labels: { [key: string]: string } = {
      'cash': 'Paiement à la livraison',
      'mobile_money': 'Mobile Money',
      'card': 'Carte bancaire',
      'bank_transfer': 'Virement bancaire'
    };
    return labels[method] || method;
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getPaymentStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'paid': 'Payé',
      'pending': 'En attente',
      'failed': 'Échoué'
    };
    return labels[status] || status;
  }
}
