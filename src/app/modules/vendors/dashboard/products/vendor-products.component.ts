import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider'; // Added

import { ProductService } from '@core/services/product.service';
import { Product } from '@shared/models/product.model';

@Component({
  selector: 'app-vendor-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule // Added
  ],
  template: `
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
         <h1 class="text-2xl font-bold text-gray-800">Mes Produits</h1>
         <p class="text-gray-500">Gérez votre catalogue</p>
      </div>
      <div class="flex gap-2">
         <button mat-stroked-button color="primary">
           <mat-icon>file_upload</mat-icon> Importer CSV
         </button>
         <button mat-flat-button color="primary" routerLink="new">
           <mat-icon>add</mat-icon> Nouveau Produit
         </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow border overflow-hidden">
      <!-- Filters -->
      <div class="p-4 border-b flex gap-4">
        <mat-form-field appearance="outline" class="w-full sm:w-64 dense-form-field">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput [formControl]="searchControl" placeholder="Rechercher...">
        </mat-form-field>
        <!-- Filter chips etc could go here -->
      </div>

      <table mat-table [dataSource]="products" class="w-full">
        
        <!-- Image -->
        <ng-container matColumnDef="image">
           <th mat-header-cell *matHeaderCellDef class="w-20"> Image </th>
           <td mat-cell *matCellDef="let product">
             <img [src]="product.images[0]" class="w-12 h-12 rounded object-cover border bg-gray-50 my-2">
           </td>
        </ng-container>

        <!-- Name -->
        <ng-container matColumnDef="name">
           <th mat-header-cell *matHeaderCellDef> Nom </th>
           <td mat-cell *matCellDef="let product">
             <div class="font-bold text-gray-800">{{ product.name }}</div>
             <div class="text-xs text-gray-500">{{ product.category }}</div>
           </td>
        </ng-container>

        <!-- Price -->
        <ng-container matColumnDef="price">
           <th mat-header-cell *matHeaderCellDef> Prix </th>
           <td mat-cell *matCellDef="let product">
             <div class="font-bold">{{ product.price | number }} F</div>
             <div class="text-xs text-gray-400 line-through" *ngIf="product.compareAtPrice">{{ product.compareAtPrice | number }} F</div>
           </td>
        </ng-container>

        <!-- Stock -->
        <ng-container matColumnDef="stock">
           <th mat-header-cell *matHeaderCellDef> Stock </th>
           <td mat-cell *matCellDef="let product">
             <span [class.text-red-500]="product.stock <= 5" [class.font-bold]="product.stock <= 5">
               {{ product.stock }}
             </span>
           </td>
        </ng-container>

        <!-- Status -->
        <ng-container matColumnDef="status">
           <th mat-header-cell *matHeaderCellDef> Statut </th>
           <td mat-cell *matCellDef="let product">
             <span class="px-2 py-1 rounded text-xs font-bold" 
               [ngClass]="product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
               {{ product.stock > 0 ? 'Actif' : 'Rupture' }}
             </span>
           </td>
        </ng-container>

        <!-- Actions -->
        <ng-container matColumnDef="actions">
           <th mat-header-cell *matHeaderCellDef class="w-20"> </th>
           <td mat-cell *matCellDef="let product">
             <button mat-icon-button [matMenuTriggerFor]="menu">
               <mat-icon>more_vert</mat-icon>
             </button>
             <mat-menu #menu="matMenu">
               <button mat-menu-item routerLink="edit/{{product.id}}">
                 <mat-icon>edit</mat-icon> Modifier
               </button>
               <button mat-menu-item>
                 <mat-icon>visibility</mat-icon> Voir détaillée
               </button>
               <mat-divider></mat-divider>
               <button mat-menu-item class="text-red-600">
                 <mat-icon color="warn">delete</mat-icon> Supprimer
               </button>
             </mat-menu>
           </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 transition"></tr>
      </table>
      
      <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
    </div>
  `,
  styles: [`
    .dense-form-field ::ng-deep .mat-mdc-form-field-wrapper { padding-bottom: 0; }
  `]
})
export class VendorProductsComponent implements OnInit {
  displayedColumns: string[] = ['image', 'name', 'price', 'stock', 'status', 'actions'];
  products: Product[] = [];
  searchControl = new FormControl('');

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }
}
