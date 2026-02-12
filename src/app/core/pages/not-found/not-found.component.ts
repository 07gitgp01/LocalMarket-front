import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink, MatButtonModule, MatIconModule],
    template: `
    <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div class="bg-gray-100 p-8 rounded-full mb-6">
        <mat-icon class="text-6xl w-16 h-16 text-gray-400">sentiment_dissatisfied</mat-icon>
      </div>
      <h1 class="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <h2 class="text-2xl font-semibold text-gray-600 mb-4">Page non trouvée</h2>
      <p class="text-gray-500 max-w-md mb-8">
        Oups ! La page que vous recherchez semble avoir été déplacée, supprimée ou n'existe pas.
      </p>
      <a routerLink="/" mat-flat-button color="primary">
        <mat-icon class="mr-2">home</mat-icon> Retour à l'accueil
      </a>
    </div>
  `
})
export class NotFoundComponent { }
