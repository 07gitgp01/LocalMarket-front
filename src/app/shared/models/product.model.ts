import { Category } from './category.model';
import { Review } from './review.model';

/**
 * Unité de mesure pour les produits
 */
export type ProductUnit = 'kg' | 'g' | 'l' | 'ml' | 'pièce' | 'carton' | 'sac' | 'm';

/**
 * Interface représentant un produit
 */
export interface Product {
    id: number;
    vendorId: number;
    name: string;
    slug: string;
    description: string;
    category: string; // Nom de la catégorie principale
    subCategory?: string;
    price: number;
    compareAtPrice?: number | null; // Prix barré
    unit: ProductUnit;
    images: string[];
    stock: number;
    minOrder: number;
    maxOrder?: number;
    rating: number;
    reviewCount: number;
    featured: boolean;
    tags: string[];
    attributes?: Record<string, string>; // Ex: { origin: 'Koudougou', color: 'Red' }
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;

    // Relations optionnelles
    vendor?: Vendor; // Définition ci-dessous
}

/**
 * Interface représentant un vendeur
 */
export interface Vendor {
    id: number;
    userId: number;
    shopName: string;
    description: string;
    logo: string;
    banner: string;
    category: string;
    rating: number;
    reviewCount: number;
    productCount: number;
    verified: boolean;
    regionId: number;
    location: {
        street: string;
        city: string;
        region: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
    contact: {
        phone: string;
        email: string;
        whatsapp?: string;
    };
    businessHours: {
        [key: string]: string; // monday: "08:00-18:00"
    };
    createdAt: string;
    
    // Propriétés additionnelles pour l'admin
    status?: 'active' | 'pending' | 'suspended' | 'rejected';
    email?: string;
    phone?: string;
    totalRevenue?: number;
    approvedAt?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    suspendedAt?: string;
    suspensionReason?: string;
    updatedAt?: string;
}

/**
 * Filtres de recherche produits
 */
export interface ProductFilters {
    search?: string;
    category?: string;
    subCategory?: string;
    minPrice?: number;
    maxPrice?: number;
    vendorId?: number;
    featured?: boolean;
    rating?: number;
    inStock?: boolean;
    regionId?: number;
    tags?: string[];
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popularity';
    page?: number;
    limit?: number;
}

/**
 * Requête de création de produit
 */
export interface CreateProductRequest {
    name: string;
    description: string;
    category: string;
    subCategory?: string;
    price: number;
    unit: ProductUnit;
    stock: number;
    images: string[];
    tags?: string[];
    attributes?: Record<string, string>;
}
