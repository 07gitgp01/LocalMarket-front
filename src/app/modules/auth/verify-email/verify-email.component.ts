import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-verify-email',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
      
      <ng-container *ngIf="isLoading">
        <mat-spinner diameter="50" class="mx-auto mb-4"></mat-spinner>
        <h2 class="text-xl font-bold text-gray-800">Vérification en cours...</h2>
        <p class="text-gray-600 mt-2">Veuillez patienter pendant que nous validons votre email.</p>
      </ng-container>

      <ng-container *ngIf="!isLoading && isSuccess">
        <mat-icon class="text-6xl text-green-500 mb-2">check_circle</mat-icon>
        <h2 class="text-2xl font-bold text-green-700">Email Vérifié !</h2>
        <p class="text-gray-600 mt-2 mb-6">Votre compte est maintenant activé. Vous pouvez vous connecter.</p>
        <a routerLink="/auth/login" mat-flat-button color="primary" class="w-full !py-6 !text-lg">
          Accéder à mon compte
        </a>
      </ng-container>

      <ng-container *ngIf="!isLoading && !isSuccess">
        <mat-icon class="text-6xl text-red-500 mb-2">error</mat-icon>
        <h2 class="text-2xl font-bold text-red-700">Lien invalide ou expiré</h2>
        <p class="text-gray-600 mt-2 mb-6">Le lien de vérification semble être incorrect ou a déjà été utilisé.</p>
        <a routerLink="/auth/login" mat-stroked-button color="primary">
          Retour à l'accueil
        </a>
      </ng-container>

    </div>
  `,
    styles: [`:host { display: block; width: 100%; display: flex; justify-content: center; }`]
})
export class VerifyEmailComponent implements OnInit {
    isLoading = true;
    isSuccess = false;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        // Simulation de vérification token
        const token = this.route.snapshot.queryParams['token'];

        setTimeout(() => {
            this.isLoading = false;
            this.isSuccess = !!token; // Succès si token présent (mock)
        }, 2000);
    }
}
