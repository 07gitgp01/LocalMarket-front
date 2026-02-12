import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="users-container">
      <div class="page-header">
        <div>
          <h1>Gestion des utilisateurs</h1>
          <p>Gérez tous les utilisateurs de la plateforme</p>
        </div>
        <button mat-flat-button color="primary">
          <mat-icon>person_add</mat-icon>
          Ajouter un admin
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon purple">
            <mat-icon>admin_panel_settings</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">12</span>
            <span class="stat-label">Administrateurs</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon blue">
            <mat-icon>store</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">340</span>
            <span class="stat-label">Vendeurs</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <mat-icon>people</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">12,098</span>
            <span class="stat-label">Clients</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon orange">
            <mat-icon>local_shipping</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">45</span>
            <span class="stat-label">Livreurs</span>
          </div>
        </div>
      </div>

      <!-- Filters & Table -->
      <div class="table-container">
        <div class="table-header">
          <div class="search-bar">
            <mat-icon>search</mat-icon>
            <input 
              type="text" 
              [formControl]="searchControl" 
              placeholder="Rechercher par nom, email, téléphone..."
            >
          </div>
          <div class="filter-actions">
            <button mat-stroked-button>
              <mat-icon>filter_list</mat-icon>
              Filtres
            </button>
            <button mat-stroked-button>
              <mat-icon>file_download</mat-icon>
              Exporter
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <mat-tab-group class="users-tabs">
          <mat-tab label="Tous (12,495)">
            <div class="table-wrapper">
              <table mat-table [dataSource]="users" class="users-table">
                
                <ng-container matColumnDef="user">
                  <th mat-header-cell *matHeaderCellDef>Utilisateur</th>
                  <td mat-cell *matCellDef="let user">
                    <div class="user-cell">
                      <div class="user-avatar" [style.background]="getAvatarColor(user.role)">
                        {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                      </div>
                      <div class="user-info">
                        <h4>{{ user.firstName }} {{ user.lastName }}</h4>
                        <p>{{ user.email }}</p>
                      </div>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="role">
                  <th mat-header-cell *matHeaderCellDef>Rôle</th>
                  <td mat-cell *matCellDef="let user">
                    <span class="role-badge" [ngClass]="getRoleClass(user.role)">
                      <mat-icon>{{ getRoleIcon(user.role) }}</mat-icon>
                      <span>{{ getRoleLabel(user.role) }}</span>
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Statut</th>
                  <td mat-cell *matCellDef="let user">
                    <span class="status-badge active">
                      <span class="status-dot"></span>
                      <span>Actif</span>
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="joined">
                  <th mat-header-cell *matHeaderCellDef>Inscrit le</th>
                  <td mat-cell *matCellDef="let user">
                    <div class="date-cell">
                      <span>01 Jan 2026</span>
                      <span class="time">14:30</span>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef></th>
                  <td mat-cell *matCellDef="let user">
                    <div class="action-buttons">
                      <button mat-icon-button [matMenuTriggerFor]="menu" class="action-menu">
                        <mat-icon>more_vert</mat-icon>
                      </button>
                      <mat-menu #menu="matMenu">
                        <button mat-menu-item>
                          <mat-icon>visibility</mat-icon>
                          <span>Voir le profil</span>
                        </button>
                        <button mat-menu-item>
                          <mat-icon>edit</mat-icon>
                          <span>Modifier</span>
                        </button>
                        <button mat-menu-item>
                          <mat-icon>block</mat-icon>
                          <span>Suspendre</span>
                        </button>
                        <mat-divider></mat-divider>
                        <button mat-menu-item class="danger">
                          <mat-icon color="warn">delete</mat-icon>
                          <span>Supprimer</span>
                        </button>
                      </mat-menu>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
              </table>
            </div>

            <div class="table-footer">
              <span class="results-count">Affichage de 1-4 sur 12,495 résultats</span>
              <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons></mat-paginator>
            </div>
          </mat-tab>

          <mat-tab label="Vendeurs (340)">
            <div class="tab-content">
              <p>Liste des vendeurs...</p>
            </div>
          </mat-tab>

          <mat-tab label="Clients (12,098)">
            <div class="tab-content">
              <p>Liste des clients...</p>
            </div>
          </mat-tab>

          <mat-tab label="En attente (23)">
            <div class="tab-content">
              <p>Comptes en attente de validation...</p>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 0;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .page-header p {
      color: #6b7280;
      margin: 0;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.purple {
      background: #ede9fe;
      color: #8b5cf6;
    }

    .stat-icon.blue {
      background: #dbeafe;
      color: #3b82f6;
    }

    .stat-icon.green {
      background: #d1fae5;
      color: #10b981;
    }

    .stat-icon.orange {
      background: #fed7aa;
      color: #f59e0b;
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: #1f2937;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #6b7280;
      font-weight: 500;
    }

    /* Table Container */
    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .table-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-bar {
      flex: 1;
      min-width: 300px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .search-bar:focus-within {
      border-color: #10b981;
      background: white;
    }

    .search-bar mat-icon {
      color: #9ca3af;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .search-bar input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-size: 0.95rem;
      color: #1f2937;
    }

    .search-bar input::placeholder {
      color: #9ca3af;
    }

    .filter-actions {
      display: flex;
      gap: 0.75rem;
    }

    /* Tabs */
    .users-tabs {
      ::ng-deep .mat-mdc-tab-labels {
        padding: 0 1.5rem;
        border-bottom: 1px solid #e5e7eb;
      }

      ::ng-deep .mat-mdc-tab {
        min-width: 120px;
      }
    }

    .tab-content {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
    }

    /* Table */
    .table-wrapper {
      overflow-x: auto;
    }

    .users-table {
      width: 100%;
    }

    .users-table th {
      background: #f9fafb;
      font-weight: 700;
      color: #374151;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 1rem 1.5rem;
    }

    .users-table td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .table-row {
      transition: background 0.2s ease;
    }

    .table-row:hover {
      background: #f9fafb;
    }

    /* User Cell */
    .user-cell {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
      color: white;
    }

    .user-info h4 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }

    .user-info p {
      font-size: 0.85rem;
      color: #6b7280;
      margin: 0;
    }

    /* Role Badge */
    .role-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .role-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .role-badge.admin {
      background: #ede9fe;
      color: #8b5cf6;
    }

    .role-badge.vendor {
      background: #dbeafe;
      color: #3b82f6;
    }

    .role-badge.customer {
      background: #d1fae5;
      color: #10b981;
    }

    .role-badge.driver {
      background: #fed7aa;
      color: #f59e0b;
    }

    /* Status Badge */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      font-weight: 500;
      color: #374151;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
    }

    .status-badge.inactive .status-dot {
      background: #ef4444;
    }

    /* Date Cell */
    .date-cell {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .date-cell span {
      font-size: 0.9rem;
      color: #374151;
    }

    .date-cell .time {
      font-size: 0.8rem;
      color: #9ca3af;
    }

    /* Actions */
    .action-buttons {
      display: flex;
      justify-content: flex-end;
    }

    .action-menu {
      color: #6b7280;
    }

    .danger {
      color: #ef4444 !important;
    }

    /* Table Footer */
    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .results-count {
      font-size: 0.9rem;
      color: #6b7280;
    }
  `]
})
export class AdminUsersComponent {
  displayedColumns: string[] = ['user', 'role', 'status', 'joined', 'actions'];
  searchControl = new FormControl('');

  // Mock Data
  users: any[] = [
    { id: 1, firstName: 'Paulin', lastName: 'G', email: 'paulin@example.com', role: 'admin' },
    { id: 2, firstName: 'Jean', lastName: 'Vendeur', email: 'jean@store.com', role: 'vendor' },
    { id: 3, firstName: 'Marie', lastName: 'Client', email: 'marie@client.com', role: 'customer' },
    { id: 4, firstName: 'Moussa', lastName: 'Livreur', email: 'moussa@logistics.com', role: 'driver' },
  ];

  getAvatarColor(role: string): string {
    const colors: any = {
      admin: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      vendor: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      customer: 'linear-gradient(135deg, #10b981, #059669)',
      driver: 'linear-gradient(135deg, #f59e0b, #d97706)'
    };
    return colors[role] || colors.customer;
  }

  getRoleClass(role: string): string {
    return role;
  }

  getRoleIcon(role: string): string {
    const icons: any = {
      admin: 'admin_panel_settings',
      vendor: 'store',
      customer: 'person',
      driver: 'local_shipping'
    };
    return icons[role] || 'person';
  }

  getRoleLabel(role: string): string {
    const labels: any = {
      admin: 'Administrateur',
      vendor: 'Vendeur',
      customer: 'Client',
      driver: 'Livreur'
    };
    return labels[role] || role;
  }
}
