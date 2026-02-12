import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-rating-stars',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    template: `
    <div class="flex items-center" [class.cursor-pointer]="!readonly">
      <ng-container *ngFor="let star of stars; let i = index">
        <mat-icon 
          class="text-yellow-400 transition-colors" 
          [class.hover:text-yellow-500]="!readonly"
          [style.font-size.px]="size"
          [style.width.px]="size"
          [style.height.px]="size"
          (click)="rate(i + 1)"
          (mouseenter)="onHover(i + 1)"
          (mouseleave)="onLeave()">
          {{ getIcon(i + 1) }}
        </mat-icon>
      </ng-container>
      <span *ngIf="showCount" class="text-xs text-gray-400 ml-1">({{ count }})</span>
    </div>
  `
})
export class RatingStarsComponent {
    @Input() rating = 0;
    @Input() count = 0;
    @Input() readonly = true;
    @Input() showCount = true;
    @Input() size = 18;

    @Output() ratingChange = new EventEmitter<number>();

    hoverRate = 0;
    stars = [1, 2, 3, 4, 5];

    rate(value: number) {
        if (!this.readonly) {
            this.rating = value;
            this.ratingChange.emit(value);
        }
    }

    onHover(value: number) {
        if (!this.readonly) {
            this.hoverRate = value;
        }
    }

    onLeave() {
        if (!this.readonly) {
            this.hoverRate = 0;
        }
    }

    getIcon(index: number): string {
        const current = this.hoverRate > 0 ? this.hoverRate : this.rating;
        if (current >= index) {
            return 'star';
        } else if (current > index - 1 && current < index) {
            return 'star_half';
        } else {
            return 'star_border';
        }
    }
}
