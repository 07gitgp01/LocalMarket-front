import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Vendor } from '@shared/models/product.model';

@Injectable({
    providedIn: 'root'
})
export class VendorService {

    constructor(private api: ApiService) { }

    getVendors(): Observable<Vendor[]> {
        return this.api.get<Vendor[]>('/vendors');
    }

    getVendor(id: number): Observable<Vendor> {
        return this.api.get<Vendor>(`/vendors/${id}`);
    }

    createVendor(vendor: Omit<Vendor, 'id'>): Observable<Vendor> {
        return this.api.post<Vendor>('/vendors', vendor);
    }

    updateVendor(id: number, vendor: Partial<Vendor>): Observable<Vendor> {
        return this.api.patch<Vendor>(`/vendors/${id}`, vendor);
    }

    // Obtenir les produits d'un vendeur
    getVendorProducts(vendorId: number): Observable<any[]> {
        return this.api.get<any[]>(`/products?vendorId=${vendorId}`);
    }

    // Obtenir les statistiques d'un vendeur
    getVendorStats(vendorId: number): Observable<any> {
        // Calculé côté client pour json-server, normalement côté serveur
        return this.api.get<any>('/stats'); // Mock pour l'instant
    }
}
