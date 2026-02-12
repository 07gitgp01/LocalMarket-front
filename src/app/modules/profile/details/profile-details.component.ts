import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
    selector: 'app-profile-details',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    template: `
    <mat-card class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-800">Informations Personnelles</h2>
        <button mat-icon-button color="primary" *ngIf="!isEditing" (click)="toggleEdit()">
          <mat-icon>edit</mat-icon>
        </button>
      </div>

      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <mat-form-field appearance="outline">
            <mat-label>Prénom</mat-label>
            <input matInput formControlName="firstName">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Nom</mat-label>
            <input matInput formControlName="lastName">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" readonly class="bg-gray-50 text-gray-500">
             <mat-icon matSuffix class="text-gray-400" matTooltip="L'email ne peut pas être modifié">lock</mat-icon>
            <mat-hint>Contactez le support pour changer d'email</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Téléphone</mat-label>
            <input matInput formControlName="phone">
          </mat-form-field>

        </div>

        <div class="mt-6 flex justify-end gap-3" *ngIf="isEditing">
          <button type="button" mat-button (click)="cancelEdit()" [disabled]="isLoading">Annuler</button>
          <button type="submit" mat-flat-button color="primary" [disabled]="profileForm.invalid || isLoading">
            <span *ngIf="!isLoading">Enregistrer les modifications</span>
            <mat-spinner *ngIf="isLoading" diameter="20" class="mx-auto"></mat-spinner>
          </button>
        </div>
      </form>
    </mat-card>

    <mat-card class="p-6 mt-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Sécurité</h2>
      <div class="flex items-center justify-between">
         <div>
           <div class="font-semibold">Mot de passe</div>
           <div class="text-sm text-gray-500">Dernière modification il y a 3 mois</div>
         </div>
         <button mat-stroked-button>Changer le mot de passe</button>
      </div>
    </mat-card>
  `
})
export class ProfileDetailsComponent implements OnInit {
    authService = inject(AuthService);
    notification = inject(NotificationService);
    fb = inject(FormBuilder);

    profileForm: FormGroup;
    isEditing = false;
    isLoading = false;

    constructor() {
        this.profileForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: [''], // Readonly usually
            phone: ['', Validators.required]
        });
        this.profileForm.disable(); // Disabled by default
    }

    ngOnInit() {
        const user = this.authService.currentUser();
        if (user) {
            this.profileForm.patchValue({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            });
        }
    }

    toggleEdit() {
        this.isEditing = true;
        this.profileForm.enable();
        this.profileForm.get('email')?.disable(); // Keep email disabled
    }

    cancelEdit() {
        this.isEditing = false;
        this.profileForm.disable();
        this.ngOnInit(); // Reset values
    }

    onSubmit() {
        if (this.profileForm.valid) {
            this.isLoading = true;
            // Simulation appel API update profile
            setTimeout(() => {
                this.isLoading = false;
                this.isEditing = false;
                this.profileForm.disable();
                // Update local state (normally handled by AuthService update method)
                this.notification.success('Profil mis à jour avec succès');
            }, 1000);
        }
    }
}
