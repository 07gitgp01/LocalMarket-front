import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendor-pending',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1>Vendeurs en Attente d'Approbation</h1>
      <p>Composant en cours de développement...</p>
    </div>
  `
})
export class VendorPendingComponent {}
