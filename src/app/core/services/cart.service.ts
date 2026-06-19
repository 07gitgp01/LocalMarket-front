import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Product } from '@shared/models/product.model';
import { CartItem } from '@shared/models/cart.model';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItemsSignal = signal<CartItem[]>([]);

    readonly cartItems = this.cartItemsSignal.asReadonly();

    readonly itemCount = computed(() =>
        this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0)
    );

    readonly totalAmount = computed(() =>
        this.cartItemsSignal().reduce((acc, item) => {
            const price = item.product?.price || 0;
            return acc + (price * item.quantity);
        }, 0)
    );

    constructor(
        private api: ApiService,
        private notification: NotificationService,
        private auth: AuthService
    ) {
        this.loadCart();
    }

    loadCart(): void {
        // Si l'utilisateur est connecté, on charge depuis l'API
        // Sinon on charge depuis localStorage
        if (this.auth.isAuthenticated()) {
            // Mock: on utilise l'endpoint json-server qui renvoie tout, 
            // on filtre en mémoire pour l'instant car l'API mock est simple
            this.api.get<CartItem[]>('/cart').subscribe({
                next: (items) => {
                    // Enrichir avec les produits si nécessaire, ici supposons que l'API renvoie les détails ou que nous devons les fetch
                    // Pour simplicité, chargeons le panier tel quel.
                    // Idéalement backend should expand product data
                    this.cartItemsSignal.set(items);
                },
                error: () => console.error('Erreur chargement panier')
            });
        } else {
            const savedCart = typeof localStorage !== 'undefined' ? localStorage.getItem('guest_cart') : null;
            if (savedCart) {
                this.cartItemsSignal.set(JSON.parse(savedCart));
            }
        }
    }

    addToCart(product: Product, quantity: number = 1): void {
        const currentItems = this.cartItemsSignal();
        const existingItem = currentItems.find(item => item.productId === product.id);

        if (existingItem) {
            // Update quantity locally; server sync handled in updateQuantity
            this.updateQuantity(existingItem.id, existingItem.quantity + quantity);
        } else {
            const tempId = Date.now();
            const newItem: CartItem = {
                id: tempId,
                userId: this.auth.currentUser()?.id || 0,
                productId: product.id,
                quantity,
                addedAt: new Date().toISOString(),
                product: product
            };

            // Optimistic: add immediately with temp ID
            this.cartItemsSignal.update(items => [...items, newItem]);
            this.notification.success('Produit ajouté au panier');

            if (this.auth.isAuthenticated()) {
                // Replace temp ID with real server ID once POST completes
                this.api.post<CartItem>('/cart', newItem).subscribe({
                    next: (addedItem) => {
                        this.cartItemsSignal.update(items =>
                            items.map(i => i.id === tempId ? { ...i, id: addedItem.id } : i)
                        );
                    },
                    error: () => console.warn('Cart sync: could not persist new item to server')
                });
            } else {
                this.saveGuestCart();
            }
        }
    }

    removeFromCart(itemId: number): void {
        // Optimistic update
        this.cartItemsSignal.update(items => items.filter(i => i.id !== itemId));
        this.notification.info('Produit retiré du panier');

        if (this.auth.isAuthenticated()) {
            this.api.delete(`/cart/${itemId}`).subscribe({
                error: () => console.warn(`Cart sync: could not delete item ${itemId} from server`)
            });
        } else {
            this.saveGuestCart();
        }
    }

    updateQuantity(itemId: number, quantity: number): void {
        if (quantity <= 0) {
            this.removeFromCart(itemId);
            return;
        }

        // Optimistic update — UI responds immediately regardless of server sync
        this.cartItemsSignal.update(items =>
            items.map(item => item.id === itemId ? { ...item, quantity } : item)
        );

        if (this.auth.isAuthenticated()) {
            this.api.patch<CartItem>(`/cart/${itemId}`, { quantity }).subscribe({
                error: () => console.warn(`Cart sync: item ${itemId} not found on server, state kept locally`)
            });
        } else {
            this.saveGuestCart();
        }
    }

    updateQuantityByProductId(productId: number, quantity: number): void {
        const item = this.cartItemsSignal().find(i => i.productId === productId);
        if (item) {
            this.updateQuantity(item.id, quantity);
        }
    }

    clearCart(): void {
        if (this.auth.isAuthenticated()) {
            // Pour json-server, il faut supprimer un par un, en vrai backend en une fois
            const items = this.cartItemsSignal();
            items.forEach(item => this.api.delete(`/cart/${item.id}`).subscribe());
        }

        this.cartItemsSignal.set([]);
        if (typeof localStorage !== 'undefined') localStorage.removeItem('guest_cart');
    }

    private saveGuestCart(): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('guest_cart', JSON.stringify(this.cartItemsSignal()));
        }
    }
}
