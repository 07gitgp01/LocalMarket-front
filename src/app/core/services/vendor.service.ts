import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Vendor } from '@shared/models/product.model';
import { Product } from '@shared/models/product.model';
import { Order } from '@shared/models/order.model';

@Injectable({
    providedIn: 'root'
})
export class VendorService {

    constructor(private api: ApiService) { }

    getVendors(filters?: {
        status?: string;
        region?: string;
        search?: string;
        sortBy?: string;
    }): Observable<Vendor[]> {
        let url = '/vendors';
        const params: string[] = [];
        
        if (filters?.status) params.push(`status=${filters.status}`);
        if (filters?.region) params.push(`location.region=${filters.region}`);
        if (filters?.search) params.push(`q=${filters.search}`);
        
        if (params.length > 0) {
            url += '?' + params.join('&');
        }
        
        return this.api.get<Vendor[]>(url).pipe(
            map(vendors => {
                if (filters?.sortBy === 'name') {
                    return vendors.sort((a, b) => a.shopName.localeCompare(b.shopName));
                }
                if (filters?.sortBy === 'date') {
                    return vendors.sort((a, b) => 
                        new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
                    );
                }
                return vendors;
            })
        );
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
    getVendorProducts(vendorId: number): Observable<Product[]> {
        return this.api.get<Product[]>(`/products?vendorId=${vendorId}`);
    }

    // Obtenir les commandes d'un vendeur
    getVendorOrders(vendorId: number): Observable<Order[]> {
        return this.api.get<Order[]>(`/orders?vendorId=${vendorId}`);
    }

    // Obtenir les statistiques d'un vendeur
    getVendorStats(vendorId: number): Observable<any> {
        return this.api.get<any>(`/vendors/${vendorId}/stats`);
    }

    // Approuver un vendeur
    approveVendor(vendorId: number): Observable<Vendor> {
        return this.api.patch<Vendor>(`/vendors/${vendorId}`, { 
            status: 'active',
            approvedAt: new Date().toISOString()
        });
    }

    // Rejeter un vendeur
    rejectVendor(vendorId: number, reason: string): Observable<Vendor> {
        return this.api.patch<Vendor>(`/vendors/${vendorId}`, { 
            status: 'rejected',
            rejectionReason: reason,
            rejectedAt: new Date().toISOString()
        });
    }

    // Suspendre un vendeur
    suspendVendor(vendorId: number, reason?: string): Observable<Vendor> {
        return this.api.patch<Vendor>(`/vendors/${vendorId}`, { 
            status: 'suspended',
            suspensionReason: reason,
            suspendedAt: new Date().toISOString()
        });
    }

    // Activer un vendeur
    activateVendor(vendorId: number): Observable<Vendor> {
        return this.api.patch<Vendor>(`/vendors/${vendorId}`, { 
            status: 'active'
        });
    }

    // Supprimer un vendeur
    deleteVendor(vendorId: number): Observable<void> {
        return this.api.delete<void>(`/vendors/${vendorId}`);
    }

    // Obtenir les vendeurs en attente d'approbation
    getPendingVendors(): Observable<Vendor[]> {
        return this.api.get<Vendor[]>('/vendors?status=pending');
    }

    // Obtenir le nombre de vendeurs par statut
    getVendorCountByStatus(): Observable<{ [key: string]: number }> {
        return this.api.get<Vendor[]>('/vendors').pipe(
            map(vendors => {
                return vendors.reduce((acc, vendor) => {
                    const status = vendor.status || 'active';
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                }, {} as { [key: string]: number });
            })
        );
    }
}
