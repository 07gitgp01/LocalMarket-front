import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pwd = control.get('newPassword');
  const confirm = control.get('confirmPassword');
  if (pwd && confirm && pwd.value !== confirm.value) {
    confirm.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>Changer le mot de passe</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="pwd-form">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Mot de passe actuel</mat-label>
          <input matInput [type]="showCurrent ? 'text' : 'password'" formControlName="currentPassword">
          <button mat-icon-button matSuffix type="button" (click)="showCurrent = !showCurrent">
            <mat-icon>{{ showCurrent ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error *ngIf="form.get('currentPassword')?.hasError('required')">Requis</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Nouveau mot de passe</mat-label>
          <input matInput [type]="showNew ? 'text' : 'password'" formControlName="newPassword">
          <button mat-icon-button matSuffix type="button" (click)="showNew = !showNew">
            <mat-icon>{{ showNew ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-hint>Minimum 8 caractères</mat-hint>
          <mat-error *ngIf="form.get('newPassword')?.hasError('minlength')">Minimum 8 caractères</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Confirmer le nouveau mot de passe</mat-label>
          <input matInput [type]="showConfirm ? 'text' : 'password'" formControlName="confirmPassword">
          <button mat-icon-button matSuffix type="button" (click)="showConfirm = !showConfirm">
            <mat-icon>{{ showConfirm ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error *ngIf="form.get('confirmPassword')?.hasError('passwordMismatch')">Les mots de passe ne correspondent pas</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid || isLoading" (click)="submit()">
        <span *ngIf="!isLoading">Enregistrer</span>
        <mat-spinner *ngIf="isLoading" diameter="20" style="margin:auto"></mat-spinner>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.pwd-form { display: flex; flex-direction: column; gap: 0.5rem; padding-top: 0.5rem; min-width: 320px; }`]
})
export class ChangePasswordDialogComponent {
  dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);
  private fb = inject(FormBuilder);
  isLoading = false;
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  form = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordsMatchValidator });

  submit() {
    if (this.form.invalid) return;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.dialogRef.close(this.form.value);
    }, 1000);
  }
}

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
        MatProgressSpinnerModule,
        MatDialogModule
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
         <button mat-stroked-button (click)="openChangePasswordDialog()">Changer le mot de passe</button>
      </div>
    </mat-card>
  `
})
export class ProfileDetailsComponent implements OnInit {
    authService = inject(AuthService);
    notification = inject(NotificationService);
    fb = inject(FormBuilder);
    private dialog = inject(MatDialog);

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
            setTimeout(() => {
                this.isLoading = false;
                this.isEditing = false;
                this.profileForm.disable();
                this.notification.success('Profil mis à jour avec succès');
            }, 1000);
        }
    }

    openChangePasswordDialog() {
        this.dialog.open(ChangePasswordDialogComponent, { width: '420px' })
            .afterClosed().subscribe(result => {
                if (result) {
                    this.notification.success('Mot de passe modifié avec succès');
                }
            });
    }
}
