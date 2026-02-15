import { Injectable } from '@angular/core';
import { Observable, map, forkJoin, of } from 'rxjs';
import { ApiService } from './api.service';

export interface GlobalStats {
    totalProducts: number;
    totalOrders: number;
    totalVendors: number;
    totalUsers: number;
    totalRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
    activeProducts: number;
    featuredProducts: number;
}

export interface VendorStats {
    vendorId: number;
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
    topProducts: Array<{
        productId: number;
        name: string;
        sales: number;
        revenue: number;
    }>;
    recentOrders: any[];
    salesByMonth: Array<{
        month: string;
        sales: number;
        revenue: number;
    }>;
}

export interface AdminStats extends GlobalStats {
    newUsersThisMonth: number;
    newOrdersThisMonth: number;
    revenueThisMonth: number;
    topVendors: Array<{
        vendorId: number;
        shopName: string;
        revenue: number;
        orders: number;
    }>;
    topProducts: Array<{
        productId: number;
        name: string;
        sales: number;
        revenue: number;
    }>;
    ordersByStatus: {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
    revenueByMonth: Array<{
        month: string;
        revenue: number;
    }>;
}

@Injectable({
    providedIn: 'root'
})
export class StatisticsService {

    constructor(private api: ApiService) { }

    getGlobalStats(): Observable<GlobalStats> {
        return this.api.get<GlobalStats>('/stats');
    }

    getVendorStats(vendorId: number): Observable<VendorStats> {
        return forkJoin({
            products: this.api.get<any[]>(`/products?vendorId=${vendorId}`),
            orders: this.api.get<any[]>(`/orders`),
            vendor: this.api.get<any>(`/vendors/${vendorId}`)
        }).pipe(
            map(({ products, orders, vendor }) => {
                const vendorOrders = orders.filter(order => 
                    order.items.some((item: any) => item.vendorId === vendorId)
                );

                const totalRevenue = vendorOrders.reduce((sum, order) => {
                    const vendorItems = order.items.filter((item: any) => item.vendorId === vendorId);
                    return sum + vendorItems.reduce((itemSum: number, item: any) => itemSum + item.total, 0);
                }, 0);

                const pendingOrders = vendorOrders.filter(o => 
                    o.status === 'pending' || o.status === 'processing'
                ).length;

                const completedOrders = vendorOrders.filter(o => 
                    o.status === 'delivered'
                ).length;

                const productSales = new Map<number, { name: string; sales: number; revenue: number }>();
                vendorOrders.forEach(order => {
                    order.items
                        .filter((item: any) => item.vendorId === vendorId)
                        .forEach((item: any) => {
                            const existing = productSales.get(item.productId) || { 
                                name: item.name, 
                                sales: 0, 
                                revenue: 0 
                            };
                            existing.sales += item.quantity;
                            existing.revenue += item.total;
                            productSales.set(item.productId, existing);
                        });
                });

                const topProducts = Array.from(productSales.entries())
                    .map(([productId, data]) => ({ productId, ...data }))
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5);

                const salesByMonth = this.calculateSalesByMonth(vendorOrders, vendorId);

                return {
                    vendorId,
                    totalProducts: products.length,
                    activeProducts: products.filter(p => p.isActive).length,
                    totalOrders: vendorOrders.length,
                    pendingOrders,
                    completedOrders,
                    totalRevenue,
                    averageRating: vendor.rating || 0,
                    totalReviews: vendor.reviewCount || 0,
                    topProducts,
                    recentOrders: vendorOrders.slice(0, 10),
                    salesByMonth
                };
            })
        );
    }

    getAdminStats(): Observable<AdminStats> {
        return forkJoin({
            globalStats: this.api.get<GlobalStats>('/stats'),
            products: this.api.get<any[]>('/products'),
            orders: this.api.get<any[]>('/orders'),
            vendors: this.api.get<any[]>('/vendors'),
            users: this.api.get<any[]>('/users')
        }).pipe(
            map(({ globalStats, products, orders, vendors, users }) => {
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                const newUsersThisMonth = users.filter(u => {
                    const created = new Date(u.createdAt);
                    return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
                }).length;

                const ordersThisMonth = orders.filter(o => {
                    const created = new Date(o.createdAt);
                    return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
                });

                const newOrdersThisMonth = ordersThisMonth.length;
                const revenueThisMonth = ordersThisMonth.reduce((sum, o) => sum + o.total, 0);

                const vendorRevenue = new Map<number, { shopName: string; revenue: number; orders: number }>();
                orders.forEach(order => {
                    order.items.forEach((item: any) => {
                        const vendor = vendors.find(v => v.id === item.vendorId);
                        if (vendor) {
                            const existing = vendorRevenue.get(item.vendorId) || {
                                shopName: vendor.shopName,
                                revenue: 0,
                                orders: 0
                            };
                            existing.revenue += item.total;
                            existing.orders += 1;
                            vendorRevenue.set(item.vendorId, existing);
                        }
                    });
                });

                const topVendors = Array.from(vendorRevenue.entries())
                    .map(([vendorId, data]) => ({ vendorId, ...data }))
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5);

                const productSales = new Map<number, { name: string; sales: number; revenue: number }>();
                orders.forEach(order => {
                    order.items.forEach((item: any) => {
                        const existing = productSales.get(item.productId) || {
                            name: item.name,
                            sales: 0,
                            revenue: 0
                        };
                        existing.sales += item.quantity;
                        existing.revenue += item.total;
                        productSales.set(item.productId, existing);
                    });
                });

                const topProducts = Array.from(productSales.entries())
                    .map(([productId, data]) => ({ productId, ...data }))
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 10);

                const ordersByStatus = {
                    pending: orders.filter(o => o.status === 'pending').length,
                    processing: orders.filter(o => o.status === 'processing').length,
                    shipped: orders.filter(o => o.status === 'shipped').length,
                    delivered: orders.filter(o => o.status === 'delivered').length,
                    cancelled: orders.filter(o => o.status === 'cancelled').length
                };

                const revenueByMonth = this.calculateRevenueByMonth(orders);

                return {
                    ...globalStats,
                    newUsersThisMonth,
                    newOrdersThisMonth,
                    revenueThisMonth,
                    topVendors,
                    topProducts,
                    ordersByStatus,
                    revenueByMonth
                };
            })
        );
    }

    private calculateSalesByMonth(orders: any[], vendorId: number): Array<{ month: string; sales: number; revenue: number }> {
        const monthlyData = new Map<string, { sales: number; revenue: number }>();
        
        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            const vendorItems = order.items.filter((item: any) => item.vendorId === vendorId);
            const orderRevenue = vendorItems.reduce((sum: number, item: any) => sum + item.total, 0);
            const orderSales = vendorItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
            
            const existing = monthlyData.get(monthKey) || { sales: 0, revenue: 0 };
            existing.sales += orderSales;
            existing.revenue += orderRevenue;
            monthlyData.set(monthKey, existing);
        });

        return Array.from(monthlyData.entries())
            .map(([month, data]) => ({ month, ...data }))
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-12);
    }

    private calculateRevenueByMonth(orders: any[]): Array<{ month: string; revenue: number }> {
        const monthlyRevenue = new Map<string, number>();
        
        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            const existing = monthlyRevenue.get(monthKey) || 0;
            monthlyRevenue.set(monthKey, existing + order.total);
        });

        return Array.from(monthlyRevenue.entries())
            .map(([month, revenue]) => ({ month, revenue }))
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-12);
    }

    getRevenueGrowth(vendorId?: number): Observable<number> {
        const ordersObservable = vendorId 
            ? this.api.get<any[]>(`/orders`).pipe(
                map(orders => orders.filter(o => 
                    o.items.some((item: any) => item.vendorId === vendorId)
                ))
            )
            : this.api.get<any[]>('/orders');

        return ordersObservable.pipe(
            map(orders => {
                const now = new Date();
                const currentMonth = now.getMonth();
                const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                
                const currentMonthRevenue = orders
                    .filter(o => new Date(o.createdAt).getMonth() === currentMonth)
                    .reduce((sum, o) => sum + o.total, 0);
                
                const lastMonthRevenue = orders
                    .filter(o => new Date(o.createdAt).getMonth() === lastMonth)
                    .reduce((sum, o) => sum + o.total, 0);
                
                if (lastMonthRevenue === 0) return 0;
                return ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
            })
        );
    }
}
