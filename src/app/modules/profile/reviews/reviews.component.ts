import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-reviews',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
    template: `
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Mes Avis</h2>
    
    <div class="space-y-4">
      <!-- Mock Review -->
      <mat-card class="p-4">
        <div class="flex justify-between items-start">
           <div class="flex gap-4">
             <div class="w-16 h-16 bg-gray-100 rounded border"></div> <!-- Product Img -->
             <div>
               <h3 class="font-bold">Tomates Fraîches</h3>
               <div class="flex text-yellow-500 text-xs my-1">
                 <mat-icon *ngFor="let i of [1,2,3,4,5]" class="text-[16px] w-4 h-4">star</mat-icon>
               </div>
               <p class="text-gray-600 italic">"Très bons produits, livraison rapide !"</p>
               <div class="text-xs text-gray-400 mt-2">Publié le 01/02/2026</div>
             </div>
           </div>
           <button mat-stroked-button color="primary">Modifier</button>
        </div>
      </mat-card>
    </div>
  `
})
export class ReviewsComponent { }
