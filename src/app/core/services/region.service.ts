import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';

export interface Region {
    id: number;
    name: string;
    code: string;
    capital: string;
    provinces?: string[];
    coordinates?: { lat: number; lng: number };
    deliveryZone?: string[];
    deliveryFee?: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface RegionStats {
    vendorCount: number;
    productCount: number;
    orderCount: number;
    revenue: number;
    topVendors: any[];
    topCategories: any[];
}

@Injectable({
    providedIn: 'root'
})
export class RegionService {
    constructor(private api: ApiService) {}

    getRegions(): Observable<Region[]> {
        return this.api.get<Region[]>('/regions');
    }

    getRegionById(id: number): Observable<Region> {
        return this.api.get<Region>(`/regions/${id}`);
    }

    createRegion(region: Omit<Region, 'id'>): Observable<Region> {
        return this.api.post<Region>('/regions', {
            ...region,
            createdAt: new Date().toISOString()
        });
    }

    updateRegion(id: number, region: Partial<Region>): Observable<Region> {
        return this.api.patch<Region>(`/regions/${id}`, {
            ...region,
            updatedAt: new Date().toISOString()
        });
    }

    deleteRegion(id: number): Observable<void> {
        return this.api.delete<void>(`/regions/${id}`);
    }

    getRegionStats(id: number): Observable<RegionStats> {
        // Pour json-server, on calcule côté client
        // En production, ce serait une vraie API
        return this.api.get<any>(`/regions/${id}/stats`);
    }

    getRegionVendors(regionId: number): Observable<any[]> {
        return this.api.get<any[]>(`/vendors?location.region=${regionId}`);
    }

    getRegionProducts(regionId: number): Observable<any[]> {
        return this.api.get<any[]>(`/products?region=${regionId}`);
    }

    getActiveRegions(): Observable<Region[]> {
        return this.api.get<Region[]>('/regions?isActive=true');
    }

    toggleRegionStatus(id: number, isActive: boolean): Observable<Region> {
        return this.api.patch<Region>(`/regions/${id}`, { 
            isActive,
            updatedAt: new Date().toISOString()
        });
    }

    // Obtenir les statistiques globales des régions
    getRegionsOverview(): Observable<any> {
        return this.api.get<Region[]>('/regions').pipe(
            map(regions => ({
                total: regions.length,
                active: regions.filter(r => r.isActive).length,
                inactive: regions.filter(r => !r.isActive).length
            }))
        );
    }
}
