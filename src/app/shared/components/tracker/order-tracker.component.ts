import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-order-tracker',
    standalone: true,
    imports: [CommonModule, MatStepperModule, MatIconModule],
    template: `
    <div class="tracker-container py-4">
      <mat-stepper [selectedIndex]="currentStep" [orientation]="orientation">
        <mat-step state="done" label="Confirmée">
          <ng-template matStepContent>
             <div class="text-sm text-gray-500">Votre commande a été validée.</div>
          </ng-template>
        </mat-step>
        <mat-step state="done" label="Préparation">
           <ng-template matStepContent>
             <div class="text-sm text-gray-500">Colis en cours d'emballage.</div>
          </ng-template>
        </mat-step>
        <mat-step state="shipped" label="Expédiée">
           <ng-template matStepContent>
             <div class="text-sm text-gray-500">En transit vers le point de livraison.</div>
          </ng-template>
        </mat-step>
        <mat-step state="delivered" label="Livrée">
           <ng-template matStepContent>
             <div class="text-sm text-gray-500">Colis remis au client.</div>
          </ng-template>
        </mat-step>
        
        <!-- Icon Overrides -->
        <ng-template matStepperIcon="done">
           <mat-icon>check</mat-icon>
        </ng-template>
        <ng-template matStepperIcon="edit">
           <mat-icon>radio_button_checked</mat-icon>
        </ng-template>
        <ng-template matStepperIcon="number">
           <mat-icon>radio_button_unchecked</mat-icon>
        </ng-template>
      </mat-stepper>
    </div>
  `,
    styles: [`
    ::ng-deep .mat-step-header .mat-step-icon {
      background-color: #e5e7eb; /* gray-200 */
      color: #6b7280; /* gray-500 */
    }
    ::ng-deep .mat-step-header .mat-step-icon-selected,
    ::ng-deep .mat-step-header .mat-step-icon-state-done,
    ::ng-deep .mat-step-header .mat-step-icon-state-edit {
      background-color: #16a34a; /* green-600 */
      color: white;
    }
  `]
})
export class OrderTrackerComponent {
    @Input() status: string = 'pending';
    @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

    get currentStep(): number {
        switch (this.status) {
            case 'pending': return 0;
            case 'processing': return 1;
            case 'shipped': return 2;
            case 'delivered': return 3;
            default: return 0;
        }
    }
}
