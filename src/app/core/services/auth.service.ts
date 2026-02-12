import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, catchError, of, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { User, LoginRequest, RegisterRequest, AuthResponse, UserRole } from '@shared/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // State management avec Signal (Angular 17+)
    private currentUserSignal = signal<User | null>(null);

    // Computed values
    readonly currentUser = this.currentUserSignal.asReadonly();
    readonly isAuthenticated = computed(() => !!this.currentUserSignal());
    readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');
    readonly isVendor = computed(() => this.currentUserSignal()?.role === 'vendor' || this.currentUserSignal()?.role === 'admin');

    constructor(
        private api: ApiService,
        private router: Router,
        private notificationService: NotificationService
    ) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage(): void {
        if (typeof localStorage !== 'undefined') {
            const user = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken');
            if (user && token) {
                this.currentUserSignal.set(JSON.parse(user));
            }
        }
    }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.api.post<AuthResponse>('/auth/login', credentials).pipe(
            tap(response => {
                this.handleAuthDocs(response);
                this.notificationService.success(`Bienvenue, ${response.user.firstName} !`);
                this.redirectAfterLogin(response.user.role);
            })
        );
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.api.post<AuthResponse>('/auth/register', data).pipe(
            tap(response => {
                this.handleAuthDocs(response);
                this.notificationService.success('Compte créé avec succès !');
                this.redirectAfterLogin(response.user.role);
            })
        );
    }

    logout(): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
        }
        this.currentUserSignal.set(null);
        this.router.navigate(['/auth/login']);
        this.notificationService.info('Vous êtes déconnecté');
    }

    updateProfile(user: Partial<User>): Observable<User> {
        const current = this.currentUserSignal();
        if (!current) return throwError(() => new Error('No user logged in'));

        return this.api.patch<User>(`/users/${current.id}`, user).pipe(
            tap(updatedUser => {
                // Merge with existing user data to keep token etc safe if needed, 
                // essentially updating the signal and local storage
                const newUser = { ...current, ...updatedUser };
                this.currentUserSignal.set(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                this.notificationService.success('Profil mis à jour');
            })
        );
    }

    private handleAuthDocs(response: AuthResponse): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        this.currentUserSignal.set(response.user);
    }

    private redirectAfterLogin(role: UserRole): void {
        if (role === 'admin') {
            this.router.navigate(['/admin']);
        } else if (role === 'vendor') {
            this.router.navigate(['/vendors/dashboard']);
        } else {
            this.router.navigate(['/']);
        }
    }

    getToken(): string | null {
        return typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    }
}
