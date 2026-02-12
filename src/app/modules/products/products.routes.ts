import { Routes } from '@angular/router';
import { ProductListComponent } from './list/product-list.component';
import { ProductDetailComponent } from './detail/product-detail.component';

export const PRODUCT_ROUTES: Routes = [
    {
        path: '',
        component: ProductListComponent
    },
    {
        path: 'search',
        component: ProductListComponent // Reuse list for search results
    },
    {
        path: ':id',
        component: ProductDetailComponent
    }
];
