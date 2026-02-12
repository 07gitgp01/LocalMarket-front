import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { UserRole } from '@shared/models/user.model';

export const vendorGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const notification = inject(NotificationService);

    const user = authService.currentUser();

    if (authService.isAuthenticated() && (user?.role === UserRole.VENDOR || user?.role === UserRole.ADMIN)) {
        return true;
    }

    notification.error('Espace réservé aux vendeurs');
    if (authService.isAuthenticated()) {
        return router.createUrlTree(['/']);
    }
    return router.createUrlTree(['/auth/login']);
};
