import { Routes } from '@angular/router';
import { VendorDashboardComponent } from './vendor-dashboard.component';
import { VendorAnalyticsComponent } from './analytics/vendor-analytics.component';
import { VendorProductsComponent } from './products/vendor-products.component';
import { VendorOrdersComponent } from './orders/vendor-orders.component';

export const VENDOR_DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: VendorDashboardComponent,
        children: [
            { path: '', redirectTo: 'analytics', pathMatch: 'full' },
            { path: 'analytics', component: VendorAnalyticsComponent },
            { path: 'products', component: VendorProductsComponent },
            { path: 'orders', component: VendorOrdersComponent },
            // Placeholders
            { path: 'profile', component: VendorAnalyticsComponent },
            { path: 'support', component: VendorAnalyticsComponent },
        ]
    }
];
