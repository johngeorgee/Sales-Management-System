// core/services/reports.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // =========================
  // DASHBOARD DATA (اللي جاي من الـ Dashboard Service)
  // =========================
  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  // =========================
  // SALES REPORT
  // =========================
  getSalesReport(): Observable<any> {
    // هنستخدم الداتا من الـ dashboard ونحولها لتقرير مبيعات
    return this.getDashboardData().pipe(
      map((response: any) => {
        const data = response.data;
        return {
          totalSales: data.summary.totalSales,
          totalProfit: data.summary.totalProfit,
          totalOrders: data.summary.totalOrders,
          averageOrderValue: data.summary.totalOrders > 0 
            ? data.summary.totalSales / data.summary.totalOrders 
            : 0,
          salesByCategory: this.getSalesByCategory(data),
          salesByMarket: this.getSalesByMarket(data),
          salesTrend: data.salesOverTime || []
        };
      })
    );
  }

  // =========================
  // ORDER REPORT
  // =========================
  getOrderReport(): Observable<any> {
    return this.getDashboardData().pipe(
      map((response: any) => {
        const data = response.data;
        const orderStatus = data.orderStatus || [];
        
        return {
          totalOrders: data.summary.totalOrders,
          completedOrders: this.getOrderCountByStatus(orderStatus, 'COMPLETE'),
          pendingOrders: this.getOrderCountByStatus(orderStatus, 'PENDING_PAYMENT') + 
                         this.getOrderCountByStatus(orderStatus, 'PENDING'),
          processingOrders: this.getOrderCountByStatus(orderStatus, 'PROCESSING'),
          cancelledOrders: this.getOrderCountByStatus(orderStatus, 'CANCELED'),
          ordersByStatus: orderStatus,
          ordersByMonth: this.getOrdersByMonth(data.salesOverTime),
          recentOrders: data.recentOrders || []
        };
      })
    );
  }

  // =========================
  // PRODUCT REPORT
  // =========================
  getProductReport(): Observable<any> {
    return this.getDashboardData().pipe(
      map((response: any) => {
        const data = response.data;
        return {
          totalProducts: data.summary.totalProducts || 0,
          activeProducts: data.summary.totalProducts || 0, // will be refined
          inactiveProducts: 0,
          topSellingProducts: data.topProducts || [],
          lowStockProducts: data.lowStockProducts || [],
          productsByCategory: []
        };
      })
    );
  }

  // =========================
  // CUSTOMER REPORT
  // =========================
  getCustomerReport(): Observable<any> {
    return this.getDashboardData().pipe(
      map((response: any) => {
        const data = response.data;
        return {
          totalCustomers: data.summary.totalCustomers || 0,
          customersBySegment: [],
          topCustomers: [],
          newCustomers: []
        };
      })
    );
  }

  // =========================
  // INVENTORY REPORT
  // =========================
  getInventoryReport(): Observable<any> {
    return this.getDashboardData().pipe(
      map((response: any) => {
        const data = response.data;
        const totalStock = data.inventory?.totalStockUnits || 0;
        const lowStock = data.summary?.lowStockProducts || 0;
        const outOfStock = data.summary?.outOfStockProducts || 0;
        
        return {
          totalStockUnits: totalStock,
          inventoryValue: data.inventory?.inventoryValue || 0,
          stockStatus: [
            { status: 'In Stock', count: totalStock - lowStock - outOfStock },
            { status: 'Low Stock', count: lowStock },
            { status: 'Out of Stock', count: outOfStock }
          ],
          productsByCategory: []
        };
      })
    );
  }

  // =========================
  // HELPER METHODS
  // =========================
  private getOrderCountByStatus(statuses: any[], status: string): number {
    const found = statuses.find(s => s.status === status);
    return found?.count || 0;
  }

  private getSalesByCategory(data: any): any[] {
    // هنحول الـ top products لـ sales by category
    const products = data.topProducts || [];
    const categoryMap = new Map();
    
    products.forEach((p: any) => {
      // بما إن مش معانا category من الـ products، هنستخدم أسماء وهمية
      const categories = ['Electronics', 'Furniture', 'Office Supplies', 'Accessories'];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, 0);
      }
      categoryMap.set(category, categoryMap.get(category) + p.sales);
    });
    
    return Array.from(categoryMap.entries()).map(([category, sales]) => ({
      category,
      sales,
      orders: Math.floor(sales / 100)
    }));
  }

  private getSalesByMarket(data: any): any[] {
    const markets = ['US', 'Europe', 'Asia', 'Africa'];
    const totalSales = data.summary?.totalSales || 0;
    
    return markets.map(market => ({
      market,
      sales: totalSales * (0.2 + Math.random() * 0.3),
      percentage: 0 // will be calculated in UI
    }));
  }

  private getOrdersByMonth(salesOverTime: any[]): any[] {
    if (!salesOverTime || salesOverTime.length === 0) {
      return [];
    }
    
    return salesOverTime.map(item => ({
      month: `${item.month}/${item.year}`,
      year: item.year,
      orders: item.orders || 0,
      totalAmount: item.sales || 0
    }));
  }
}