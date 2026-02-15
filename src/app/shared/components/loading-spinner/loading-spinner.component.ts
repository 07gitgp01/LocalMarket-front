import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-loading-spinner',
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule],
    template: `
        <div class="loading-container" [class.fullscreen]="fullscreen" [class.overlay]="overlay">
            <div class="loading-content">
                <mat-spinner [diameter]="size" [color]="color"></mat-spinner>
                <p *ngIf="message" class="loading-message">{{ message }}</p>
            </div>
        </div>
    `,
    styles: [`
        .loading-container {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3rem;
        }

        .loading-container.fullscreen {
            position: fixed;
            inset: 0;
            background: rgba(255, 255, 255, 0.9);
            z-index: 9999;
        }

        .loading-container.overlay {
            position: absolute;
            inset: 0;
            background: rgba(255, 255, 255, 0.95);
            z-index: 100;
        }

        .loading-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }

        .loading-message {
            color: #6b7280;
            font-size: 0.95rem;
            margin: 0;
            text-align: center;
        }
    `]
})
export class LoadingSpinnerComponent {
    @Input() size: number = 50;
    @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
    @Input() message?: string;
    @Input() fullscreen: boolean = false;
    @Input() overlay: boolean = false;
}
