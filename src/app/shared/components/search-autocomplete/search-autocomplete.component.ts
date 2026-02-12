import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductService } from '@core/services/product.service';
import { Product } from '@shared/models/product.model';

@Component({
    selector: 'app-search-autocomplete',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule
    ],
    template: `
    <div class="relative w-full max-w-xl">
      <mat-form-field appearance="outline" class="w-full dense-field search-field">
        <mat-icon matPrefix>search</mat-icon>
        <input type="text"
               matInput
               [formControl]="searchControl"
               [matAutocomplete]="auto"
               placeholder="Rechercher un produit, une catégorie..."
               (keyup.enter)="onSearch()">
        <button mat-icon-button matSuffix *ngIf="searchControl.value" (click)="clear()">
          <mat-icon>close</mat-icon>
        </button>
        <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onSelected($event)">
          <mat-option *ngFor="let product of filteredProducts" [value]="product.name">
            <div class="flex items-center gap-2">
              <img [src]="product.images[0]" class="w-8 h-8 object-cover rounded">
              <span class="text-sm font-medium">{{ product.name }}</span>
              <span class="text-xs text-gray-400 ml-auto">{{ product.category }}</span>
            </div>
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
    </div>
  `,
    styles: [`
    .search-field ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    .search-field ::ng-deep .mat-mdc-text-field-wrapper { background-color: white; border-radius: 9999px; }
  `]
})
export class SearchAutocompleteComponent {
    searchControl = new FormControl('');
    filteredProducts: Product[] = [];

    productService = inject(ProductService);
    router = inject(Router);

    constructor() {
        this.searchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(value => {
                if (!value || value.length < 2) return [];
                return this.productService.getProducts({ search: value }); // Mock search param support needed in service logic ideally
            })
        ).subscribe(products => {
            this.filteredProducts = products.slice(0, 5); // Limit results
        });
    }

    onSearch() {
        if (this.searchControl.value) {
            this.router.navigate(['/products'], { queryParams: { q: this.searchControl.value } });
        }
    }

    onSelected(event: any) {
        this.onSearch();
    }

    clear() {
        this.searchControl.setValue('');
    }
}
