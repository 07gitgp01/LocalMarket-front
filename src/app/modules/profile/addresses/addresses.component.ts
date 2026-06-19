import { Component, OnInit, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Address } from '@shared/models/user.model';
import { NotificationService } from '@core/services/notification.service';

export type AddressWithMeta = Address & { isDefault?: boolean; label?: string };

@Component({
  selector: 'app-address-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatDialogModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data.isEditing ? 'Modifier l\'adresse' : 'Ajouter une adresse' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="addr-form">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Type d'adresse</mat-label>
          <mat-select formControlName="label">
            <mat-option value="Maison">🏠 Maison</mat-option>
            <mat-option value="Bureau">🏢 Bureau</mat-option>
            <mat-option value="Autre">📍 Autre</mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('label')?.hasError('required')">Requis</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Rue / Secteur</mat-label>
          <input matInput formControlName="street" placeholder="Ex: Secteur 25, Rue 12.45">
          <mat-error *ngIf="form.get('street')?.hasError('required')">Requis</mat-error>
        </mat-form-field>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <mat-form-field appearance="outline">
            <mat-label>Ville</mat-label>
            <input matInput formControlName="city">
            <mat-error *ngIf="form.get('city')?.hasError('required')">Requis</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Région</mat-label>
            <mat-select formControlName="region">
              <mat-option value="Centre">Centre</mat-option>
              <mat-option value="Hauts-Bassins">Hauts-Bassins</mat-option>
              <mat-option value="Cascades">Cascades</mat-option>
              <mat-option value="Sahel">Sahel</mat-option>
              <mat-option value="Est">Est</mat-option>
              <mat-option value="Nord">Nord</mat-option>
              <mat-option value="Boucle du Mouhoun">Boucle du Mouhoun</mat-option>
              <mat-option value="Centre-Ouest">Centre-Ouest</mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('region')?.hasError('required')">Requis</mat-error>
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Code postal</mat-label>
          <input matInput formControlName="postalCode" placeholder="00000">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="submit()">
        {{ data.isEditing ? 'Modifier' : 'Ajouter' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.addr-form { display: flex; flex-direction: column; gap: 0.5rem; padding-top: 0.5rem; min-width: 360px; }`]
})
export class AddressFormDialogComponent {
  dialogRef = inject(MatDialogRef<AddressFormDialogComponent>);
  data = inject<{ address: AddressWithMeta | null; isEditing: boolean }>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    label:      [this.data.address?.label || 'Maison', Validators.required],
    street:     [this.data.address?.street || '', Validators.required],
    city:       [this.data.address?.city || '', Validators.required],
    region:     [this.data.address?.region || '', Validators.required],
    postalCode: [this.data.address?.postalCode || '00000'],
    country:    ['Burkina Faso']
  });

  submit() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }
}

@Component({
  selector: 'app-addr-confirm-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content><p>{{ data.message }}</p></mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Supprimer</button>
    </mat-dialog-actions>
  `
})
export class AddrConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }) {}
}

@Component({
    selector: 'app-addresses',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatDialogModule,
        MatMenuModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
    ],
    template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Mes Adresses</h2>
      <button mat-flat-button color="primary" (click)="addAddress()">
        <mat-icon>add</mat-icon> Ajouter une adresse
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      <!-- Address Card -->
      <mat-card *ngFor="let addr of addresses" class="p-4 relative border hover:shadow-md transition-shadow" [class.border-green-500]="addr.isDefault" [class.border-2]="addr.isDefault">
        
        <div class="absolute top-2 right-2">
           <button mat-icon-button [matMenuTriggerFor]="menu">
             <mat-icon>more_vert</mat-icon>
           </button>
           <mat-menu #menu="matMenu">
             <button mat-menu-item (click)="editAddress(addr)">
               <mat-icon>edit</mat-icon> Modifier
             </button>
             <button mat-menu-item (click)="deleteAddress(addr)" class="text-red-600">
               <mat-icon color="warn">delete</mat-icon> Supprimer
             </button>
             <button mat-menu-item *ngIf="!addr.isDefault" (click)="setDefault(addr)">
               <mat-icon>star</mat-icon> Définir par défaut
             </button>
           </mat-menu>
        </div>

        <div class="mb-2">
           <span *ngIf="addr.isDefault" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold mb-2 inline-block">PAR DÉFAUT</span>
           <h3 class="font-bold text-gray-800 flex items-center gap-2">
             <mat-icon class="text-gray-400">home</mat-icon> {{ addr.label || 'Adresse' }}
           </h3>
        </div>
        
        <p class="text-gray-600 text-sm leading-relaxed">
          {{ addr.street }}<br>
          {{ addr.city }}, {{ addr.region }}<br>
          {{ addr.country }}
        </p>

      </mat-card>

    </div>
  `
})
export class AddressesComponent implements OnInit {
    addresses: AddressWithMeta[] = [
        { label: 'Maison', street: 'Secteur 25, Rue 12.45', city: 'Ouagadougou', region: 'Centre', postalCode: '00000', country: 'Burkina Faso', isDefault: true },
        { label: 'Bureau', street: 'Quartier Koko, Rue 10', city: 'Bobo-Dioulasso', region: 'Hauts-Bassins', postalCode: '00000', country: 'Burkina Faso', isDefault: false }
    ];

    private dialog = inject(MatDialog);
    private notification = inject(NotificationService);

    ngOnInit() { }

    addAddress() {
        this.dialog.open(AddressFormDialogComponent, {
            data: { address: null, isEditing: false },
            width: '480px'
        }).afterClosed().subscribe(result => {
            if (result) {
                this.addresses.push({ ...result, isDefault: this.addresses.length === 0 });
                this.notification.success('Adresse ajoutée avec succès');
            }
        });
    }

    editAddress(addr: AddressWithMeta) {
        this.dialog.open(AddressFormDialogComponent, {
            data: { address: addr, isEditing: true },
            width: '480px'
        }).afterClosed().subscribe(result => {
            if (result) {
                const idx = this.addresses.indexOf(addr);
                if (idx !== -1) {
                    this.addresses[idx] = { ...this.addresses[idx], ...result };
                }
                this.notification.success('Adresse modifiée avec succès');
            }
        });
    }

    deleteAddress(addr: AddressWithMeta) {
        this.dialog.open(AddrConfirmDialogComponent, {
            data: { title: 'Supprimer l\'adresse', message: `Supprimer l'adresse à ${addr.city} ?` },
            width: '380px'
        }).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.addresses = this.addresses.filter(a => a !== addr);
                if (addr.isDefault && this.addresses.length > 0) {
                    this.addresses[0].isDefault = true;
                }
                this.notification.info('Adresse supprimée');
            }
        });
    }

    setDefault(addr: AddressWithMeta) {
        this.addresses.forEach(a => a.isDefault = false);
        addr.isDefault = true;
        this.notification.success('Adresse par défaut mise à jour');
    }
}
