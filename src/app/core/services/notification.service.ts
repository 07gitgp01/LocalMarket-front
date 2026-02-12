import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(
        private snackBar: MatSnackBar,
        private toastr: ToastrService
    ) { }

    success(message: string, title: string = 'Succès') {
        this.toastr.success(message, title, {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
            positionClass: 'toast-top-right'
        });
    }

    error(message: string, title: string = 'Erreur') {
        this.toastr.error(message, title, {
            timeOut: 5000,
            progressBar: true,
            closeButton: true,
            positionClass: 'toast-top-right'
        });
    }

    warning(message: string, title: string = 'Attention') {
        this.toastr.warning(message, title, {
            timeOut: 4000,
            progressBar: true,
            closeButton: true,
            positionClass: 'toast-top-right'
        });
    }

    info(message: string, title: string = 'Information') {
        this.toastr.info(message, title, {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
            positionClass: 'toast-top-right'
        });
    }

    /**
     * Simule l'envoi d'un SMS
     */
    sendSms(phoneNumber: string, message: string): void {
        console.log(`📱 SMS envoyé au ${phoneNumber}: ${message}`);
        this.info(`SMS envoyé au ${phoneNumber}`, 'Simulation SMS');
    }

    /**
     * Affiche une simple notification Material (SnackBar)
     */
    showSnackBar(message: string, action: string = 'Fermer', duration: number = 3000) {
        this.snackBar.open(message, action, {
            duration: duration,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
        });
    }
}
