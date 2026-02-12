import { Routes } from '@angular/router';
import { OrderListComponent } from './list/order-list.component';
import { OrderDetailComponent } from './detail/order-detail.component';
import { authGuard } from '@core/guards/auth.guard';

export const ORDER_ROUTES: Routes = [
    {
        path: '',
        component: OrderListComponent,
        canActivate: [authGuard]
    },
    {
        path: ':id',
        component: OrderDetailComponent,
        canActivate: [authGuard]
    }
];
