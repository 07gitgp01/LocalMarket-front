import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-quantity-selector',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule],
    template: `
    <div class="flex items-center border rounded-md overflow-hidden w-fit" [class.opacity-50]="disabled">
      <button mat-icon-button class="!w-8 !h-8 !flex !items-center !justify-center rounded-none text-gray-600 hover:bg-gray-100" 
        (click)="decrement()" [disabled]="disabled || quantity <= min">
        <mat-icon class="!w-4 !h-4 text-[16px]">remove</mat-icon>
      </button>
      
      <input type="number" 
        [(ngModel)]="quantity" 
        (change)="onInputChange()"
        [min]="min" 
        [max]="max"
        [disabled]="disabled"
        class="w-12 h-8 text-center text-sm font-bold border-x-0 border-y-0 outline-none appearance-none focus:ring-0 bg-transparent">
      
      <button mat-icon-button class="!w-8 !h-8 !flex !items-center !justify-center rounded-none text-gray-600 hover:bg-gray-100" 
        (click)="increment()" [disabled]="disabled || quantity >= max">
        <mat-icon class="!w-4 !h-4 text-[16px]">add</mat-icon>
      </button>
    </div>
  `,
    styles: [`
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `]
})
export class QuantitySelectorComponent {
    @Input() quantity = 1;
    @Input() min = 1;
    @Input() max = 99;
    @Input() disabled = false;

    @Output() quantityChange = new EventEmitter<number>();

    increment() {
        if (this.quantity < this.max) {
            this.quantity++;
            this.emitChange();
        }
    }

    decrement() {
        if (this.quantity > this.min) {
            this.quantity--;
            this.emitChange();
        }
    }

    onInputChange() {
        if (this.quantity < this.min) this.quantity = this.min;
        if (this.quantity > this.max) this.quantity = this.max;
        this.emitChange();
    }

    private emitChange() {
        this.quantityChange.emit(this.quantity);
    }
}
