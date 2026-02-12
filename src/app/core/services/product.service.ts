import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Product, ProductFilters } from '@shared/models/product.model';
import { Category } from '@shared/models/category.model';
import { Review } from '@shared/models/review.model';
import { PaginatedResponse } from '@shared/models/common.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private api: ApiService) { }

    getProducts(filters: ProductFilters = {}): Observable<Product[]> {
        let params = new HttpParams();

        // Map filters to params
        if (filters.search) params = params.set('q', filters.search);
        if (filters.category) params = params.set('category', filters.category);
        if (filters.minPrice) params = params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice);
        if (filters.vendorId) params = params.set('vendorId', filters.vendorId);
        if (filters.featured) params = params.set('featured', filters.featured);

        // Si on veut utiliser le endpoint de recherche dédié du backend
        if (Object.keys(filters).length > 0) {
            return this.api.get<Product[]>('/products/search', params);
        }

        return this.api.get<Product[]>('/products');
    }

    getProduct(id: number | string): Observable<Product> {
        return this.api.get<Product>(`/products/${id}`);
    }

    createProduct(product: Omit<Product, 'id'>): Observable<Product> {
        return this.api.post<Product>('/products', product);
    }

    updateProduct(id: number, product: Partial<Product>): Observable<Product> {
        return this.api.patch<Product>(`/products/${id}`, product);
    }

    deleteProduct(id: number): Observable<void> {
        return this.api.delete<void>(`/products/${id}`);
    }

    getCategories(): Observable<Category[]> {
        return this.api.get<Category[]>('/categories');
    }

    getProductReviews(productId: number): Observable<Review[]> {
        return this.api.get<Review[]>(`/reviews?productId=${productId}`);
    }

    addProductReview(review: Omit<Review, 'id'>): Observable<Review> {
        return this.api.post<Review>('/reviews', review);
    }
}
