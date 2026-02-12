import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Order, CheckoutData } from '@shared/models/order.model';
import { HttpClient } from '@angular/common/http'; // Pour certains appels si besoin de s'affranchir de l'intercepteur API global pour des services externes

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(private api: ApiService) { }

    getOrders(userId?: number): Observable<Order[]> {
        if (userId) {
            return this.api.get<Order[]>(`/orders?userId=${userId}`);
        }
        return this.api.get<Order[]>('/orders');
    }

    getOrder(id: number): Observable<Order> {
        return this.api.get<Order>(`/orders/${id}`);
    }

    createOrder(order: Omit<Order, 'id'>): Observable<Order> {
        return this.api.post<Order>('/orders', order);
    }

    updateOrderStatus(id: number, status: string): Observable<Order> {
        return this.api.patch<Order>(`/orders/${id}`, { status });
    }

    // Simulation de paiement
    processPayment(orderId: number, paymentMethod: string, amount: number): Observable<any> {
        // Ici on ferait appel à une vraie API de paiement (Orange Money, Wave)
        // Pour la démo, on simule un succès
        const paymentData = {
            orderId,
            paymentMethod,
            amount,
            status: 'pending'
        };

        // Simuler le délai de traitement
        return new Observable(observer => {
            setTimeout(() => {
                observer.next({ success: true, transactionId: 'TXN-' + Date.now() });
                observer.complete();
            }, 2000);
        });
    }
}
