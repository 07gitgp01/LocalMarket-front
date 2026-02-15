import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: 'primary' | 'accent' | 'warn';
    icon?: string;
    iconColor?: string;
}

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
        <div class="confirm-dialog">
            <div class="dialog-icon" *ngIf="data.icon" [style.color]="data.iconColor || '#ef4444'">
                <mat-icon>{{ data.icon }}</mat-icon>
            </div>
            <h2 mat-dialog-title class="dialog-title">{{ data.title }}</h2>
            <mat-dialog-content class="dialog-content">
                <p>{{ data.message }}</p>
            </mat-dialog-content>
            <mat-dialog-actions class="dialog-actions">
                <button mat-stroked-button (click)="onCancel()">
                    {{ data.cancelText || 'Annuler' }}
                </button>
                <button 
                    mat-flat-button 
                    [color]="data.confirmColor || 'warn'"
                    (click)="onConfirm()"
                    cdkFocusInitial>
                    {{ data.confirmText || 'Confirmer' }}
                </button>
            </mat-dialog-actions>
        </div>
    `,
    styles: [`
        .confirm-dialog {
            padding: 1rem;
        }

        .dialog-icon {
            text-align: center;
            margin-bottom: 1rem;
        }

        .dialog-icon mat-icon {
            font-size: 48px;
            width: 48px;
            height: 48px;
        }

        .dialog-title {
            text-align: center;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 0 1rem 0;
        }

        .dialog-content {
            text-align: center;
            color: #6b7280;
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }

        .dialog-content p {
            margin: 0;
        }

        .dialog-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            padding: 0 !important;
        }

        .dialog-actions button {
            min-width: 120px;
            height: 44px !important;
            font-weight: 600 !important;
        }
    `]
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) {}

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
