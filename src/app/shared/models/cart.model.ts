import { Product } from './product.model';

/**
 * Article du panier
 */
export interface CartItem {
    id: number;
    userId?: number; // Pour panier persistant en base
    productId: number;
    quantity: number;
    addedAt: string;

    // Produit hydraté pour l'affichage
    product?: Product;
}

/**
 * Structure complète du panier (souvent géré comme tableau d'items, mais parfois objet avec total)
 */
export interface Cart {
    id?: number;
    userId?: number;
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
    updatedAt: string;
}

/**
 * Requête d'ajout au panier
 */
export interface AddToCartRequest {
    productId: number;
    quantity: number;
}

/**
 * Requête de mise à jour de quantité
 */
export interface UpdateCartItemRequest {
    quantity: number;
}
