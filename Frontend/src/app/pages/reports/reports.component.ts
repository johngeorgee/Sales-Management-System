import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartData, ChartType } from 'chart.js';

/**
 * Reports & Analytics UI – Phase 8 implementation.
 * All data is static/mock and consistent across sections.
 */
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTooltipModule,
    BaseChartDirective
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent {
  // Filters
  dateRanges = ['Today', 'This Week', 'This Month', 'This Quarter', 'This Year', 'Custom Range'];
  markets = ['All Markets', 'US', 'Europe', 'Asia', 'Africa'];
  segments = ['All Segments', 'Consumer', 'Corporate', 'Home Office'];
  filter = { dateRange: 'This Month', market: 'All Markets', segment: 'All Segments' };

  clearFilters() {
    this.filter = { dateRange: 'This Month', market: 'All Markets', segment: 'All Segments' };
  }

  printReport() {
    // UI only – no real printing
  }

  // KPI definitions
  salesKpis = [
    { title: 'Total Sales', value: '$128,450', icon: 'payments' },
    { title: 'Total Orders', value: '1,284', icon: 'shopping_cart' },
    { title: 'Average Order Value', value: '$100.04', icon: 'attach_money' },
    { title: 'Total Discount', value: '$8,420', icon: 'discount' }
  ];

  orderKpis = [
    { title: 'Completed Orders', value: '680', icon: 'check_circle' },
    { title: 'Pending Orders', value: '180', icon: 'hourglass_top' },
    { title: 'Cancelled Orders', value: '48', icon: 'cancel' },
    { title: 'Average Order Value', value: '$100.04', icon: 'attach_money' }
  ];

  inventoryKpis = [
    { title: 'Total Products', value: '1,245', icon: 'category' },
    { title: 'Low Stock', value: '84', icon: 'warning' },
    { title: 'Out of Stock', value: '24', icon: 'block' },
    { title: 'Total Stock Units', value: '720', icon: 'inventory' }
  ];

  purchaseKpis = [
    { title: 'Total Purchases', value: '542', icon: 'receipt_long' },
    { title: 'Purchase Orders', value: '400', icon: 'description' },
    { title: 'Pending Purchases', value: '80', icon: 'hourglass_top' },
    { title: 'Received Purchases', value: '462', icon: 'download_done' }
  ];

  shippingKpis = [
    { title: 'Total Shipments', value: '710', icon: 'local_shipping' },
    { title: 'On Time', value: '620', icon: 'schedule' },
    { title: 'Late', value: '70', icon: 'warning' },
    { title: 'Cancelled', value: '20', icon: 'cancel' }
  ];

  // Chart options (reuse consistent styling)
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { line: { tension: 0.4 }, point: { radius: 4, hitRadius: 10, hoverRadius: 6 } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: '#f3f4f6' }, border: { display: false } } },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(17,24,39,0.9)', titleFont: { size: 13 }, bodyFont: { size: 13 }, padding: 10, cornerRadius: 4, displayColors: false } }
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: '#f3f4f6' }, border: { display: false } } },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(17,24,39,0.9)', titleFont: { size: 13 }, bodyFont: { size: 13 }, padding: 10, cornerRadius: 4 } }
  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(17,24,39,0.9)', bodyFont: { size: 13 }, padding: 10, cornerRadius: 4 } }
  };

  horizontalBarOptions: ChartOptions<'bar'> = { ...this.barChartOptions, indexAxis: 'y' };

  // Chart data (mock, consistent)
  salesTrendData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ label: 'Sales', data: [12000, 14500, 13200, 16800, 19000, 17800, 21400, 22500, 20800, 24100, 26300, 28500], backgroundColor: 'rgba(59,130,246,0.1)', borderColor: '#3b82f6', pointBackgroundColor: '#fff', pointBorderColor: '#3b82f6', pointBorderWidth: 2, fill: true }]
  };

  salesByCategoryData: ChartData<'bar'> = {
    labels: ['Electronics', 'Furniture', 'Office Supplies', 'Accessories'],
    datasets: [{ label: 'Sales', data: [40000, 30000, 35000, 2350], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'] }]
  };

  salesByMarketData: ChartData<'doughnut'> = {
    labels: ['US', 'Europe', 'Asia', 'Africa'],
    datasets: [{ data: [60000, 40000, 20000, 8500], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'] }]
  };

  ordersByStatusData: ChartData<'doughnut'> = {
    labels: ['Completed', 'Processing', 'Pending', 'Cancelled'],
    datasets: [{ data: [680, 240, 180, 48], backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'] }]
  };

  customerSegmentsData: ChartData<'doughnut'> = {
    labels: ['Consumer', 'Corporate', 'Home Office'],
    datasets: [{ data: [1500, 800, 400], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'] }]
  };

  // Top Customers Table
  topCustomers = [
    { name: 'Cally Holloway', orders: 42, sales: '$8,420', avg: '$200.48' },
    { name: 'John Doe', orders: 38, sales: '$7,560', avg: '$199.00' },
    { name: 'Emma Watson', orders: 35, sales: '$7,200', avg: '$205.71' },
    { name: 'Liam Smith', orders: 30, sales: '$6,500', avg: '$216.67' },
    { name: 'Olivia Johnson', orders: 28, sales: '$6,000', avg: '$214.29' }
  ];
  customerColumns = ['customer', 'orders', 'sales', 'avg'];

  // Top Products Chart (horizontal bar)
  topProductsChartData: ChartData<'bar'> = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
    datasets: [{ label: 'Units Sold', data: [1200, 950, 800, 600, 450], backgroundColor: '#3b82f6' }]
  };

  // Top Products Table
  topProductsTable = [
    { name: 'Wireless Mouse', category: 'Electronics', units: 1200, revenue: '$36,000', discount: '$2,500' },
    { name: 'Ergonomic Chair', category: 'Furniture', units: 950, revenue: '$114,000', discount: '$3,800' },
    { name: 'Standing Desk', category: 'Furniture', units: 800, revenue: '$96,000', discount: '$5,000' },
    { name: 'Mechanical Keyboard', category: 'Electronics', units: 600, revenue: '$48,000', discount: '$2,400' },
    { name: 'LED Monitor', category: 'Electronics', units: 450, revenue: '$67,500', discount: '$4,050' }
  ];
  productColumns = ['product', 'category', 'units', 'revenue', 'discount'];

  // Stock Status Doughnut
  stockStatusData: ChartData<'doughnut'> = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [{ data: [720, 84, 24], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'] }]
  };

  lowStockProducts = [
    { name: 'Wireless Headphones', stock: 2, reorder: 5, status: 'Critical' },
    { name: 'Smart Watch Pro', stock: 5, reorder: 8, status: 'Low Stock' },
    { name: 'Ergonomic Chair', stock: 3, reorder: 6, status: 'Critical' },
    { name: 'Mechanical Keyboard', stock: 7, reorder: 10, status: 'Low Stock' },
    { name: 'Webcam 4K', stock: 8, reorder: 12, status: 'Low Stock' }
  ];
  lowStockColumns = ['product', 'stock', 'reorder', 'status'];

  // Purchase Trend (line) – reuse salesTrendData shape with different values
  purchaseTrendData: ChartData<'line'> = {
    labels: this.salesTrendData.labels,
    datasets: [{ label: 'Purchases', data: [8000, 9500, 8700, 11000, 12500, 11500, 13500, 14000, 13000, 15000, 16000, 17000], backgroundColor: 'rgba(34,211,238,0.1)', borderColor: '#22d3ee', pointBackgroundColor: '#fff', pointBorderColor: '#22d3ee', pointBorderWidth: 2, fill: true }]
  };

  // Purchase Status Doughnut
  purchaseStatusData: ChartData<'doughnut'> = {
    labels: ['Draft', 'Pending', 'Approved', 'Received', 'Cancelled'],
    datasets: [{ data: [60, 80, 150, 200, 52], backgroundColor: ['#9ca3af', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'] }]
  };

  // Shipping Performance Bar
  shippingPerformanceData: ChartData<'bar'> = {
    labels: ['Advance Shipping', 'Shipping On Time', 'Late Delivery', 'Shipping Cancelled'],
    datasets: [{ label: 'Shipments', data: [150, 420, 70, 20], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'] }]
  };

  // Shipping Performance Table
  shippingPerformanceTable = [
    { mode: 'Standard Class', shipments: 420, ontime: '88%', avgDays: 3.4, late: 50 },
    { mode: 'First Class', shipments: 210, ontime: '93%', avgDays: 2.1, late: 15 },
    { mode: 'Same Day', shipments: 80, ontime: '97%', avgDays: 1.0, late: 2 }
  ];
  shippingColumns = ['mode', 'shipments', 'ontime', 'avgDays', 'late'];
}