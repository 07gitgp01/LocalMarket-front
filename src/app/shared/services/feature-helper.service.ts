import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FeatureHelperService {

    constructor() { }

    /**
     * Mock PDF Generation
     */
    exportToPdf(elementId: string, filename: string = 'document.pdf') {
        console.log(`Exporting ${elementId} to PDF as ${filename}...`);
        // In real app: use jspdf and html2canvas
        alert('Le téléchargement du PDF a commencé (Simulation)');
    }

    /**
     * Web Share API Wrapper
     */
    share(data: { title: string, text: string, url: string }) {
        if (navigator.share) {
            navigator.share(data)
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        } else {
            console.log('Web Share API not supported');
            // Fallback: Copy to clipboard
            this.copyToClipboard(data.url);
            alert('Lien copié dans le presse-papier !');
        }
    }

    copyToClipboard(text: string) {
        navigator.clipboard.writeText(text).then(
            () => console.log('Copied to clipboard'),
            () => console.error('Failed to copy')
        );
    }

    /**
     * Mock QR Code URL generation
     */
    getQrCodeUrl(data: string, size: number = 150): string {
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
    }
}
