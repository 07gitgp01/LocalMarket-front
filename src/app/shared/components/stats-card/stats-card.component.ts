import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-stats-card',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatCardModule],
    template: `
        <mat-card class="stats-card" [class.clickable]="clickable">
            <div class="stats-icon" [style.background]="iconBackground">
                <mat-icon [style.color]="iconColor">{{ icon }}</mat-icon>
            </div>
            <div class="stats-content">
                <div class="stats-label">{{ label }}</div>
                <div class="stats-value">{{ value | number }}</div>
                <div class="stats-change" *ngIf="change !== undefined" [class.positive]="change >= 0" [class.negative]="change < 0">
                    <mat-icon>{{ change >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
                    <span>{{ change >= 0 ? '+' : '' }}{{ change }}%</span>
                    <span class="change-label" *ngIf="changeLabel">{{ changeLabel }}</span>
                </div>
            </div>
        </mat-card>
    `,
    styles: [`
        .stats-card {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            padding: 1.5rem !important;
            transition: all 0.3s ease;
            cursor: default;
        }

        .stats-card.clickable {
            cursor: pointer;
        }

        .stats-card.clickable:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
        }

        .stats-icon {
            width: 64px;
            height: 64px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .stats-icon mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
        }

        .stats-content {
            flex: 1;
            min-width: 0;
        }

        .stats-label {
            font-size: 0.875rem;
            color: #6b7280;
            margin-bottom: 0.25rem;
            font-weight: 500;
        }

        .stats-value {
            font-size: 2rem;
            font-weight: 800;
            color: #1f2937;
            line-height: 1.2;
            margin-bottom: 0.25rem;
        }

        .stats-change {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.875rem;
            font-weight: 600;
        }

        .stats-change.positive {
            color: #10b981;
        }

        .stats-change.negative {
            color: #ef4444;
        }

        .stats-change mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
        }

        .change-label {
            color: #6b7280;
            font-weight: 400;
            margin-left: 0.25rem;
        }
    `]
})
export class StatsCardComponent {
    @Input() icon: string = 'analytics';
    @Input() iconColor: string = '#10b981';
    @Input() iconBackground: string = 'linear-gradient(135deg, #d1fae5, #a7f3d0)';
    @Input() label: string = 'Statistique';
    @Input() value: number = 0;
    @Input() change?: number;
    @Input() changeLabel?: string = 'vs mois dernier';
    @Input() clickable: boolean = false;
}
