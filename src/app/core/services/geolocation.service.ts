import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

export interface Coordinates {
    latitude: number;
    longitude: number;
}

@Injectable({
    providedIn: 'root'
})
export class GeolocationService {

    constructor(private http: HttpClient) { }

    /**
     * Obtient la position actuelle de l'utilisateur via l'API navigateur
     */
    getCurrentPosition(): Observable<Coordinates> {
        return new Observable(observer => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        observer.next({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                        observer.complete();
                    },
                    (error) => {
                        observer.error(error);
                    }
                );
            } else {
                observer.error(new Error('Geolocation not supported'));
            }
        });
    }

    /**
     * Calcule la distance entre deux points (Formule de Haversine)
     * Retourne la distance en km
     */
    calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
        const R = 6371; // Rayon de la terre en km
        const dLat = this.deg2rad(coord2.latitude - coord1.latitude);
        const dLon = this.deg2rad(coord2.longitude - coord1.longitude);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(coord1.latitude)) * Math.cos(this.deg2rad(coord2.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    /**
     * Obtient l'adresse à partir des coordonnées (Reverse Geocoding)
     * Nécessite une clé API Google Maps configurée
     */
    getAddressFromCoordinates(coords: Coordinates): Observable<any> {
        const apiKey = environment.googleMapsApiKey;
        if (!apiKey) {
            console.warn('Google Maps API Key not configured');
            return from([]);
        }
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${apiKey}`;
        return this.http.get(url);
    }
}
