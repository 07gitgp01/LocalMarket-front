import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() { }

    setItem(key: string, value: any): void {
        if (this.isBrowser()) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    getItem<T>(key: string): T | null {
        if (this.isBrowser()) {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        return null;
    }

    removeItem(key: string): void {
        if (this.isBrowser()) {
            localStorage.removeItem(key);
        }
    }

    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }
}
