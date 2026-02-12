import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { UserRole } from '@shared/models/user.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const notification = inject(NotificationService);

    const expectedRoles = route.data['roles'] as UserRole[];
    const user = authService.currentUser();

    if (!authService.isAuthenticated() || !user) {
        notification.warning('Accès non autorisé');
        return router.createUrlTree(['/auth/login']);
    }

    if (expectedRoles.includes(user.role)) {
        return true;
    }

    notification.error('Vous n\'avez pas les droits nécessaires pour accéder à cette page');
    return router.createUrlTree(['/']);
};
