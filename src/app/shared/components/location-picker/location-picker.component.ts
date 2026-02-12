import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-location-picker',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule],
    template: `
    <div class="border rounded-lg overflow-hidden">
      <!-- Map Placeholder Area -->
      <div class="relative h-64 bg-gray-100 flex items-center justify-center cursor-crosshair group" (click)="selectLocation($event)">
         
         <!-- Mock Map Background -->
         <div class="absolute inset-0 opacity-20 pointer-events-none" 
              style="background-image: radial-gradient(circle, #333 1px, transparent 1px); background-size: 20px 20px;">
         </div>
         
         <div *ngIf="!selectedPoint" class="text-gray-400 flex flex-col items-center pointer-events-none">
           <mat-icon class="text-4xl mb-2">map</mat-icon>
           <span>Cliquez sur la carte pour définir la position</span>
         </div>

         <!-- Pin -->
         <div *ngIf="selectedPoint" 
              class="absolute -translate-x-1/2 -translate-y-full text-red-600 drop-shadow-lg transition-all"
              [style.left.%]="selectedPoint.x"
              [style.top.%]="selectedPoint.y">
            <mat-icon class="text-4xl w-10 h-10">location_on</mat-icon>
         </div>

      </div>

      <!-- Controls -->
      <div class="p-4 bg-white border-t">
         <div class="flex items-center gap-2 mb-2">
            <mat-icon class="text-gray-400">my_location</mat-icon>
            <span class="text-sm font-bold text-gray-700" *ngIf="selectedPoint">
              Position sélectionnée
            </span>
            <span class="text-sm text-gray-400" *ngIf="!selectedPoint">
              Aucune position définie
            </span>
         </div>
         
         <div class="flex gap-2" *ngIf="selectedPoint">
             <button mat-flat-button color="primary" class="w-full" (click)="confirm()">Confirmer cette position</button>
             <button mat-stroked-button color="warn" (click)="clear()">Effacer</button>
         </div>
      </div>
    </div>
  `,
    styles: []
})
export class LocationPickerComponent {
    @Output() locationChange = new EventEmitter<{ lat: number, lng: number }>();

    selectedPoint: { x: number, y: number } | null = null;

    selectLocation(event: MouseEvent) {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        this.selectedPoint = { x, y };
    }

    confirm() {
        if (this.selectedPoint) {
            // Mock coordinates mapping
            const lat = 12.3 + (this.selectedPoint.y / 100);
            const lng = -1.5 + (this.selectedPoint.x / 100);
            this.locationChange.emit({ lat, lng });
        }
    }

    clear() {
        this.selectedPoint = null;
    }
}
