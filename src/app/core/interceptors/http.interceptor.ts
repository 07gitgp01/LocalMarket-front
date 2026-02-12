import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);
    const router = inject(Router);

    // Récupérer le token du localStorage (si disponible)
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;

    // Cloner la requête et ajouter le header Authorization
    let clonedReq = req;
    if (token) {
        clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Une erreur inconnue est survenue';

            if (error.error instanceof ErrorEvent) {
                // Erreur côté client
                errorMessage = `Erreur: ${error.error.message}`;
            } else {
                // Erreur côté serveur
                if (error.status === 401) {
                    errorMessage = 'Session expirée, veuillez vous reconnecter';
                    // Rediliger vers login si nécessaire, nettoyer le token
                    if (typeof localStorage !== 'undefined') localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                    router.navigate(['/auth/login']);
                } else if (error.status === 403) {
                    errorMessage = 'Accès refusé';
                } else if (error.status === 404) {
                    errorMessage = 'Ressource non trouvée';
                } else if (error.status === 500) {
                    errorMessage = 'Erreur interne du serveur';
                } else {
                    errorMessage = error.error?.message || `Code erreur: ${error.status}`;
                }
            }

            // Ne pas spammer l'utilisateur sur des 404 silencieuses si besoin, 
            // mais en général on notifie.
            // On peut filtrer certaines URL ici si nécessaire.
            notificationService.error(errorMessage);

            return throwError(() => error);
        })
    );
};
