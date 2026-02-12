import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * GET request
     * @param path API endpoint path
     * @param params Query parameters
     */
    get<T>(path: string, params: HttpParams | { [key: string]: any } = {}): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}${path}`, { params });
    }

    /**
     * POST request
     * @param path API endpoint path
     * @param body Request body
     */
    post<T>(path: string, body: any = {}): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}${path}`, body);
    }

    /**
     * PUT request
     * @param path API endpoint path
     * @param body Request body
     */
    put<T>(path: string, body: any = {}): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}${path}`, body);
    }

    /**
     * PATCH request
     * @param path API endpoint path
     * @param body Request body
     */
    patch<T>(path: string, body: any = {}): Observable<T> {
        return this.http.patch<T>(`${this.apiUrl}${path}`, body);
    }

    /**
     * DELETE request
     * @param path API endpoint path
     */
    delete<T>(path: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}${path}`);
    }
}
