import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        children: [
            {
                path: '',
                redirectTo: 'analytics',
                pathMatch: 'full'
            },
            {
                path: 'analytics',
                loadComponent: () => import('./dashboard/analytics/admin-analytics.component').then(m => m.AdminAnalyticsComponent)
            },
            {
                path: 'vendors',
                loadComponent: () => import('./vendors/list/vendor-list.component').then(m => m.VendorListComponent)
            },
            {
                path: 'vendors/:id',
                loadComponent: () => import('./vendors/detail/vendor-detail.component').then(m => m.VendorDetailComponent)
            },
            {
                path: 'vendors/pending',
                loadComponent: () => import('./vendors/pending/vendor-pending.component').then(m => m.VendorPendingComponent)
            },
            {
                path: 'regions',
                loadComponent: () => import('./regions/list/region-list.component').then(m => m.RegionListComponent)
            },
            {
                path: 'regions/new',
                loadComponent: () => import('./regions/form/region-form.component').then(m => m.RegionFormComponent)
            },
            {
                path: 'regions/:id',
                loadComponent: () => import('./regions/detail/region-detail.component').then(m => m.RegionDetailComponent)
            },
            {
                path: 'regions/:id/edit',
                loadComponent: () => import('./regions/form/region-form.component').then(m => m.RegionFormComponent)
            }
        ]
    }
];
