import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminAnalyticsComponent } from './analytics/admin-analytics.component';
import { AdminUsersComponent } from './users/admin-users.component';
import { AdminProductsComponent } from './products/admin-products.component';

export const ADMIN_DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: AdminDashboardComponent,
        children: [
            { path: '', redirectTo: 'analytics', pathMatch: 'full' },
            { path: 'analytics', component: AdminAnalyticsComponent },
            { path: 'users', component: AdminUsersComponent },
            { path: 'products', component: AdminProductsComponent },
            // Stubs for future implementation
            { path: 'orders', component: AdminAnalyticsComponent },
            { path: 'content', component: AdminAnalyticsComponent },
            { path: 'system', component: AdminAnalyticsComponent }
        ]
    }
];
