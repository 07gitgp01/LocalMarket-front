import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class MonitoringService {

    constructor() { }

    logError(error: any) {
        const errorData = {
            message: error.message || error.toString(),
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        // Log to console in dev
        if (!environment.production) {
            console.group('🚨 Error Monitor');
            console.error(error);
            console.table(errorData);
            console.groupEnd();
        } else {
            // Send to Sentry/LogRocket in production
            // Sentry.captureException(error);
            console.log('Sending error to remote monitoring service...', errorData);
        }
    }

    logEvent(eventName: string, data?: any) {
        if (!environment.production) {
            console.log(`📊 [Analytics] ${eventName}`, data);
        }
        // Analytics.track(eventName, data);
    }
}

// Global Error Handler Provider
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private monitoringService: MonitoringService) { }

    handleError(error: any) {
        this.monitoringService.logError(error);
        // Rethrow if needed, or suppress
    }
}
