import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '@core/services/notification.service';
import { ApiService } from '@core/services/api.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
    template: `
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div class="text-center mb-6">
        <mat-icon class="text-6xl text-gray-400 mb-2">lock_reset</mat-icon>
        <h2 class="text-2xl font-bold text-gray-800">Mot de passe oublié ?</h2>
        <p class="text-gray-600 mt-2">Entrez votre email pour recevoir les instructions de réinitialisation.</p>
      </div>
      
      <form *ngIf="!submitted" [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" placeholder="votre@email.bf">
          <mat-error *ngIf="forgotForm.get('email')?.hasError('required')">Email requis</mat-error>
          <mat-error *ngIf="forgotForm.get('email')?.hasError('email')">Email invalide</mat-error>
        </mat-form-field>

        <button mat-flat-button color="primary" type="submit" [disabled]="forgotForm.invalid || isLoading" class="w-full !py-6 !text-lg">
          {{ isLoading ? 'Envoi...' : 'Réinitialiser mon mot de passe' }}
        </button>

      </form>

      <div *ngIf="submitted" class="text-center animate-fade-in-up">
        <div class="bg-green-100 text-green-800 p-4 rounded mb-6">
          <p class="font-bold">Email envoyé !</p>
          <p class="text-sm">Vérifiez votre boîte de réception pour les instructions.</p>
        </div>
        <button mat-stroked-button color="primary" (click)="reset()">Renvoyer un email</button>
      </div>

      <div class="mt-8 text-center text-sm">
        <a routerLink="/auth/login" class="text-green-600 font-bold hover:underline flex items-center justify-center gap-1">
          <mat-icon class="text-sm h-4 w-4">arrow_back</mat-icon> Retour à la connexion
        </a>
      </div>
    </div>
  `,
    styles: [`:host { display: block; width: 100%; display: flex; justify-content: center; }`]
})
export class ForgotPasswordComponent {
    forgotForm: FormGroup;
    isLoading = false;
    submitted = false;

    constructor(
        private fb: FormBuilder,
        private notification: NotificationService,
        private api: ApiService
    ) {
        this.forgotForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit() {
        if (this.forgotForm.valid) {
            this.isLoading = true;
            // Simulation appel API
            setTimeout(() => {
                this.isLoading = false;
                this.submitted = true;
                this.notification.success('Instructions envoyées par email');
            }, 1500);
        }
    }

    reset() {
        this.submitted = false;
        this.forgotForm.reset();
    }
}
