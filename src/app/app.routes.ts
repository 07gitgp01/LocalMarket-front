import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { NotFoundComponent } from '@core/pages/not-found/not-found.component';
import { authGuard } from '@core/guards/auth.guard';
import { vendorGuard } from '@core/guards/vendor.guard';
import { roleGuard } from '@core/guards/role.guard';
import { UserRole } from '@shared/models/user.model';

export const routes: Routes = [
    // Routes publiques avec MainLayout
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'products',
                loadChildren: () => import('./modules/products/products.routes').then(m => m.PRODUCT_ROUTES)
            },
            {
                path: 'cart',
                loadComponent: () => import('./modules/cart/cart.component').then(m => m.CartComponent)
            },
            {
                path: 'checkout',
                canActivate: [authGuard],
                loadComponent: () => import('./modules/checkout/checkout.component').then(m => m.CheckoutComponent)
            },
            {
                path: 'checkout/success/:id',
                canActivate: [authGuard],
                loadComponent: () => import('./modules/checkout/success/checkout-success.component').then(m => m.CheckoutSuccessComponent)
            },
            {
                path: 'regions',
                loadComponent: () => import('./modules/regions/regions.component').then(m => m.RegionsComponent)
            },
            {
                path: 'vendors', // Liste publique des vendeurs
                loadComponent: () => import('./modules/vendors/list/list.component').then(m => m.VendorListComponent)
            },
            // Routes protégées (User)
            {
                path: 'profile',
                canActivate: [authGuard],
                loadComponent: () => import('./modules/profile/profile.component').then(m => m.ProfileComponent)
            },
            {
                path: 'orders',
                canActivate: [authGuard],
                loadChildren: () => import('./modules/orders/orders.routes').then(m => m.ORDER_ROUTES)
            },
            // Routes protégées (Vendeur)
            {
                path: 'vendor-dashboard',
                canActivate: [authGuard, vendorGuard],
                loadChildren: () => import('./modules/vendors/dashboard/vendor-dashboard.routes').then(m => m.VENDOR_DASHBOARD_ROUTES)
            },
            // Routes protégées (Admin)
            {
                path: 'admin',
                canActivate: [authGuard, roleGuard],
                data: { roles: [UserRole.ADMIN] },
                loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES)
            }
        ]
    },

    // Routes d'authentification sans Header/Footer principal
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./modules/auth/register/register.component').then(m => m.RegisterComponent)
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('./modules/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
            },
            {
                path: 'verify-email',
                loadComponent: () => import('./modules/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
            },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },

    // Fallback 404
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '404' }
];
