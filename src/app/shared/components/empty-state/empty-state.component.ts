import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-empty-state',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink],
    template: `
        <div class="empty-state" [class.compact]="compact">
            <div class="empty-icon" [style.background]="iconBackground">
                <mat-icon [style.color]="iconColor">{{ icon }}</mat-icon>
            </div>
            <h3 class="empty-title">{{ title }}</h3>
            <p class="empty-description" *ngIf="description">{{ description }}</p>
            <button 
                *ngIf="actionLabel && actionRoute"
                mat-flat-button 
                color="primary"
                [routerLink]="actionRoute"
                class="empty-action">
                <mat-icon *ngIf="actionIcon">{{ actionIcon }}</mat-icon>
                {{ actionLabel }}
            </button>
            <button 
                *ngIf="actionLabel && !actionRoute && actionClick"
                mat-flat-button 
                color="primary"
                (click)="actionClick()"
                class="empty-action">
                <mat-icon *ngIf="actionIcon">{{ actionIcon }}</mat-icon>
                {{ actionLabel }}
            </button>
        </div>
    `,
    styles: [`
        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            text-align: center;
        }

        .empty-state.compact {
            padding: 2rem 1rem;
        }

        .empty-icon {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2rem;
            background: linear-gradient(135deg, #f0fdf4, #d1fae5);
        }

        .empty-state.compact .empty-icon {
            width: 80px;
            height: 80px;
            margin-bottom: 1.5rem;
        }

        .empty-icon mat-icon {
            font-size: 64px;
            width: 64px;
            height: 64px;
            color: #10b981;
        }

        .empty-state.compact .empty-icon mat-icon {
            font-size: 48px;
            width: 48px;
            height: 48px;
        }

        .empty-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #1f2937;
            margin: 0 0 0.75rem 0;
        }

        .empty-state.compact .empty-title {
            font-size: 1.25rem;
        }

        .empty-description {
            font-size: 1.1rem;
            color: #6b7280;
            margin: 0 0 2rem 0;
            max-width: 500px;
        }

        .empty-state.compact .empty-description {
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
        }

        .empty-action {
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
export class EmptyStateComponent {
    @Input() icon: string = 'inbox';
    @Input() iconColor: string = '#10b981';
    @Input() iconBackground: string = 'linear-gradient(135deg, #f0fdf4, #d1fae5)';
    @Input() title: string = 'Aucun élément';
    @Input() description?: string;
    @Input() actionLabel?: string;
    @Input() actionIcon?: string;
    @Input() actionRoute?: string | any[];
    @Input() actionClick?: () => void;
    @Input() compact: boolean = false;
}
