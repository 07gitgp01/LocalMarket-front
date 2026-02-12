import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const notification = inject(NotificationService);

    if (authService.isAuthenticated()) {
        return true;
    }

    notification.info('Veuillez vous connecter pour accéder à cette page');
    // Rediriger vers login avec returnUrl
    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};
