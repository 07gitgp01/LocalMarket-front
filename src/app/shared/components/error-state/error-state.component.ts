import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-error-state',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    template: `
        <div class="error-state">
            <div class="error-icon">
                <mat-icon>{{ icon }}</mat-icon>
            </div>
            <h3 class="error-title">{{ title }}</h3>
            <p class="error-message" *ngIf="message">{{ message }}</p>
            <div class="error-actions" *ngIf="showRetry || showHome">
                <button 
                    *ngIf="showRetry"
                    mat-flat-button 
                    color="primary"
                    (click)="onRetry()"
                    [disabled]="retrying">
                    <mat-icon>refresh</mat-icon>
                    {{ retrying ? 'Chargement...' : 'Réessayer' }}
                </button>
                <button 
                    *ngIf="showHome"
                    mat-stroked-button
                    (click)="onGoHome()">
                    <mat-icon>home</mat-icon>
                    Retour à l'accueil
                </button>
            </div>
        </div>
    `,
    styles: [`
        .error-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            text-align: center;
        }

        .error-icon {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2rem;
            background: linear-gradient(135deg, #fef2f2, #fee2e2);
        }

        .error-icon mat-icon {
            font-size: 64px;
            width: 64px;
            height: 64px;
            color: #ef4444;
        }

        .error-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #1f2937;
            margin: 0 0 0.75rem 0;
        }

        .error-message {
            font-size: 1.1rem;
            color: #6b7280;
            margin: 0 0 2rem 0;
            max-width: 500px;
        }

        .error-actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
        }

        .error-actions button {
            height: 48px !important;
            padding: 0 2rem !important;
            font-size: 1rem !important;
            font-weight: 600 !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
        }
    `]
})
export class ErrorStateComponent {
    @Input() icon: string = 'error_outline';
    @Input() title: string = 'Une erreur est survenue';
    @Input() message?: string = 'Impossible de charger les données. Veuillez réessayer.';
    @Input() showRetry: boolean = true;
    @Input() showHome: boolean = false;
    @Input() retrying: boolean = false;
    
    @Output() retry = new EventEmitter<void>();
    @Output() goHome = new EventEmitter<void>();

    onRetry() {
        this.retry.emit();
    }

    onGoHome() {
        this.goHome.emit();
    }
}
