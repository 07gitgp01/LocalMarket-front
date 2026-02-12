import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileDetailsComponent } from './details/profile-details.component';
import { AddressesComponent } from './addresses/addresses.component';
import { OrderListComponent } from '../orders/list/order-list.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { NotificationsComponent } from './notifications/notifications.component';

export const PROFILE_ROUTES: Routes = [
    {
        path: '',
        component: ProfileComponent,
        children: [
            { path: '', redirectTo: 'info', pathMatch: 'full' },
            { path: 'info', component: ProfileDetailsComponent },
            { path: 'addresses', component: AddressesComponent },
            {
                path: 'orders',
                loadComponent: () => import('../orders/list/order-list.component').then(m => m.OrderListComponent)
            },
            { path: 'wishlist', component: WishlistComponent },
            { path: 'reviews', component: ReviewsComponent },
            { path: 'notifications', component: NotificationsComponent }
        ]
    }
];
