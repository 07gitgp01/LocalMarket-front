import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { OrderService } from '@core/services/order.service';
import { Order } from '@shared/models/order.model';

@Component({
    selector: 'app-checkout-success',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MatCardModule
    ],
    template: `
    <div class="container mx-auto px-4 py-16 flex justify-center">
      <mat-card class="max-w-2xl w-full p-8 text-center animate-fade-in-up">
        
        <div class="flex justify-center mb-6">
          <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <mat-icon class="text-6xl text-green-600 w-16 h-16">check_circle</mat-icon>
          </div>
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-2">Merci pour votre commande !</h1>
        <p class="text-gray-600 mb-8">Votre commande a été confirmée et vous recevrez bientôt un email de confirmation.</p>

        <div class="bg-gray-50 rounded-lg p-6 mb-8 text-left" *ngIf="order">
          <div class="flex justify-between items-center mb-4 pb-4 border-b">
             <span class="text-gray-500">N° de commande</span>
             <span class="font-mono font-bold text-lg">{{ order.orderNumber }}</span>
          </div>
          
          <div class="flex justify-between items-center mb-2">
             <span class="text-gray-500">Montant total</span>
             <span class="font-bold text-green-700">{{ order.total | number }} FCFA</span>
          </div>
          
          <div class="flex justify-between items-center">
             <span class="text-gray-500">Date estimée de livraison</span>
             <span class="font-bold">{{ estimatedDeliveryDate | date:'mediumDate' }}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/orders" mat-stroked-button color="primary" class="!py-6">
            Suivre ma commande
          </a>
          <a routerLink="/products" mat-flat-button color="primary" class="!py-6">
            Continuer mes achats
          </a>
        </div>

      </mat-card>
    </div>
  `,
    styles: [`
    .animate-fade-in-up { animation: fadeInUp 0.7s ease-out; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class CheckoutSuccessComponent implements OnInit {
    order: Order | undefined;
    estimatedDeliveryDate = new Date();

    constructor(
        private route: ActivatedRoute,
        private orderService: OrderService
    ) {
        this.estimatedDeliveryDate.setDate(this.estimatedDeliveryDate.getDate() + 2); // +2 days mock
    }

    ngOnInit() {
        const orderId = this.route.snapshot.params['id'];
        if (orderId) {
            this.orderService.getOrder(orderId).subscribe(order => this.order = order);
        }
    }
}
