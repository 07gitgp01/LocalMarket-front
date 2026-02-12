/**
 * Interface représentant une catégorie de produits
 */
export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    image: string;
    productCount: number;
    order: number;
    isActive: boolean;
    parentId?: number; // Pour les sous-catégories
    children?: Category[];
}

/**
 * Requête de création de catégorie
 */
export interface CreateCategoryRequest {
    name: string;
    description?: string;
    icon?: string;
    image?: string;
    parentId?: number;
}

/**
 * Requête de mise à jour de catégorie
 */
export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
    isActive?: boolean;
    order?: number;
}
