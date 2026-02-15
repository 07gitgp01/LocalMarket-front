/**
 * Rôles disponibles pour les utilisateurs
 */
export enum UserRole {
    ADMIN = 'admin',
    VENDOR = 'vendor',
    CUSTOMER = 'customer'
}

/**
 * Statuts possibles pour un compte utilisateur
 */
export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    PENDING = 'pending'
}

/**
 * Structure d'une adresse physique
 */
export interface Address {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country?: string;
    fullName?: string;
    phone?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

/**
 * Interface principale représentant un utilisateur
 */
export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone: string;
    address: Address;
    avatar?: string;
    status: UserStatus;
    vendorId?: number; // Lien vers le profil vendeur si applicable
    createdAt: string;
    updatedAt?: string;
    lastLogin?: string;
}

/**
 * Requête de connexion
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Requête d'inscription
 */
export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    address?: Partial<Address>;
    role?: UserRole;
}

/**
 * Requête de mise à jour de profil
 */
export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: Address;
    avatar?: string;
    currentPassword?: string;
    newPassword?: string;
}

/**
 * Réponse d'authentification
 */
export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
}
