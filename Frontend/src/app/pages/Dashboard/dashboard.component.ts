// pages/Dashboard/dashboard.component.ts
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard-service';
import { DashboardData, SalesOverTime, RecentOrder, LowStockProduct } from '../../core/Models/Dashboard.model';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('salesChart') salesChartCanvas!: ElementRef;
  @ViewChild('ordersChart') ordersChartCanvas!: ElementRef;

  dashboardData: DashboardData | null = null;
  loading = false;
  error = '';

  salesChart: Chart | null = null;
  ordersChart: Chart | null = null;
  private chartInitialized = false;
  recentOrders: RecentOrder[] = [];
  lowStockProducts: LowStockProduct[] = [];

  // Status mapping
  statusMap: { [key: string]: string } = {
    'COMPLETE': 'Complete',
    'CLOSED': 'Closed',
    'PROCESSING': 'Processing',
    'PENDING_PAYMENT': 'Pending Payment',
    'PENDING': 'Pending',
    'ON_HOLD': 'On Hold',
    'CANCELED': 'Cancelled',
    'SUSPECTED_FRAUD': 'Suspected Fraud',
    'PAYMENT_REVIEW': 'Payment Review'
  };

  statusColors: { [key: string]: string } = {
    'COMPLETE': '#22C55E',
    'CLOSED': '#6B7280',
    'PROCESSING': '#3B82F6',
    'PENDING_PAYMENT': '#F59E0B',
    'PENDING': '#F59E0B',
    'ON_HOLD': '#8B5CF6',
    'CANCELED': '#EF4444',
    'SUSPECTED_FRAUD': '#EC4899',
    'PAYMENT_REVIEW': '#F97316'
  };

  statusClasses: { [key: string]: string } = {
    'COMPLETE': 'bg-green-100 text-green-800',
    'CLOSED': 'bg-gray-100 text-gray-800',
    'PROCESSING': 'bg-blue-100 text-blue-800',
    'PENDING_PAYMENT': 'bg-amber-100 text-amber-800',
    'PENDING': 'bg-amber-100 text-amber-800',
    'ON_HOLD': 'bg-purple-100 text-purple-800',
    'CANCELED': 'bg-red-100 text-red-800',
    'SUSPECTED_FRAUD': 'bg-pink-100 text-pink-800',
    'PAYMENT_REVIEW': 'bg-orange-100 text-orange-800'
  };

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // Charts will be initialized after data loads
  }
  ngAfterViewChecked(): void {
    // Initialize charts only once after view is stable
    if (this.dashboardData && !this.chartInitialized) {
      this.initCharts();
      this.chartInitialized = true;
    }
  }
  loadDashboardData(): void {
    this.loading = true;
    this.error = '';
    this.chartInitialized = false;
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        this.dashboardData = response.data;
        this.recentOrders = response.data.recentOrders || [];
        this.lowStockProducts = response.data.lowStockProducts || [];
        this.loading = false;

        // ✅ Use setTimeout with a delay to ensure DOM is rendered
        setTimeout(() => {
          this.initCharts();
        }, 300);
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });
  }

  // ✅ Combined chart initialization
  initCharts(): void {
    this.initSalesChart();
    this.initOrdersChart();
  }

  initSalesChart(): void {
    const canvas = this.salesChartCanvas?.nativeElement;
    if (!canvas) {
      console.warn('Sales chart canvas not found');
      return;
    }

    // Destroy existing chart if any
    if (this.salesChart) {
      this.salesChart.destroy();
      this.salesChart = null;
    }

    const salesData = this.dashboardData?.salesOverTime || [];
    
    let labels: string[] = [];
    let data: number[] = [];

    if (salesData.length > 0) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      labels = salesData.map(item => monthNames[item.month - 1] + ' ' + item.year);
      data = salesData.map(item => item.sales);
    } else {
      // Fallback data - last 12 months with zeros
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      for (let i = 11; i >= 0; i--) {
        let month = currentMonth - i;
        let year = currentYear;
        if (month < 0) {
          month += 12;
          year--;
        }
        labels.push(monthNames[month] + ' ' + year);
        data.push(0);
      }
    }

    try {
      this.salesChart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Sales ($)',
            data: data,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#3B82F6',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              titleFont: { size: 13 },
              bodyFont: { size: 13 },
              padding: 10,
              cornerRadius: 4,
              displayColors: false,
              callbacks: {
                label: function(context) {
                  return '$' + context!.parsed!.y!.toLocaleString(undefined, { minimumFractionDigits: 2 });
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false }
            },
            y: {
              beginAtZero: true,
              grid: { color: '#f3f4f6' },
              border: { display: false },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
      
      // ✅ Force change detection
      this.cdr.detectChanges();
      
    } catch (error) {
      console.error('Error creating sales chart:', error);
    }
  }

  initOrdersChart(): void {
    const canvas = this.ordersChartCanvas?.nativeElement;
    if (!canvas) {
      console.warn('Orders chart canvas not found');
      return;
    }

    // Destroy existing chart if any
    if (this.ordersChart) {
      this.ordersChart.destroy();
      this.ordersChart = null;
    }

    const orderStatus = this.dashboardData?.orderStatus || [];
    
    // Filter out null/undefined statuses
    const validStatuses = orderStatus.filter(item => item.status !== null && item.status !== undefined);
    
    let labels: string[] = [];
    let data: number[] = [];
    let colors: string[] = [];

    if (validStatuses.length > 0) {
      // Sort by count descending
      const sorted = [...validStatuses].sort((a, b) => b.count - a.count);
      
      labels = sorted.map(item => this.statusMap[item.status] || item.status);
      data = sorted.map(item => item.count);
      colors = sorted.map(item => this.statusColors[item.status] || '#9CA3AF');
    } else {
      labels = ['No Data'];
      data = [1];
      colors = ['#9CA3AF'];
    }

    try {
      this.ordersChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors,
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              bodyFont: { size: 13 },
              padding: 10,
              cornerRadius: 4
            }
          }
        }
      });
      
      // ✅ Force change detection
      this.cdr.detectChanges();
      
    } catch (error) {
      console.error('Error creating orders chart:', error);
    }
  }

  // ===================== STATUS HELPER METHODS =====================

  getDisplayStatus(status: string): string {
    return this.statusMap[status] || status || 'Unknown';
  }

  getStatusClass(status: string): string {
    return this.statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  // ===================== ORDER COUNT METHODS =====================

  getTotalOrders(): number {
    return this.dashboardData?.summary?.totalOrders || 0;
  }

  getOrderCountByStatus(status: string): number {
    const found = this.dashboardData?.orderStatus?.find(s => s.status === status);
    return found?.count || 0;
  }

  getCompletedOrders(): number {
    return this.getOrderCountByStatus('COMPLETE');
  }

  getProcessingOrders(): number {
    return this.getOrderCountByStatus('PROCESSING');
  }

  getPendingOrders(): number {
    return this.getOrderCountByStatus('PENDING_PAYMENT') + this.getOrderCountByStatus('PENDING');
  }

  getCancelledOrders(): number {
    return this.getOrderCountByStatus('CANCELED');
  }

  // ===================== FORMATTING METHODS =====================

  formatCurrency(value: number): string {
    return '$' + (value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  getStockStatusClass(stock: number): string {
    if (stock <= 0) return 'bg-red-100 text-red-800';
    if (stock <= 3) return 'bg-amber-100 text-amber-800';
    return 'bg-green-100 text-green-800';
  }

  getStockStatus(stock: number): string {
    if (stock <= 0) return 'Critical';
    if (stock <= 3) return 'Low Stock';
    return 'In Stock';
  }

  getInventoryPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return (value / total) * 100;
  }

  // ===================== EXPORT METHODS =====================

  exportReport(): void {
    console.log('Export report clicked');
  }

  printReport(): void {
    window.print();
  }
}