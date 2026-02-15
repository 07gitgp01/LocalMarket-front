import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { Product } from '@shared/models/product.model';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

export interface WishlistItem {
    id: number;
    userId: number;
    productId: number;
    addedAt: string;
    product?: Product;
}

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private wishlistItemsSignal = signal<WishlistItem[]>([]);

    readonly wishlistItems = this.wishlistItemsSignal.asReadonly();
    
    readonly itemCount = computed(() => this.wishlistItemsSignal().length);
    
    readonly productIds = computed(() => 
        this.wishlistItemsSignal().map(item => item.productId)
    );

    constructor(
        private api: ApiService,
        private notification: NotificationService,
        private auth: AuthService
    ) {
        this.loadWishlist();
    }

    loadWishlist(): void {
        if (this.auth.isAuthenticated()) {
            const userId = this.auth.currentUser()?.id;
            if (userId) {
                this.api.get<WishlistItem[]>(`/wishlist?userId=${userId}`).subscribe({
                    next: (items) => this.wishlistItemsSignal.set(items),
                    error: () => this.loadFromLocalStorage()
                });
            }
        } else {
            this.loadFromLocalStorage();
        }
    }

    private loadFromLocalStorage(): void {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('guest_wishlist');
            if (saved) {
                try {
                    this.wishlistItemsSignal.set(JSON.parse(saved));
                } catch (e) {
                    console.error('Error loading wishlist from localStorage', e);
                }
            }
        }
    }

    addToWishlist(product: Product): void {
        const currentItems = this.wishlistItemsSignal();
        const exists = currentItems.find(item => item.productId === product.id);

        if (exists) {
            this.notification.info('Ce produit est déjà dans votre liste de souhaits');
            return;
        }

        const newItem: WishlistItem = {
            id: Date.now(),
            userId: this.auth.currentUser()?.id || 0,
            productId: product.id,
            addedAt: new Date().toISOString(),
            product: product
        };

        if (this.auth.isAuthenticated()) {
            this.api.post<WishlistItem>('/wishlist', newItem).subscribe({
                next: (addedItem) => {
                    this.wishlistItemsSignal.update(items => [...items, { ...newItem, id: addedItem.id }]);
                    this.notification.success('Ajouté à votre liste de souhaits');
                },
                error: () => {
                    this.notification.error('Erreur lors de l\'ajout');
                }
            });
        } else {
            this.wishlistItemsSignal.update(items => [...items, newItem]);
            this.saveToLocalStorage();
            this.notification.success('Ajouté à votre liste de souhaits');
        }
    }

    removeFromWishlist(productId: number): void {
        const item = this.wishlistItemsSignal().find(i => i.productId === productId);
        if (!item) return;

        if (this.auth.isAuthenticated()) {
            this.api.delete(`/wishlist/${item.id}`).subscribe({
                next: () => {
                    this.wishlistItemsSignal.update(items => items.filter(i => i.productId !== productId));
                    this.notification.info('Retiré de votre liste de souhaits');
                },
                error: () => {
                    this.notification.error('Erreur lors de la suppression');
                }
            });
        } else {
            this.wishlistItemsSignal.update(items => items.filter(i => i.productId !== productId));
            this.saveToLocalStorage();
            this.notification.info('Retiré de votre liste de souhaits');
        }
    }

    toggleWishlist(product: Product): void {
        const exists = this.isInWishlist(product.id);
        if (exists) {
            this.removeFromWishlist(product.id);
        } else {
            this.addToWishlist(product);
        }
    }

    isInWishlist(productId: number): boolean {
        return this.productIds().includes(productId);
    }

    clearWishlist(): void {
        if (this.auth.isAuthenticated()) {
            const items = this.wishlistItemsSignal();
            items.forEach(item => this.api.delete(`/wishlist/${item.id}`).subscribe());
        }

        this.wishlistItemsSignal.set([]);
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('guest_wishlist');
        }
    }

    private saveToLocalStorage(): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('guest_wishlist', JSON.stringify(this.wishlistItemsSignal()));
        }
    }

    syncWithServer(): void {
        if (!this.auth.isAuthenticated()) return;

        const localItems = this.wishlistItemsSignal();
        if (localItems.length === 0) return;

        localItems.forEach(item => {
            this.api.post<WishlistItem>('/wishlist', item).subscribe({
                next: () => console.log('Wishlist item synced'),
                error: () => console.error('Failed to sync wishlist item')
            });
        });

        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('guest_wishlist');
        }
    }
}
