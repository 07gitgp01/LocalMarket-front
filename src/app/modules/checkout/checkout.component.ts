import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';
import { OrderService } from '@core/services/order.service';
import { NotificationService } from '@core/services/notification.service';
import { CheckoutData, PaymentMethod } from '@shared/models/order.model';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatRadioModule,
        MatSelectModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Validation de la commande</h1>

      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Stepper Process -->
        <div class="flex-grow">
          <mat-stepper linear #stepper class="bg-white rounded-lg shadow-sm border">
            
            <!-- Step 1: Livraison -->
            <mat-step [stepControl]="shippingForm">
              <ng-template matStepLabel>Livraison</ng-template>
              <form [formGroup]="shippingForm" class="py-4">
                <h2 class="text-xl font-bold mb-4">Adresse de livraison</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Prénom</mat-label>
                    <input matInput formControlName="firstName" required>
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="w-full">
                     <mat-label>Nom</mat-label>
                     <input matInput formControlName="lastName" required>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Téléphone</mat-label>
                  <span matTextPrefix>+226 &nbsp;</span>
                  <input matInput formControlName="phone" required placeholder="70 00 00 00">
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                   <mat-label>Ville / Région</mat-label>
                   <mat-select formControlName="city" required>
                     <mat-option value="Ouagadougou">Ouagadougou</mat-option>
                     <mat-option value="Bobo-Dioulasso">Bobo-Dioulasso</mat-option>
                     <mat-option value="Koudougou">Koudougou</mat-option>
                     <mat-option value="Kaya">Kaya</mat-option>
                   </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                   <mat-label>Quartier / Secteur / Rue</mat-label>
                   <textarea matInput formControlName="street" rows="2" required placeholder="Ex: Patte d'oie, Secteur 15, face à la pharmacie..."></textarea>
                   <mat-hint>Donnez des précisions pour faciliter la livraison</mat-hint>
                </mat-form-field>

                <div class="mt-4">
                   <button mat-button matStepperNext color="primary" [disabled]="shippingForm.invalid">Suivant</button>
                </div>
              </form>
            </mat-step>

            <!-- Step 2: Mode de Livraison -->
            <mat-step [stepControl]="deliveryForm">
               <ng-template matStepLabel>Mode de Livraison</ng-template>
               <form [formGroup]="deliveryForm" class="py-4">
                 <h2 class="text-xl font-bold mb-4">Choisir un mode de livraison</h2>
                 
                 <mat-radio-group formControlName="method" class="flex flex-col gap-4">
                   <div class="border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" (click)="setDeliveryMethod('standard', 1000)">
                      <mat-radio-button value="standard" color="primary">
                        <span class="font-bold">Livraison Standard</span> <br>
                        <span class="text-sm text-gray-500">24h - 48h à domicile</span>
                      </mat-radio-button>
                      <span class="font-bold">1 000 FCFA</span>
                   </div>

                   <div class="border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" (click)="setDeliveryMethod('express', 2000)">
                      <mat-radio-button value="express" color="primary">
                        <span class="font-bold">Livraison Express</span> <br>
                        <span class="text-sm text-gray-500">Dans la journée (si commande avant 12h)</span>
                      </mat-radio-button>
                      <span class="font-bold">2 000 FCFA</span>
                   </div>

                   <div class="border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" (click)="setDeliveryMethod('pickup', 500)">
                      <mat-radio-button value="pickup" color="primary">
                        <span class="font-bold">Point Relais</span> <br>
                        <span class="text-sm text-gray-500">Récupérer dans un point partenaire</span>
                      </mat-radio-button>
                      <span class="font-bold">500 FCFA</span>
                   </div>
                 </mat-radio-group>

                 <div class="mt-6 flex gap-2">
                    <button mat-button matStepperPrevious>Retour</button>
                    <button mat-button matStepperNext color="primary">Suivant</button>
                 </div>
               </form>
            </mat-step>

            <!-- Step 3: Paiement -->
            <mat-step [stepControl]="paymentForm">
               <ng-template matStepLabel>Paiement</ng-template>
               <form [formGroup]="paymentForm" class="py-4">
                 <h2 class="text-xl font-bold mb-4">Moyen de paiement</h2>

                 <mat-radio-group formControlName="method" class="flex flex-col gap-4">
                   
                   <!-- Orange Money -->
                   <div class="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-orange-50">
                     <mat-radio-button value="orange_money" color="primary"></mat-radio-button>
                     <img src="assets/images/payments/orange-money.png" class="h-8" onerror="this.hidden=true">
                     <div class="flex-grow">
                       <div class="font-bold">Orange Money</div>
                       <div class="text-sm text-gray-500">Paiement mobile sécurisé</div>
                     </div>
                   </div>

                   <!-- Wave -->
                   <div class="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-blue-50">
                     <mat-radio-button value="wave" color="primary"></mat-radio-button>
                     <img src="assets/images/payments/wave.png" class="h-8" onerror="this.hidden=true">
                     <div class="flex-grow">
                       <div class="font-bold">Wave</div>
                       <div class="text-sm text-gray-500">1% de frais seulement</div>
                     </div>
                   </div>

                   <!-- Cash -->
                   <div class="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-green-50">
                     <mat-radio-button value="cash_on_delivery" color="primary"></mat-radio-button>
                     <mat-icon class="h-8 w-8 text-green-600 text-3xl">payments</mat-icon>
                     <div class="flex-grow">
                       <div class="font-bold">Paiement à la livraison</div>
                       <div class="text-sm text-gray-500">Espèces à la réception du colis</div>
                     </div>
                   </div>

                 </mat-radio-group>

                 <div class="mt-6 flex gap-2">
                    <button mat-button matStepperPrevious>Retour</button>
                    <button mat-button matStepperNext color="primary" [disabled]="paymentForm.invalid">Suivant</button>
                 </div>
               </form>
            </mat-step>

            <!-- Step 4: Confirmation -->
            <mat-step>
               <ng-template matStepLabel>Confirmation</ng-template>
               
               <div class="py-4">
                 <h2 class="text-xl font-bold mb-4">Vérifiez votre commande</h2>
                 
                 <div class="bg-gray-50 p-4 rounded mb-4 text-sm space-y-2">
                   <p><strong>Livraison à :</strong> {{ shippingForm.value.firstName }} {{ shippingForm.value.lastName }}, {{ shippingForm.value.city }}, {{ shippingForm.value.street }}</p>
                   <p><strong>Téléphone :</strong> {{ shippingForm.value.phone }}</p>
                   <p><strong>Méthode de livraison :</strong> {{ getDeliveryLabel() }}</p>
                   <p><strong>Paiement :</strong> {{ getPaymentLabel() }}</p>
                 </div>

                 <div class="flex items-center gap-2 mb-6">
                   <mat-icon class="text-green-600">security</mat-icon>
                   <span class="text-sm text-gray-600">Vos données sont sécurisées. En confirmant, vous acceptez nos CGV.</span>
                 </div>

                 <div class="flex gap-2">
                    <button mat-button matStepperPrevious>Retour</button>
                    <button mat-flat-button color="primary" (click)="placeOrder()" [disabled]="isLoading" class="!py-6 !text-lg">
                      <span *ngIf="!isLoading">Confirmer et Payer ({{ totalAmount | number }} FCFA)</span>
                      <mat-spinner *ngIf="isLoading" diameter="24" class="mx-auto" color="accent"></mat-spinner>
                    </button>
                 </div>
               </div>
            </mat-step>

          </mat-stepper>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="lg:w-1/3">
           <mat-card class="p-6 sticky top-24">
             <h2 class="text-lg font-bold mb-4">Articles ({{ cartCount() }})</h2>
             
             <div class="max-h-60 overflow-y-auto pr-2 space-y-4 mb-4">
               <div *ngFor="let item of cartItems()" class="flex gap-4 text-sm">
                  <div class="relative w-16 h-16 rounded border bg-gray-100 flex-shrink-0">
                    <img [src]="item.product?.images?.[0]" class="w-full h-full object-cover rounded">
                    <span class="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{{ item.quantity }}</span>
                  </div>
                  <div>
                    <div class="font-semibold line-clamp-2">{{ item.product?.name }}</div>
                    <div class="text-gray-500">{{ (item.product?.price || 0) * item.quantity | number }} FCFA</div>
                  </div>
               </div>
             </div>
             
             <mat-divider></mat-divider>
             
             <div class="space-y-2 mt-4 text-sm">
               <div class="flex justify-between">
                  <span>Sous-total</span>
                  <span>{{ subtotal() | number }} FCFA</span>
               </div>
               <div class="flex justify-between">
                  <span>Livraison</span>
                  <span>{{ deliveryCost | number }} FCFA</span>
               </div>
               <mat-divider></mat-divider>
               <div class="flex justify-between font-bold text-lg mt-2">
                  <span>Total à payer</span>
                  <span class="text-green-700">{{ totalAmount | number }} FCFA</span>
               </div>
             </div>

           </mat-card>
        </div>

      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class CheckoutComponent implements OnInit {
    shippingForm: FormGroup;
    deliveryForm: FormGroup;
    paymentForm: FormGroup;

    cartItems = this.cartService.cartItems;
    cartCount = this.cartService.itemCount;
    subtotal = this.cartService.totalAmount;

    deliveryCost = 1000;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private cartService: CartService,
        private orderService: OrderService,
        private authService: AuthService,
        private router: Router,
        private notification: NotificationService
    ) {
        this.shippingForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phone: ['', Validators.required],
            city: ['Ouagadougou', Validators.required],
            street: ['', Validators.required]
        });

        this.deliveryForm = this.fb.group({
            method: ['standard', Validators.required]
        });

        this.paymentForm = this.fb.group({
            method: ['cash_on_delivery', Validators.required]
        });
    }

    ngOnInit() {
        // Check if cart is empty
        if (this.cartItems().length === 0) {
            this.router.navigate(['/cart']);
            return;
        }

        // Prefill with user data
        const user = this.authService.currentUser();
        if (user) {
            this.shippingForm.patchValue({
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                city: user.address?.city || 'Ouagadougou',
                street: user.address?.street || ''
            });
        }
    }

    setDeliveryMethod(method: string, cost: number) {
        this.deliveryForm.get('method')?.setValue(method);
        this.deliveryCost = cost;
    }

    get totalAmount() {
        return this.subtotal() + this.deliveryCost;
    }

    getDeliveryLabel() {
        const method = this.deliveryForm.get('method')?.value;
        switch (method) {
            case 'express': return 'Express (24h)';
            case 'pickup': return 'Point Relais';
            default: return 'Standard (48h)';
        }
    }

    getPaymentLabel() {
        const method = this.paymentForm.get('method')?.value;
        switch (method) {
            case 'orange_money': return 'Orange Money';
            case 'wave': return 'Wave';
            case 'cash_on_delivery': return 'Paiement à la livraison';
            default: return method;
        }
    }

    placeOrder() {
        if (this.shippingForm.invalid || this.paymentForm.invalid) return;

        this.isLoading = true;

        // Construct Mock Partial Order (to be completed by backend or explicit here)
        const mockOrder: any = {
            userId: this.authService.currentUser()?.id || 1, // Mock user ID if strictly local testing
            orderNumber: 'ORD-' + Date.now(),
            status: 'pending',
            items: this.cartItems().map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product?.price || 0,
                total: (item.product?.price || 0) * item.quantity,
                name: item.product?.name || 'Produit',
                vendorId: item.product?.vendorId || 0
            })),
            subtotal: this.subtotal(),
            shippingCost: this.deliveryCost,
            tax: 0,
            discount: 0,
            total: this.totalAmount,
            paymentMethod: this.paymentForm.value.method,
            paymentStatus: 'pending',
            shippingAddress: {
                street: this.shippingForm.value.street,
                city: this.shippingForm.value.city,
                region: 'Centre',
                postalCode: '00000',
                country: 'Burkina Faso'
            },
            createdAt: new Date().toISOString()
        };

        // Call Service
        this.orderService.createOrder(mockOrder).subscribe({
            next: (order) => {
                this.isLoading = false;
                this.cartService.clearCart(); // Clear local cart
                this.notification.success('Commande validée avec succès !');
                this.router.navigate(['/checkout/success', order.id]);
            },
            error: (err) => {
                this.isLoading = false;
                this.notification.error('Erreur lors de la commande. Veuillez réessayer.');
            }
        });

    }
}
