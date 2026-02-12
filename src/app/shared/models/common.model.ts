// Common response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ErrorResponse {
    error: string;
    message: string;
    statusCode: number;
    timestamp: string;
}

// Pagination
export interface PaginationParams {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Statistics
export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalVendors: number;
    totalUsers: number;
    totalRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
}

// Common UI types
export interface MenuItem {
    label: string;
    icon?: string;
    route?: string;
    command?: () => void;
    items?: MenuItem[];
    badge?: string | number;
    visible?: boolean;
}

export interface Breadcrumb {
    label: string;
    route?: string;
    icon?: string;
}

export interface ToastMessage {
    severity: 'success' | 'info' | 'warn' | 'error';
    summary: string;
    detail?: string;
    life?: number;
}

// File Upload
export interface UploadedFile {
    name: string;
    size: number;
    type: string;
    url: string;
    uploadedAt: string;
}

// Search
export interface SearchSuggestion {
    text: string;
    type: 'product' | 'category' | 'vendor';
    count?: number;
}
