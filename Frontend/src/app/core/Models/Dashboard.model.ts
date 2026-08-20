// core/Models/dashboard.model.ts
export interface DashboardSummary {
    totalSales: number;
    totalProfit: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    totalSuppliers: number;
    outOfStockProducts: number;
    lowStockProducts: number;
    totalPurchases: number;
    totalStockUnits: number;
    inventoryValue: number;
  }
  
  export interface SalesOverTime {
    year: number;
    month: number;
    sales: number;
    profit: number;
    orders: number;
  }
  
  export interface TopProduct {
    productId: string;
    productName: string;
    quantitySold: number;
    sales: number;
  }
  
  export interface RecentOrder {
    _id: string;
    Order_Status: string;
    Type: string;
    market: string;
    createdAt: string;
    customerName: string;
    customerId: number;
    amount: number;
  }
  
  export interface OrderStatus {
    status: string;
    count: number;
  }
  
  export interface PurchaseStats {
    status: string;
    count: number;
    total: number;
  }
  
  export interface LowStockProduct {
    _id: string;
    name: string;
    stock: number;
    reorderLevel: number;
    category: string;
  }
  
  export interface InventoryStats {
    totalStockUnits: number;
    inventoryValue: number;
  }
  
  export interface DashboardData {
    summary: DashboardSummary;
    salesOverTime: SalesOverTime[];
    topProducts: TopProduct[];
    recentOrders: RecentOrder[];
    orderStatus: OrderStatus[];
    purchases: PurchaseStats[];
    lowStockProducts: LowStockProduct[];
    inventory: InventoryStats;
  }
  
  export interface DashboardResponse {
    message: string;
    data: DashboardData;
  }