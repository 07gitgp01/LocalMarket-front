/**
 * Structure standard d'une réponse API réussie
 */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    meta?: {
        timestamp: string;
        version: string;
    };
}

/**
 * Structure standard d'une réponse API paginée
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

/**
 * Structure standard d'une erreur API
 */
export interface ApiError {
    success: false;
    statusCode: number;
    message: string;
    errors?: Record<string, string[]>; // Validation errors
    stack?: string; // Only in dev
}
