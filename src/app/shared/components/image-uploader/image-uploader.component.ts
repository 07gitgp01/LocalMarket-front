import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-image-uploader',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule],
    template: `
    <div class="space-y-4">
      
      <!-- Drop Zone -->
      <div 
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        (click)="fileInput.click()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        [class.bg-blue-50]="isDragging"
        [class.border-blue-400]="isDragging">
        
        <input #fileInput type="file" multiple accept="image/*" class="hidden" (change)="onFileSelected($event)">
        
        <mat-icon class="text-4xl text-gray-400 mb-2 w-12 h-12">cloud_upload</mat-icon>
        <div class="text-gray-600 font-medium">Cliquez ou glissez des images ici</div>
        <div class="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 5MB</div>
      </div>

      <!-- Preview Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4" *ngIf="images.length > 0">
        <div *ngFor="let img of images; let i = index" class="relative group rounded-lg overflow-hidden border aspect-square bg-gray-100">
           <img [src]="img.preview" class="w-full h-full object-cover">
           
           <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button mat-icon-button color="warn" class="bg-white" (click)="removeImage(i)">
               <mat-icon>delete</mat-icon>
             </button>
           </div>

           <mat-progress-bar *ngIf="img.uploading" mode="indeterminate" class="absolute bottom-0"></mat-progress-bar>
        </div>
      </div>

    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class ImageUploaderComponent {
    @Input() maxFiles = 5;
    @Output() imagesChange = new EventEmitter<string[]>(); // Emits list of URLs/base64

    images: { file: File, preview: string, uploading: boolean }[] = [];
    isDragging = false;

    onFileSelected(event: any) {
        const files = event.target.files;
        this.processFiles(files);
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        this.isDragging = false;
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        this.isDragging = false;
        if (event.dataTransfer?.files) {
            this.processFiles(event.dataTransfer.files);
        }
    }

    processFiles(fileList: FileList) {
        if (this.images.length + fileList.length > this.maxFiles) {
            alert(`Maximum ${this.maxFiles} images autorisées.`);
            return;
        }

        Array.from(fileList).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.images.push({
                        file,
                        preview: e.target.result,
                        uploading: false // Mock upload not started automatically here usually
                    });
                    this.emitImages();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    removeImage(index: number) {
        this.images.splice(index, 1);
        this.emitImages();
    }

    emitImages() {
        this.imagesChange.emit(this.images.map(img => img.preview));
    }
}
