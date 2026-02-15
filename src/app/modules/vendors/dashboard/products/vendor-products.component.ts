import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { SelectionModel } from '@angular/cdk/collections';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ProductService } from '@core/services/product.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { Product } from '@shared/models/product.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-vendor-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDividerModule,
    MatCardModule,
    LoadingSpinnerComponent
  ],
  template: `
    <app-loading-spinner *ngIf="isLoading" [fullscreen]="false" message="Chargement des produits..."></app-loading-spinner>

    <div *ngIf="!isLoading">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
         <h1 class="text-3xl font-bold text-gray-900">Mes Produits</h1>
         <p class="text-gray-500 mt-1">Gérez votre catalogue de {{ dataSource.data.length }} produit(s)</p>
      </div>
      <div class="flex gap-2">
         <button mat-stroked-button color="primary" (click)="exportProducts()">
           <mat-icon>file_download</mat-icon> Exporter
         </button>
         <button mat-flat-button color="primary" routerLink="new">
           <mat-icon>add</mat-icon> Nouveau Produit
         </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <mat-card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Total Produits</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats().total }}</p>
          </div>
          <mat-icon class="text-blue-500 text-4xl">inventory_2</mat-icon>
        </div>
      </mat-card>
      <mat-card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Produits Actifs</p>
            <p class="text-2xl font-bold text-green-700">{{ stats().active }}</p>
          </div>
          <mat-icon class="text-green-500 text-4xl">check_circle</mat-icon>
        </div>
      </mat-card>
      <mat-card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Stock Faible</p>
            <p class="text-2xl font-bold text-orange-700">{{ stats().lowStock }}</p>
          </div>
          <mat-icon class="text-orange-500 text-4xl">warning</mat-icon>
        </div>
      </mat-card>
      <mat-card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Rupture Stock</p>
            <p class="text-2xl font-bold text-red-700">{{ stats().outOfStock }}</p>
          </div>
          <mat-icon class="text-red-500 text-4xl">remove_shopping_cart</mat-icon>
        </div>
      </mat-card>
    </div>

    <!-- Filters & Actions -->
    <mat-card class="!shadow-md mb-6">
      <mat-card-content class="!p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Rechercher</mat-label>
            <input matInput [formControl]="searchControl" placeholder="Nom, catégorie...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <!-- Category Filter -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Catégorie</mat-label>
            <mat-select [(value)]="selectedCategory" (selectionChange)="applyFilters()">
              <mat-option value="all">Toutes les catégories</mat-option>
              <mat-option *ngFor="let cat of categories" [value]="cat">{{ cat }}</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Stock Filter -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Stock</mat-label>
            <mat-select [(value)]="selectedStock" (selectionChange)="applyFilters()">
              <mat-option value="all">Tous</mat-option>
              <mat-option value="inStock">En stock</mat-option>
              <mat-option value="lowStock">Stock faible</mat-option>
              <mat-option value="outOfStock">Rupture</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Status Filter -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Statut</mat-label>
            <mat-select [(value)]="selectedStatus" (selectionChange)="applyFilters()">
              <mat-option value="all">Tous</mat-option>
              <mat-option value="active">Actifs</mat-option>
              <mat-option value="inactive">Inactifs</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Bulk Actions -->
        <div *ngIf="selection.hasValue()" class="mt-4 flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
          <span class="text-sm font-medium text-blue-900">{{ selection.selected.length }} produit(s) sélectionné(s)</span>
          <button mat-stroked-button color="warn" (click)="bulkDelete()">
            <mat-icon>delete</mat-icon> Supprimer
          </button>
          <button mat-stroked-button (click)="selection.clear()">
            Annuler
          </button>
        </div>
      </mat-card-content>
    </mat-card>

    <!-- Products Table -->
    <div class="bg-white rounded-lg shadow-md border overflow-hidden">

      <table mat-table [dataSource]="dataSource" matSort class="w-full">
        
        <!-- Checkbox Column -->
        <ng-container matColumnDef="select">
          <th mat-header-cell *matHeaderCellDef class="w-12">
            <mat-checkbox (change)="$event ? toggleAllRows() : null"
                          [checked]="selection.hasValue() && isAllSelected()"
                          [indeterminate]="selection.hasValue() && !isAllSelected()">
            </mat-checkbox>
          </th>
          <td mat-cell *matCellDef="let row">
            <mat-checkbox (click)="$event.stopPropagation()"
                          (change)="$event ? selection.toggle(row) : null"
                          [checked]="selection.isSelected(row)">
            </mat-checkbox>
          </td>
        </ng-container>
        
        <!-- Image -->
        <ng-container matColumnDef="image">
           <th mat-header-cell *matHeaderCellDef class="w-20"> Image </th>
           <td mat-cell *matCellDef="let product">
             <img [src]="product.images[0]" [alt]="product.name" class="w-14 h-14 rounded-lg object-cover border bg-gray-50 my-2 shadow-sm">
           </td>
        </ng-container>

        <!-- Name -->
        <ng-container matColumnDef="name">
           <th mat-header-cell *matHeaderCellDef mat-sort-header> Nom </th>
           <td mat-cell *matCellDef="let product">
             <div class="font-bold text-gray-900">{{ product.name }}</div>
             <div class="text-xs text-gray-500 flex items-center gap-1 mt-1">
               <mat-icon class="text-[14px] w-3 h-3">category</mat-icon>
               {{ product.category }}
             </div>
           </td>
        </ng-container>

        <!-- Price -->
        <ng-container matColumnDef="price">
           <th mat-header-cell *matHeaderCellDef mat-sort-header> Prix </th>
           <td mat-cell *matCellDef="let product">
             <div class="font-bold text-gray-900">{{ product.price | number:'1.0-0' }} FCFA</div>
             <div class="text-xs text-gray-400 line-through" *ngIf="product.compareAtPrice">{{ product.compareAtPrice | number:'1.0-0' }} FCFA</div>
           </td>
        </ng-container>

        <!-- Stock -->
        <ng-container matColumnDef="stock">
           <th mat-header-cell *matHeaderCellDef mat-sort-header> Stock </th>
           <td mat-cell *matCellDef="let product">
             <div class="flex items-center gap-2">
               <span class="font-semibold" 
                     [class.text-red-600]="product.stock === 0"
                     [class.text-orange-600]="product.stock > 0 && product.stock <= 10"
                     [class.text-green-600]="product.stock > 10">
                 {{ product.stock }}
               </span>
               <mat-icon *ngIf="product.stock === 0" class="text-red-500 text-[18px]" matTooltip="Rupture de stock">error</mat-icon>
               <mat-icon *ngIf="product.stock > 0 && product.stock <= 10" class="text-orange-500 text-[18px]" matTooltip="Stock faible">warning</mat-icon>
             </div>
           </td>
        </ng-container>

        <!-- Rating -->
        <ng-container matColumnDef="rating">
           <th mat-header-cell *matHeaderCellDef mat-sort-header> Note </th>
           <td mat-cell *matCellDef="let product">
             <div class="flex items-center gap-1">
               <mat-icon class="text-yellow-500 text-[18px]">star</mat-icon>
               <span class="font-semibold">{{ product.rating | number:'1.1-1' }}</span>
               <span class="text-xs text-gray-500">({{ product.reviewCount }})</span>
             </div>
           </td>
        </ng-container>

        <!-- Status -->
        <ng-container matColumnDef="status">
           <th mat-header-cell *matHeaderCellDef> Statut </th>
           <td mat-cell *matCellDef="let product">
             <span class="px-3 py-1 rounded-full text-xs font-bold" 
               [ngClass]="product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
               {{ product.isActive ? 'Actif' : 'Inactif' }}
             </span>
           </td>
        </ng-container>

        <!-- Actions -->
        <ng-container matColumnDef="actions">
           <th mat-header-cell *matHeaderCellDef class="w-24"> Actions </th>
           <td mat-cell *matCellDef="let product">
             <div class="flex items-center gap-1">
               <button mat-icon-button [routerLink]="['/products', product.id]" matTooltip="Voir">
                 <mat-icon>visibility</mat-icon>
               </button>
               <button mat-icon-button routerLink="edit/{{product.id}}" matTooltip="Modifier">
                 <mat-icon>edit</mat-icon>
               </button>
               <button mat-icon-button [matMenuTriggerFor]="menu" matTooltip="Plus">
                 <mat-icon>more_vert</mat-icon>
               </button>
               <mat-menu #menu="matMenu">
                 <button mat-menu-item (click)="duplicateProduct(product)">
                   <mat-icon>content_copy</mat-icon> Dupliquer
                 </button>
                 <button mat-menu-item (click)="toggleProductStatus(product)">
                   <mat-icon>{{ product.isActive ? 'visibility_off' : 'visibility' }}</mat-icon> 
                   {{ product.isActive ? 'Désactiver' : 'Activer' }}
                 </button>
                 <mat-divider></mat-divider>
                 <button mat-menu-item class="text-red-600" (click)="deleteProduct(product)">
                   <mat-icon color="warn">delete</mat-icon> Supprimer
                 </button>
               </mat-menu>
             </div>
           </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 transition cursor-pointer"></tr>
      </table>
      
      <mat-paginator #paginator
                     [length]="dataSource.data.length"
                     [pageSize]="10"
                     [pageSizeOptions]="[5, 10, 25, 50, 100]"
                     showFirstLastButtons>
      </mat-paginator>
    </div>
    </div>
  `,
  styles: [`
    .dense-form-field ::ng-deep .mat-mdc-form-field-wrapper { padding-bottom: 0; }
  `]
})
export class VendorProductsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['select', 'image', 'name', 'price', 'stock', 'rating', 'status', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  selection = new SelectionModel<Product>(true, []);
  
  isLoading = true;
  searchControl = new FormControl('');
  
  // Filters
  selectedCategory = 'all';
  selectedStock = 'all';
  selectedStatus = 'all';
  categories: string[] = [];
  
  // Stats
  stats = signal({
    total: 0,
    active: 0,
    lowStock: 0,
    outOfStock: 0
  });

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.setupSearch();
  }

  loadProducts() {
    this.isLoading = true;
    const vendorId = this.authService.currentUser()?.vendorId || 1;
    
    this.productService.getProducts({ vendorId }).subscribe({
      next: (products) => {
        this.dataSource.data = products;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // Extract unique categories
        this.categories = [...new Set(products.map(p => p.category))];
        
        // Calculate stats
        this.calculateStats(products);
        
        this.isLoading = false;
      },
      error: () => {
        this.notification.error('Erreur lors du chargement des produits');
        this.isLoading = false;
      }
    });
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  applyFilters() {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    
    this.dataSource.filterPredicate = (product: Product) => {
      // Search filter
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);
      
      // Category filter
      const matchesCategory = this.selectedCategory === 'all' || 
        product.category === this.selectedCategory;
      
      // Stock filter
      let matchesStock = true;
      if (this.selectedStock === 'inStock') {
        matchesStock = product.stock > 10;
      } else if (this.selectedStock === 'lowStock') {
        matchesStock = product.stock > 0 && product.stock <= 10;
      } else if (this.selectedStock === 'outOfStock') {
        matchesStock = product.stock === 0;
      }
      
      // Status filter
      const matchesStatus = this.selectedStatus === 'all' ||
        (this.selectedStatus === 'active' && product.isActive) ||
        (this.selectedStatus === 'inactive' && !product.isActive);
      
      return matchesSearch && matchesCategory && matchesStock && matchesStatus;
    };
    
    this.dataSource.filter = Math.random().toString(); // Trigger filter
  }

  calculateStats(products: Product[]) {
    this.stats.set({
      total: products.length,
      active: products.filter(p => p.isActive).length,
      lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
      outOfStock: products.filter(p => p.stock === 0).length
    });
  }

  // Selection methods
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  // CRUD Operations
  deleteProduct(product: Product) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.notification.success('Produit supprimé avec succès');
          this.loadProducts();
        },
        error: () => {
          this.notification.error('Erreur lors de la suppression');
        }
      });
    }
  }

  bulkDelete() {
    const count = this.selection.selected.length;
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${count} produit(s) ?`)) {
      // TODO: Implement bulk delete API call
      this.notification.success(`${count} produit(s) supprimé(s)`);
      this.selection.clear();
      this.loadProducts();
    }
  }

  duplicateProduct(product: Product) {
    this.notification.info('Fonctionnalité de duplication en cours de développement');
    // TODO: Implement product duplication
  }

  toggleProductStatus(product: Product) {
    const updatedProduct = { ...product, isActive: !product.isActive };
    this.productService.updateProduct(product.id, updatedProduct).subscribe({
      next: () => {
        this.notification.success(
          `Produit ${updatedProduct.isActive ? 'activé' : 'désactivé'} avec succès`
        );
        this.loadProducts();
      },
      error: () => {
        this.notification.error('Erreur lors de la mise à jour');
      }
    });
  }

  exportProducts() {
    this.notification.info('Export en cours de développement');
    // TODO: Implement CSV export
  }
}
