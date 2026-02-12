import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

import { Address } from '@shared/models/user.model';

@Component({
    selector: 'app-addresses',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatDialogModule,
        MatMenuModule
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
             <mat-icon class="text-gray-400">home</mat-icon> Maison (Mock)
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
    // Mock addresses
    addresses: (Address & { isDefault?: boolean })[] = [
        {
            street: 'Secteur 25, Rue 12.45',
            city: 'Ouagadougou',
            region: 'Centre',
            postalCode: '00000',
            country: 'Burkina Faso',
            isDefault: true
        },
        {
            street: 'Quartier Koko, Rue 10',
            city: 'Bobo-Dioulasso',
            region: 'Hauts-Bassins',
            postalCode: '00000',
            country: 'Burkina Faso',
            isDefault: false
        }
    ];

    constructor(private dialog: MatDialog) { }

    ngOnInit() { }

    addAddress() {
        // Open Dialog
        console.log('Open Add Address Dialog');
    }

    editAddress(addr: any) {
        console.log('Edit', addr);
    }

    deleteAddress(addr: any) {
        console.log('Delete', addr);
    }

    setDefault(addr: any) {
        this.addresses.forEach(a => a.isDefault = false);
        addr.isDefault = true;
    }
}
