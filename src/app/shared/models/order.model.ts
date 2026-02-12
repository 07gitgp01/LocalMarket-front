import { Address } from './user.model';
import { Product } from './product.model';

/**
 * Statuts de commande
 */
export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded'
}

/**
 * Méthodes de paiement
 */
export enum PaymentMethod {
    ORANGE_MONEY = 'orange_money',
    WAVE = 'wave',
    CASH_ON_DELIVERY = 'cash_on_delivery',
    CARD = 'card'
}

/**
 * Statuts de paiement
 */
export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

/**
 * Article de commande (instantané au moment de l'achat)
 */
export interface OrderItem {
    productId: number;
    name: string;
    quantity: number;
    price: number; // Prix unitaire au moment de l'achat
    total: number;
    vendorId: number;
    image?: string;
    // Optionnel: lien vers le produit actuel
    product?: Product;
}

/**
 * Interface représentant une commande
 */
export interface Order {
    id: number;
    userId: number;
    orderNumber: string; // Ex: ORD-2024-001
    status: OrderStatus;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;

    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    transactionId?: string;

    shippingAddress: Address;
    billingAddress?: Address; // Si différent

    notes?: string;
    estimatedDeliveryDate?: string;
    deliveryDate?: string;

    createdAt: string;
    updatedAt?: string;
}

/**
 * Données nécessaires au checkout
 */
export interface CheckoutData {
    items: Array<{ productId: number, quantity: number }>;
    shippingAddress: Address;
    paymentMethod: PaymentMethod;
    notes?: string;
}
