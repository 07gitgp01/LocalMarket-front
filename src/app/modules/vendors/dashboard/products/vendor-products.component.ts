import { Component, OnInit, ViewChild, signal, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SelectionModel } from '@angular/cdk/collections';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { ProductService } from '@core/services/product.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { Product } from '@shared/models/product.model';

// ── Delete Confirm Dialog ───────────────────────────────────────────────────
@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon color="warn">delete_forever</mat-icon>
      {{ data.title }}
    </h2>
    <mat-dialog-content>
      <p class="text-gray-700">{{ data.message }}</p>
      <p class="text-sm text-gray-500 mt-2">Cette action est irréversible.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">
        <mat-icon>delete</mat-icon> Supprimer
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmDeleteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }) {}
}

// ── Main Component ──────────────────────────────────────────────────────────
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
    MatProgressSpinnerModule
  ],
  template: `
    <!-- Loading -->
    <div class="p-loading" *ngIf="isLoading">
      <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
      <p>Chargement des produits…</p>
    </div>

    <div *ngIf="!isLoading">

      <!-- ── Header ── -->
      <div class="p-header">
        <div>
          <h1 class="p-title">Mes Produits</h1>
          <p class="p-subtitle">{{ dataSource.data.length }} produit(s) dans votre catalogue</p>
        </div>
        <div class="p-header-actions">
          <button mat-stroked-button (click)="exportProducts()" class="p-btn-export">
            <mat-icon>file_download</mat-icon> Exporter CSV
          </button>
          <button mat-flat-button color="primary" routerLink="new" class="p-btn-add">
            <mat-icon>add</mat-icon> Nouveau produit
          </button>
        </div>
      </div>

      <!-- ── Stat cards ── -->
      <div class="p-stats">
        <div class="p-stat">
          <div class="p-stat-icon blue"><mat-icon>inventory_2</mat-icon></div>
          <div>
            <div class="p-stat-label">Total</div>
            <div class="p-stat-val">{{ stats().total }}</div>
          </div>
        </div>
        <div class="p-stat">
          <div class="p-stat-icon green"><mat-icon>check_circle</mat-icon></div>
          <div>
            <div class="p-stat-label">Actifs</div>
            <div class="p-stat-val">{{ stats().active }}</div>
          </div>
        </div>
        <div class="p-stat">
          <div class="p-stat-icon amber"><mat-icon>warning</mat-icon></div>
          <div>
            <div class="p-stat-label">Stock faible</div>
            <div class="p-stat-val">{{ stats().lowStock }}</div>
          </div>
        </div>
        <div class="p-stat">
          <div class="p-stat-icon red"><mat-icon>remove_shopping_cart</mat-icon></div>
          <div>
            <div class="p-stat-label">Rupture</div>
            <div class="p-stat-val">{{ stats().outOfStock }}</div>
          </div>
        </div>
      </div>

      <!-- ── Filters ── -->
      <div class="p-filters">
        <div class="p-search">
          <mat-icon class="p-search-icon">search</mat-icon>
          <input class="p-search-input" [formControl]="searchControl" placeholder="Rechercher un produit…">
        </div>
        <mat-select [(value)]="selectedCategory" (selectionChange)="applyFilters()" class="p-select">
          <mat-option value="all">Toutes catégories</mat-option>
          <mat-option *ngFor="let cat of categories" [value]="cat">{{ cat }}</mat-option>
        </mat-select>
        <mat-select [(value)]="selectedStock" (selectionChange)="applyFilters()" class="p-select">
          <mat-option value="all">Tous les stocks</mat-option>
          <mat-option value="inStock">En stock</mat-option>
          <mat-option value="lowStock">Stock faible</mat-option>
          <mat-option value="outOfStock">Rupture</mat-option>
        </mat-select>
        <mat-select [(value)]="selectedStatus" (selectionChange)="applyFilters()" class="p-select">
          <mat-option value="all">Tous statuts</mat-option>
          <mat-option value="active">Actifs</mat-option>
          <mat-option value="inactive">Inactifs</mat-option>
        </mat-select>
      </div>

      <!-- ── Bulk action bar ── -->
      <div class="p-bulk" *ngIf="selection.hasValue()">
        <mat-icon>check_box</mat-icon>
        <span><strong>{{ selection.selected.length }}</strong> produit(s) sélectionné(s)</span>
        <button class="p-bulk-delete" (click)="bulkDelete()"><mat-icon>delete</mat-icon> Supprimer</button>
        <button class="p-bulk-cancel" (click)="selection.clear()">Annuler</button>
      </div>

      <!-- ── Table ── -->
      <div class="p-table-wrap">
        <table mat-table [dataSource]="dataSource" matSort>

          <ng-container matColumnDef="select">
            <th mat-header-cell *matHeaderCellDef>
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

          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let p">
              <div class="p-thumb">
                <img [src]="p.images[0]" [alt]="p.name">
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Produit</th>
            <td mat-cell *matCellDef="let p">
              <div class="p-name">{{ p.name }}</div>
              <div class="p-cat"><mat-icon>label_outline</mat-icon>{{ p.category }}</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Prix</th>
            <td mat-cell *matCellDef="let p">
              <div class="p-price">{{ p.price | number:'1.0-0' }} <span>FCFA</span></div>
              <div class="p-compare" *ngIf="p.compareAtPrice">{{ p.compareAtPrice | number:'1.0-0' }}</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="stock">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Stock</th>
            <td mat-cell *matCellDef="let p">
              <span class="p-stock-pill"
                [class.out]="p.stock === 0"
                [class.low]="p.stock > 0 && p.stock <= 10"
                [class.ok]="p.stock > 10">
                {{ p.stock === 0 ? 'Rupture' : p.stock <= 10 ? p.stock + ' (faible)' : p.stock }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="rating">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Note</th>
            <td mat-cell *matCellDef="let p">
              <div class="p-rating">
                <mat-icon>star</mat-icon>
                {{ p.rating | number:'1.1-1' }}
                <span>({{ p.reviewCount }})</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let p">
              <span class="p-status" [class.active]="p.isActive">
                {{ p.isActive ? 'Actif' : 'Inactif' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let p">
              <div class="p-actions">
                <button mat-icon-button [routerLink]="['/products', p.id]" matTooltip="Voir" class="p-act-view">
                  <mat-icon>open_in_new</mat-icon>
                </button>
                <button mat-icon-button [routerLink]="['edit', p.id]" matTooltip="Modifier" class="p-act-edit">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button [matMenuTriggerFor]="menu" class="p-act-more">
                  <mat-icon>more_horiz</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="duplicateProduct(p)">
                    <mat-icon>content_copy</mat-icon> Dupliquer
                  </button>
                  <button mat-menu-item (click)="toggleProductStatus(p)">
                    <mat-icon>{{ p.isActive ? 'visibility_off' : 'visibility' }}</mat-icon>
                    {{ p.isActive ? 'Désactiver' : 'Activer' }}
                  </button>
                  <mat-divider></mat-divider>
                  <button mat-menu-item (click)="deleteProduct(p)" class="p-menu-delete">
                    <mat-icon>delete</mat-icon> Supprimer
                  </button>
                </mat-menu>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="p-row"></tr>
        </table>

        <div class="p-empty" *ngIf="dataSource.filteredData.length === 0">
          <mat-icon>inventory_2</mat-icon>
          <p>Aucun produit trouvé</p>
          <span>Modifiez vos filtres ou ajoutez un nouveau produit</span>
        </div>

        <mat-paginator #paginator [pageSize]="10" [pageSizeOptions]="[5,10,25,50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    /* Loading */
    .p-loading { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 80px; color: #94a3b8; }

    /* Header */
    .p-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
    .p-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; }
    .p-subtitle { font-size: 0.78rem; color: #94a3b8; margin: 4px 0 0; }
    .p-header-actions { display: flex; gap: 10px; align-items: center; }
    .p-btn-export { border-radius: 10px !important; font-weight: 500 !important; color: #475569 !important; border-color: #e2e8f0 !important; }
    .p-btn-add { border-radius: 10px !important; font-weight: 600 !important; }

    /* Stats */
    .p-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
    .p-stat {
      background: white; border-radius: 12px; padding: 16px;
      display: flex; align-items: center; gap: 12px;
      border: 1px solid #f1f5f9;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .p-stat-icon {
      width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .p-stat-icon mat-icon { font-size: 20px; color: white; }
    .p-stat-icon.blue  { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .p-stat-icon.green { background: linear-gradient(135deg, #22c55e, #15803d); }
    .p-stat-icon.amber { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .p-stat-icon.red   { background: linear-gradient(135deg, #f87171, #dc2626); }
    .p-stat-label { font-size: 0.7rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.04em; }
    .p-stat-val { font-size: 1.4rem; font-weight: 800; color: #0f172a; line-height: 1; }

    /* Filters */
    .p-filters {
      display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
      background: white; border-radius: 12px; padding: 12px 14px;
      border: 1px solid #f1f5f9; margin-bottom: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .p-search { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 200px; }
    .p-search-icon { font-size: 18px; color: #94a3b8; flex-shrink: 0; }
    .p-search-input {
      flex: 1; border: none; outline: none;
      font-size: 0.875rem; color: #0f172a; background: transparent;
    }
    .p-search-input::placeholder { color: #cbd5e1; }
    .p-select {
      min-width: 150px; max-width: 180px;
      font-size: 0.82rem !important; color: #475569 !important;
    }

    /* Bulk bar */
    .p-bulk {
      display: flex; align-items: center; gap: 12px;
      background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px;
      padding: 10px 16px; margin-bottom: 12px; font-size: 0.85rem;
    }
    .p-bulk mat-icon { color: #f97316; font-size: 18px; }
    .p-bulk span { flex: 1; color: #7c2d12; }
    .p-bulk-delete {
      display: flex; align-items: center; gap: 4px;
      background: #dc2626; color: white; border: none; border-radius: 8px;
      padding: 6px 12px; font-size: 0.8rem; font-weight: 600; cursor: pointer;
    }
    .p-bulk-delete mat-icon { font-size: 16px; }
    .p-bulk-delete:hover { background: #b91c1c; }
    .p-bulk-cancel {
      background: white; color: #475569; border: 1px solid #e2e8f0;
      border-radius: 8px; padding: 6px 12px; font-size: 0.8rem; cursor: pointer;
    }
    .p-bulk-cancel:hover { background: #f8fafc; }

    /* Table */
    .p-table-wrap {
      background: white; border-radius: 14px; overflow: hidden;
      border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    ::ng-deep .p-table-wrap table { width: 100%; }
    ::ng-deep .p-table-wrap .mat-mdc-header-row { background: #f8fafc; }
    ::ng-deep .p-table-wrap .mat-mdc-header-cell {
      font-size: 0.7rem; font-weight: 700; color: #94a3b8;
      text-transform: uppercase; letter-spacing: 0.06em;
      border-bottom: 1px solid #f1f5f9;
    }
    ::ng-deep .p-table-wrap .mat-mdc-cell { border-bottom: 1px solid #f8fafc; }
    .p-row { transition: background 0.15s; }
    .p-row:hover { background: #f8fafc !important; }

    .p-thumb { width: 44px; height: 44px; border-radius: 8px; overflow: hidden; border: 1px solid #f1f5f9; background: #f8fafc; }
    .p-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .p-name { font-size: 0.88rem; font-weight: 700; color: #1e293b; }
    .p-cat { display: flex; align-items: center; gap: 3px; font-size: 0.7rem; color: #94a3b8; margin-top: 2px; }
    .p-cat mat-icon { font-size: 12px; width: 12px; }
    .p-price { font-size: 0.9rem; font-weight: 700; color: #0f172a; }
    .p-price span { font-size: 0.68rem; font-weight: 500; color: #94a3b8; }
    .p-compare { font-size: 0.7rem; color: #cbd5e1; text-decoration: line-through; }
    .p-stock-pill {
      display: inline-block; font-size: 0.72rem; font-weight: 700;
      padding: 3px 10px; border-radius: 20px;
    }
    .p-stock-pill.ok  { background: #dcfce7; color: #15803d; }
    .p-stock-pill.low { background: #fef3c7; color: #92400e; }
    .p-stock-pill.out { background: #fee2e2; color: #991b1b; }
    .p-rating { display: flex; align-items: center; gap: 3px; font-size: 0.82rem; font-weight: 600; color: #0f172a; }
    .p-rating mat-icon { font-size: 15px; color: #f59e0b; }
    .p-rating span { font-size: 0.7rem; color: #94a3b8; font-weight: 400; }
    .p-status {
      display: inline-block; font-size: 0.72rem; font-weight: 700;
      padding: 3px 10px; border-radius: 20px;
      background: #f1f5f9; color: #64748b;
    }
    .p-status.active { background: #dcfce7; color: #15803d; }
    .p-actions { display: flex; align-items: center; }
    .p-act-view  { color: #94a3b8 !important; } .p-act-view:hover  { color: #3b82f6 !important; }
    .p-act-edit  { color: #94a3b8 !important; } .p-act-edit:hover  { color: #22c55e !important; }
    .p-act-more  { color: #94a3b8 !important; } .p-act-more:hover  { color: #0f172a !important; }
    .p-menu-delete { color: #dc2626 !important; }

    .p-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 48px; color: #cbd5e1; }
    .p-empty mat-icon { font-size: 40px; }
    .p-empty p { font-size: 0.9rem; font-weight: 600; color: #94a3b8; margin: 0; }
    .p-empty span { font-size: 0.78rem; color: #cbd5e1; }

    /* Responsive */
    @media (max-width: 900px) { .p-stats { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 600px) {
      .p-stats { grid-template-columns: repeat(2,1fr); }
      .p-filters { flex-direction: column; align-items: stretch; }
      .p-select { max-width: 100%; }
    }
  `]
})
export class VendorProductsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['select', 'image', 'name', 'price', 'stock', 'rating', 'status', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  selection = new SelectionModel<Product>(true, []);

  isLoading = true;
  searchControl = new FormControl('');
  private filterVersion = 0;

  selectedCategory = 'all';
  selectedStock = 'all';
  selectedStatus = 'all';
  categories: string[] = [];

  stats = signal({ total: 0, active: 0, lowStock: 0, outOfStock: 0 });

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
        this.categories = [...new Set(products.map(p => p.category))];
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
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
  }

  applyFilters() {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';

    this.dataSource.filterPredicate = (product: Product) => {
      const matchesSearch = !searchTerm ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);

      const matchesCategory = this.selectedCategory === 'all' ||
        product.category === this.selectedCategory;

      let matchesStock = true;
      if (this.selectedStock === 'inStock') matchesStock = product.stock > 10;
      else if (this.selectedStock === 'lowStock') matchesStock = product.stock > 0 && product.stock <= 10;
      else if (this.selectedStock === 'outOfStock') matchesStock = product.stock === 0;

      const matchesStatus = this.selectedStatus === 'all' ||
        (this.selectedStatus === 'active' && product.isActive) ||
        (this.selectedStatus === 'inactive' && !product.isActive);

      return matchesSearch && matchesCategory && matchesStock && matchesStatus;
    };

    this.dataSource.filter = 'f' + (++this.filterVersion);
  }

  calculateStats(products: Product[]) {
    this.stats.set({
      total: products.length,
      active: products.filter(p => p.isActive).length,
      lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
      outOfStock: products.filter(p => p.stock === 0).length
    });
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  toggleAllRows() {
    if (this.isAllSelected()) { this.selection.clear(); return; }
    this.selection.select(...this.dataSource.data);
  }

  deleteProduct(product: Product) {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        title: 'Supprimer le produit',
        message: `Êtes-vous sûr de vouloir supprimer "${product.name}" ?`
      },
      width: '400px'
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.notification.success('Produit supprimé avec succès');
          this.loadProducts();
        },
        error: () => this.notification.error('Erreur lors de la suppression')
      });
    });
  }

  bulkDelete() {
    const selected = this.selection.selected;
    this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        title: `Supprimer ${selected.length} produit(s)`,
        message: `Êtes-vous sûr de vouloir supprimer ${selected.length} produit(s) sélectionné(s) ?`
      },
      width: '400px'
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      forkJoin(selected.map(p => this.productService.deleteProduct(p.id))).subscribe({
        next: () => {
          this.notification.success(`${selected.length} produit(s) supprimé(s)`);
          this.selection.clear();
          this.loadProducts();
        },
        error: () => this.notification.error('Erreur lors de la suppression en masse')
      });
    });
  }

  duplicateProduct(product: Product) {
    const { id, ...rest } = product as any;
    const copy = {
      ...rest,
      name: `${product.name} (Copie)`,
      isActive: false,
      featured: false,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    };
    this.productService.createProduct(copy).subscribe({
      next: () => {
        this.notification.success(`"${product.name}" dupliqué avec succès`);
        this.loadProducts();
      },
      error: () => this.notification.error('Erreur lors de la duplication')
    });
  }

  toggleProductStatus(product: Product) {
    this.productService.updateProduct(product.id, { ...product, isActive: !product.isActive }).subscribe({
      next: () => {
        this.notification.success(`Produit ${!product.isActive ? 'activé' : 'désactivé'} avec succès`);
        this.loadProducts();
      },
      error: () => this.notification.error('Erreur lors de la mise à jour')
    });
  }

  exportProducts() {
    const data = this.dataSource.filteredData.length > 0
      ? this.dataSource.filteredData
      : this.dataSource.data;

    const headers = ['Nom', 'Catégorie', 'Prix (FCFA)', 'Stock', 'Note', 'Statut'];
    const rows = data.map(p => [
      `"${p.name}"`,
      p.category,
      p.price,
      p.stock,
      p.rating,
      p.isActive ? 'Actif' : 'Inactif'
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `produits-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.notification.success('Export CSV téléchargé');
  }
}
