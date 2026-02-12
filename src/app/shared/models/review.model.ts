/**
 * Interface représentant un avis utilisateur sur un produit
 */
export interface Review {
    id: number;
    productId: number;
    userId: number;
    rating: number; // 1-5
    title: string;
    comment: string;
    helpful: number; // Nombre de personnes ayant trouvé l'avis utile
    verified: boolean; // Achat vérifié
    createdAt: string;
    updatedAt?: string;

    // Relations (peuplées si nécessaire)
    user?: {
        firstName: string;
        lastName: string;
        avatar?: string;
    };
}

/**
 * Requête de création d'avis
 */
export interface CreateReviewRequest {
    productId: number;
    rating: number;
    title: string;
    comment: string;
}

/**
 * Filtres pour la liste des avis
 */
export interface ReviewFilters {
    productId?: number;
    rating?: number;
    verified?: boolean;
    sort?: 'date_desc' | 'rating_desc' | 'rating_asc' | 'helpful_desc';
}
