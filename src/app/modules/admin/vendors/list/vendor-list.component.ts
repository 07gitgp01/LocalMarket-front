import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { VendorService } from '@core/services/vendor.service';
import { Vendor } from '@shared/models/product.model';

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule
  ],
  template: `
    <div class="vendor-list-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>Gestion des Vendeurs</h1>
          <p class="text-gray-600">Gérez et supervisez tous les vendeurs de la plateforme</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/admin/vendors/pending">
          <mat-icon>pending_actions</mat-icon>
          Vendeurs en attente ({{ pendingCount() }})
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <div class="stat-icon blue">
            <mat-icon>store</mat-icon>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Vendeurs</p>
            <h3 class="stat-value">{{ stats().total }}</h3>
            <p class="stat-change positive">+{{ stats().newThisMonth }} ce mois</p>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon green">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-content">
            <p class="stat-label">Actifs</p>
            <h3 class="stat-value">{{ stats().active }}</h3>
            <p class="stat-change">{{ ((stats().active / stats().total) * 100).toFixed(0) }}% du total</p>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon orange">
            <mat-icon>hourglass_empty</mat-icon>
          </div>
          <div class="stat-content">
            <p class="stat-label">En Attente</p>
            <h3 class="stat-value">{{ stats().pending }}</h3>
            <p class="stat-change">À approuver</p>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon purple">
            <mat-icon>attach_money</mat-icon>
          </div>
          <div class="stat-content">
            <p class="stat-label">Revenus Totaux</p>
            <h3 class="stat-value">{{ stats().totalRevenue | number:'1.0-0' }} FCFA</h3>
            <p class="stat-change positive">+12% vs mois dernier</p>
          </div>
        </mat-card>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <div class="filters-row">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Rechercher</mat-label>
            <input matInput [formControl]="searchControl" placeholder="Nom, email, boutique...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Statut</mat-label>
            <mat-select [formControl]="statusControl">
              <mat-option value="">Tous</mat-option>
              <mat-option value="active">Actifs</mat-option>
              <mat-option value="pending">En attente</mat-option>
              <mat-option value="suspended">Suspendus</mat-option>
              <mat-option value="rejected">Rejetés</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Région</mat-label>
            <mat-select [formControl]="regionControl">
              <mat-option value="">Toutes</mat-option>
              <mat-option *ngFor="let region of regions" [value]="region">{{ region }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Trier par</mat-label>
            <mat-select [formControl]="sortControl">
              <mat-option value="name">Nom</mat-option>
              <mat-option value="date">Date d'inscription</mat-option>
              <mat-option value="revenue">Revenus</mat-option>
              <mat-option value="products">Produits</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button (click)="resetFilters()">
            <mat-icon>clear</mat-icon>
            Réinitialiser
          </button>

          <button mat-stroked-button (click)="exportVendors()">
            <mat-icon>download</mat-icon>
            Exporter
          </button>
        </div>
      </mat-card>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="loading-state">
        <mat-progress-spinner mode="indeterminate" diameter="50"></mat-progress-spinner>
      </div>

      <!-- Vendors Table -->
      <mat-card *ngIf="!isLoading()" class="table-card">
        <div class="table-header">
          <h3>Liste des Vendeurs ({{ filteredVendors().length }})</h3>
          <div class="selected-actions" *ngIf="selectedVendors().length > 0">
            <span>{{ selectedVendors().length }} sélectionné(s)</span>
            <button mat-button (click)="approveSelected()">
              <mat-icon>check</mat-icon>
              Approuver
            </button>
            <button mat-button (click)="suspendSelected()">
              <mat-icon>block</mat-icon>
              Suspendre
            </button>
            <button mat-button color="warn" (click)="deleteSelected()">
              <mat-icon>delete</mat-icon>
              Supprimer
            </button>
          </div>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="filteredVendors()" class="vendors-table">
            <!-- Checkbox Column -->
            <ng-container matColumnDef="select">
              <th mat-header-cell *matHeaderCellDef>
                <mat-checkbox
                  (change)="toggleAllVendors($event.checked)"
                  [checked]="allSelected()"
                  [indeterminate]="someSelected()">
                </mat-checkbox>
              </th>
              <td mat-cell *matCellDef="let vendor">
                <mat-checkbox
                  (change)="toggleVendor(vendor, $event.checked)"
                  [checked]="isSelected(vendor)">
                </mat-checkbox>
              </td>
            </ng-container>

            <!-- Vendor Column -->
            <ng-container matColumnDef="vendor">
              <th mat-header-cell *matHeaderCellDef>Vendeur</th>
              <td mat-cell *matCellDef="let vendor">
                <div class="vendor-cell">
                  <img [src]="vendor.logo || 'https://ui-avatars.com/api/?name=' + vendor.shopName" 
                       [alt]="vendor.shopName" class="vendor-avatar">
                  <div>
                    <div class="vendor-name">{{ vendor.shopName }}</div>
                    <div class="vendor-email">{{ vendor.email }}</div>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Contact Column -->
            <ng-container matColumnDef="contact">
              <th mat-header-cell *matHeaderCellDef>Contact</th>
              <td mat-cell *matCellDef="let vendor">
                <div class="contact-cell">
                  <div><mat-icon class="small-icon">phone</mat-icon> {{ vendor.phone || 'N/A' }}</div>
                  <div><mat-icon class="small-icon">place</mat-icon> {{ vendor.location?.region || 'N/A' }}</div>
                </div>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let vendor">
                <mat-chip [class]="'status-' + (vendor.status || 'active')">
                  {{ getStatusLabel(vendor.status || 'active') }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Products Column -->
            <ng-container matColumnDef="products">
              <th mat-header-cell *matHeaderCellDef>Produits</th>
              <td mat-cell *matCellDef="let vendor">
                <div class="products-cell">
                  <strong>{{ vendor.productCount || 0 }}</strong>
                  <span class="text-gray-500">produits</span>
                </div>
              </td>
            </ng-container>

            <!-- Revenue Column -->
            <ng-container matColumnDef="revenue">
              <th mat-header-cell *matHeaderCellDef>Revenus</th>
              <td mat-cell *matCellDef="let vendor">
                <strong>{{ vendor.totalRevenue || 0 | number:'1.0-0' }} FCFA</strong>
              </td>
            </ng-container>

            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Inscription</th>
              <td mat-cell *matCellDef="let vendor">
                {{ vendor.createdAt | date:'dd/MM/yyyy' }}
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let vendor">
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item [routerLink]="['/admin/vendors', vendor.id]">
                    <mat-icon>visibility</mat-icon>
                    <span>Voir détails</span>
                  </button>
                  <button mat-menu-item *ngIf="vendor.status === 'pending'" (click)="approveVendor(vendor)">
                    <mat-icon>check_circle</mat-icon>
                    <span>Approuver</span>
                  </button>
                  <button mat-menu-item *ngIf="vendor.status === 'active'" (click)="suspendVendor(vendor)">
                    <mat-icon>block</mat-icon>
                    <span>Suspendre</span>
                  </button>
                  <button mat-menu-item *ngIf="vendor.status === 'suspended'" (click)="activateVendor(vendor)">
                    <mat-icon>check_circle</mat-icon>
                    <span>Activer</span>
                  </button>
                  <button mat-menu-item (click)="editVendor(vendor)">
                    <mat-icon>edit</mat-icon>
                    <span>Modifier</span>
                  </button>
                  <mat-divider></mat-divider>
                  <button mat-menu-item (click)="deleteVendor(vendor)" class="text-red-600">
                    <mat-icon>delete</mat-icon>
                    <span>Supprimer</span>
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredVendors().length === 0" class="empty-state">
          <mat-icon>store_mall_directory</mat-icon>
          <h3>Aucun vendeur trouvé</h3>
          <p>Essayez de modifier vos filtres de recherche</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .vendor-list-page {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: #1f2937;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      display: flex;
      gap: 1rem;
      padding: 1.5rem !important;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-icon.blue { background: #dbeafe; color: #3b82f6; }
    .stat-icon.green { background: #d1fae5; color: #10b981; }
    .stat-icon.orange { background: #fed7aa; color: #f97316; }
    .stat-icon.purple { background: #e9d5ff; color: #a855f7; }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 0.5rem 0;
    }

    .stat-value {
      font-size: 1.875rem;
      font-weight: 700;
      margin: 0 0 0.25rem 0;
      color: #1f2937;
    }

    .stat-change {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .stat-change.positive {
      color: #10b981;
    }

    /* Filters */
    .filters-card {
      margin-bottom: 2rem;
      padding: 1.5rem !important;
    }

    .filters-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .search-field {
      flex: 1;
      min-width: 250px;
    }

    /* Table */
    .table-card {
      padding: 0 !important;
      overflow: hidden;
    }

    .table-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .selected-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .table-container {
      overflow-x: auto;
    }

    .vendors-table {
      width: 100%;
    }

    .vendor-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .vendor-avatar {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      object-fit: cover;
    }

    .vendor-name {
      font-weight: 600;
      color: #1f2937;
    }

    .vendor-email {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .contact-cell {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.875rem;
    }

    .contact-cell div {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .small-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #9ca3af;
    }

    .products-cell {
      display: flex;
      flex-direction: column;
    }

    mat-chip {
      font-size: 0.75rem !important;
      height: 24px !important;
      min-height: 24px !important;
    }

    mat-chip.status-active {
      background: #d1fae5 !important;
      color: #065f46 !important;
    }

    mat-chip.status-pending {
      background: #fed7aa !important;
      color: #9a3412 !important;
    }

    mat-chip.status-suspended {
      background: #fee2e2 !important;
      color: #991b1b !important;
    }

    mat-chip.status-rejected {
      background: #f3f4f6 !important;
      color: #4b5563 !important;
    }

    /* Loading & Empty */
    .loading-state,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #d1d5db;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      color: #6b7280;
      margin: 0;
    }
  `]
})
export class VendorListComponent implements OnInit {
  private vendorService = inject(VendorService);
  private dialog = inject(MatDialog);

  vendors = signal<Vendor[]>([]);
  filteredVendors = signal<Vendor[]>([]);
  selectedVendors = signal<Vendor[]>([]);
  isLoading = signal(true);
  pendingCount = signal(0);

  stats = signal({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    newThisMonth: 0,
    totalRevenue: 0
  });

  regions = ['Centre', 'Hauts-Bassins', 'Cascades', 'Sahel', 'Est', 'Nord', 'Boucle du Mouhoun', 
             'Centre-Nord', 'Centre-Ouest', 'Centre-Est', 'Centre-Sud', 'Plateau-Central', 'Sud-Ouest'];

  displayedColumns = ['select', 'vendor', 'contact', 'status', 'products', 'revenue', 'date', 'actions'];

  searchControl = new FormControl('');
  statusControl = new FormControl('');
  regionControl = new FormControl('');
  sortControl = new FormControl('name');

  ngOnInit() {
    this.loadVendors();
    this.setupFilters();
  }

  loadVendors() {
    this.isLoading.set(true);
    this.vendorService.getVendors().subscribe({
      next: (vendors) => {
        this.vendors.set(vendors);
        this.filteredVendors.set(vendors);
        this.calculateStats(vendors);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });

    this.vendorService.getPendingVendors().subscribe({
      next: (pending) => this.pendingCount.set(pending.length)
    });
  }

  setupFilters() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyFilters());

    this.statusControl.valueChanges.subscribe(() => this.applyFilters());
    this.regionControl.valueChanges.subscribe(() => this.applyFilters());
    this.sortControl.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters() {
    let filtered = [...this.vendors()];

    const search = this.searchControl.value?.toLowerCase();
    if (search) {
      filtered = filtered.filter(v =>
        v.shopName.toLowerCase().includes(search) ||
        v.email?.toLowerCase().includes(search) ||
        v.phone?.toLowerCase().includes(search)
      );
    }

    const status = this.statusControl.value;
    if (status) {
      filtered = filtered.filter(v => (v as any).status === status);
    }

    const region = this.regionControl.value;
    if (region) {
      filtered = filtered.filter(v => v.location?.region === region);
    }

    this.filteredVendors.set(filtered);
  }

  calculateStats(vendors: Vendor[]) {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    this.stats.set({
      total: vendors.length,
      active: vendors.filter(v => (v as any).status === 'active').length,
      pending: vendors.filter(v => (v as any).status === 'pending').length,
      suspended: vendors.filter(v => (v as any).status === 'suspended').length,
      newThisMonth: vendors.filter(v => new Date(v.createdAt || '') >= thisMonth).length,
      totalRevenue: vendors.reduce((sum, v) => sum + ((v as any).totalRevenue || 0), 0)
    });
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      active: 'Actif',
      pending: 'En attente',
      suspended: 'Suspendu',
      rejected: 'Rejeté'
    };
    return labels[status] || status;
  }

  toggleVendor(vendor: Vendor, checked: boolean) {
    const selected = this.selectedVendors();
    if (checked) {
      this.selectedVendors.set([...selected, vendor]);
    } else {
      this.selectedVendors.set(selected.filter(v => v.id !== vendor.id));
    }
  }

  toggleAllVendors(checked: boolean) {
    this.selectedVendors.set(checked ? [...this.filteredVendors()] : []);
  }

  isSelected(vendor: Vendor): boolean {
    return this.selectedVendors().some(v => v.id === vendor.id);
  }

  allSelected(): boolean {
    return this.filteredVendors().length > 0 && 
           this.selectedVendors().length === this.filteredVendors().length;
  }

  someSelected(): boolean {
    return this.selectedVendors().length > 0 && !this.allSelected();
  }

  approveVendor(vendor: Vendor) {
    this.vendorService.approveVendor(vendor.id).subscribe(() => {
      this.loadVendors();
    });
  }

  suspendVendor(vendor: Vendor) {
    this.vendorService.suspendVendor(vendor.id, 'Suspendu par admin').subscribe(() => {
      this.loadVendors();
    });
  }

  activateVendor(vendor: Vendor) {
    this.vendorService.activateVendor(vendor.id).subscribe(() => {
      this.loadVendors();
    });
  }

  deleteVendor(vendor: Vendor) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${vendor.shopName} ?`)) {
      this.vendorService.deleteVendor(vendor.id).subscribe(() => {
        this.loadVendors();
      });
    }
  }

  editVendor(vendor: Vendor) {
    // TODO: Ouvrir dialog d'édition
  }

  approveSelected() {
    // TODO: Approuver en masse
  }

  suspendSelected() {
    // TODO: Suspendre en masse
  }

  deleteSelected() {
    // TODO: Supprimer en masse
  }

  resetFilters() {
    this.searchControl.setValue('');
    this.statusControl.setValue('');
    this.regionControl.setValue('');
    this.sortControl.setValue('name');
  }

  exportVendors() {
    // TODO: Export CSV
    console.log('Export vendors');
  }
}
