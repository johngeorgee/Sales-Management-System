// pages/reports/reports.component.ts
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../../core/services/reports-service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html'
})
export class ReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('salesTrendChart') salesTrendChart!: ElementRef;
  @ViewChild('salesByCategoryChart') salesByCategoryChart!: ElementRef;
  @ViewChild('salesByMarketChart') salesByMarketChart!: ElementRef;
  @ViewChild('ordersByStatusChart') ordersByStatusChart!: ElementRef;
  @ViewChild('customerSegmentsChart') customerSegmentsChart!: ElementRef;
  @ViewChild('topProductsChart') topProductsChart!: ElementRef;
  @ViewChild('stockStatusChart') stockStatusChart!: ElementRef;
  @ViewChild('purchaseTrendChart') purchaseTrendChart!: ElementRef;
  @ViewChild('purchaseStatusChart') purchaseStatusChart!: ElementRef;
  @ViewChild('shippingPerformanceChart') shippingPerformanceChart!: ElementRef;

  loading = true;
  error = '';
  chartsInitialized = false;

  salesReport: any = null;
  orderReport: any = null;
  productReport: any = null;
  customerReport: any = null;
  inventoryReport: any = null;

  salesKpis: any[] = [];
  orderKpis: any[] = [];
  inventoryKpis: any[] = [];
  purchaseKpis: any[] = [];
  shippingKpis: any[] = [];

  topCustomers: any[] = [];
  topProductsTable: any[] = [];
  lowStockProducts: any[] = [];
  shippingPerformanceTable: any[] = [];

  isExportMenuOpen = false;

  dateRanges = ['Today', 'This Week', 'This Month', 'This Quarter', 'This Year', 'Custom Range'];
  markets = ['All Markets', 'US', 'Europe', 'Asia', 'Africa'];
  segments = ['All Segments', 'Consumer', 'Corporate', 'Home Office'];
  filter = { dateRange: 'This Month', market: 'All Markets', segment: 'All Segments' };

  constructor(
    private reportsService: ReportsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllReports();
  }

  ngAfterViewInit(): void {
    // Charts will be initialized after data loads
  }

  loadAllReports(): void {
    this.loading = true;
    
    Promise.all([
      this.reportsService.getSalesReport().toPromise(),
      this.reportsService.getOrderReport().toPromise(),
      this.reportsService.getProductReport().toPromise(),
      this.reportsService.getCustomerReport().toPromise(),
      this.reportsService.getInventoryReport().toPromise()
    ]).then(([sales, orders, products, customers, inventory]) => {
      this.salesReport = sales;
      this.orderReport = orders;
      this.productReport = products;
      this.customerReport = customers;
      this.inventoryReport = inventory;
      
      this.populateKPIs();
      this.populateTables();
      
      this.loading = false;
      this.chartsInitialized = false;
      
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.initCharts();
      }, 300);
    }).catch(err => {
      console.error('Error loading reports:', err);
      this.error = 'Failed to load reports';
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  populateKPIs(): void {
    if (this.salesReport) {
      this.salesKpis = [
        { title: 'Total Sales', value: '$' + (this.salesReport.totalSales || 0).toLocaleString() },
        { title: 'Total Orders', value: (this.salesReport.totalOrders || 0).toLocaleString() },
        { title: 'Average Order Value', value: '$' + (this.salesReport.averageOrderValue || 0).toFixed(2) },
        { title: 'Total Profit', value: '$' + (this.salesReport.totalProfit || 0).toLocaleString() }
      ];
    }

    if (this.orderReport) {
      this.orderKpis = [
        { title: 'Total Orders', value: (this.orderReport.totalOrders || 0).toLocaleString() },
        { title: 'Completed', value: (this.orderReport.completedOrders || 0).toLocaleString() },
        { title: 'Pending', value: (this.orderReport.pendingOrders || 0).toLocaleString() },
        { title: 'Cancelled', value: (this.orderReport.cancelledOrders || 0).toLocaleString() }
      ];
    }

    if (this.inventoryReport) {
      this.inventoryKpis = [
        { title: 'Total Products', value: (this.productReport?.totalProducts || 0).toLocaleString() },
        { title: 'Low Stock', value: (this.inventoryReport.stockStatus?.find((s: any) => s.status === 'Low Stock')?.count || 0).toLocaleString() },
        { title: 'Out of Stock', value: (this.inventoryReport.stockStatus?.find((s: any) => s.status === 'Out of Stock')?.count || 0).toLocaleString() },
        { title: 'Total Stock Units', value: (this.inventoryReport.totalStockUnits || 0).toLocaleString() }
      ];
    }

    this.purchaseKpis = [
      { title: 'Total Purchases', value: '542' },
      { title: 'Purchase Orders', value: '400' },
      { title: 'Pending Purchases', value: '80' },
      { title: 'Received Purchases', value: '462' }
    ];

    this.shippingKpis = [
      { title: 'Total Shipments', value: '710' },
      { title: 'On Time', value: '620' },
      { title: 'Late', value: '70' },
      { title: 'Cancelled', value: '20' }
    ];
  }

  populateTables(): void {
    if (this.orderReport?.recentOrders) {
      const customerMap = new Map();
      this.orderReport.recentOrders.forEach((order: any) => {
        const name = order.customerName || 'Unknown';
        if (!customerMap.has(name)) {
          customerMap.set(name, { name, orders: 0, sales: 0 });
        }
        const customer = customerMap.get(name);
        customer.orders++;
        customer.sales += order.amount || 0;
      });
      
      this.topCustomers = Array.from(customerMap.values())
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5)
        .map((c: any) => ({
          name: c.name,
          orders: c.orders,
          sales: '$' + c.sales.toFixed(2),
          avg: '$' + (c.sales / c.orders).toFixed(2)
        }));
    }

    if (this.productReport?.topSellingProducts) {
      this.topProductsTable = this.productReport.topSellingProducts.map((p: any) => ({
        name: p.productName || 'Unknown',
        category: 'General',
        units: p.quantitySold || 0,
        revenue: '$' + (p.sales || 0).toFixed(2),
        discount: '$0.00'
      }));
    }

    if (this.productReport?.lowStockProducts) {
      this.lowStockProducts = this.productReport.lowStockProducts.map((p: any) => ({
        name: p.name || 'Unknown',
        stock: p.stock || 0,
        reorder: p.reorderLevel || 0,
        status: p.stock <= 3 ? 'Critical' : p.stock <= 5 ? 'Low Stock' : 'In Stock'
      }));
    }

    this.shippingPerformanceTable = [
      { mode: 'Standard Class', shipments: 420, ontime: '88%', avgDays: 3.4, late: 50 },
      { mode: 'First Class', shipments: 210, ontime: '93%', avgDays: 2.1, late: 15 },
      { mode: 'Same Day', shipments: 80, ontime: '97%', avgDays: 1.0, late: 2 }
    ];
  }

  clearFilters(): void {
    this.filter = { dateRange: 'This Month', market: 'All Markets', segment: 'All Segments' };
  }

  toggleExportMenu(): void {
    this.isExportMenuOpen = !this.isExportMenuOpen;
  }

  exportReport(format: string): void {
    console.log(`Exporting as ${format}`);
    this.isExportMenuOpen = false;
  }

  printReport(): void {
    window.print();
  }

  initCharts(): void {
    if (this.chartsInitialized) {
      return;
    }
    
    console.log('📊 Initializing charts...');
    
    this.drawSalesTrendChart();
    this.drawSalesByCategoryChart();
    this.drawSalesByMarketChart();
    this.drawOrdersByStatusChart();
    this.drawCustomerSegmentsChart();
    this.drawTopProductsChart();
    this.drawStockStatusChart();
    this.drawPurchaseTrendChart();
    this.drawPurchaseStatusChart();
    this.drawShippingPerformanceChart();
    
    this.chartsInitialized = true;
    this.cdr.detectChanges();
    console.log('✅ Charts initialized!');
  }

  // =========================
  // CHART DRAWING METHODS
  // =========================

  drawSalesTrendChart(): void {
    const canvas = this.salesTrendChart?.nativeElement;
    if (!canvas) return;
    
    const data = this.salesReport?.salesTrend || [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = data.length > 0 ? data.map((item: any) => monthNames[item.month - 1] + ' ' + item.year) : monthNames;
    const values = data.length > 0 ? data.map((item: any) => item.sales || 0) : Array(12).fill(0);
    
    this.drawLineChart(canvas, labels, values, '#3b82f6', '$');
  }

  drawSalesByCategoryChart(): void {
    const canvas = this.salesByCategoryChart?.nativeElement;
    if (!canvas) return;
    
    const data = this.salesReport?.salesByCategory || [
      { category: 'Electronics', sales: 150000 },
      { category: 'Furniture', sales: 210000 },
      { category: 'Office Supplies', sales: 98000 },
      { category: 'Accessories', sales: 42000 }
    ];
    
    const labels = data.map((item: any) => item.category);
    const values = data.map((item: any) => item.sales || 0);
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    this.drawBarChart(canvas, labels, values, colors.slice(0, labels.length), '$');
  }

  drawSalesByMarketChart(): void {
    const canvas = this.salesByMarketChart?.nativeElement;
    if (!canvas) return;
    
    const data = this.salesReport?.salesByMarket || [
      { market: 'US', sales: 600000 },
      { market: 'Europe', sales: 450000 },
      { market: 'Asia', sales: 380000 },
      { market: 'Africa', sales: 120000 }
    ];
    
    const labels = data.map((item: any) => item.market);
    const values = data.map((item: any) => item.sales || 0);
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
    
    this.drawDoughnutChart(canvas, labels, values, colors);
  }

  drawOrdersByStatusChart(): void {
    const canvas = this.ordersByStatusChart?.nativeElement;
    if (!canvas) return;
    
    const data = this.orderReport?.ordersByStatus || [
      { status: 'COMPLETE', count: 256 },
      { status: 'PROCESSING', count: 109 },
      { status: 'PENDING_PAYMENT', count: 96 },
      { status: 'PENDING', count: 67 },
      { status: 'CLOSED', count: 67 },
      { status: 'ON_HOLD', count: 35 },
      { status: 'CANCELED', count: 34 }
    ];
    
    const statusMap: { [key: string]: string } = {
      'COMPLETE': 'Complete',
      'PROCESSING': 'Processing',
      'PENDING_PAYMENT': 'Pending Payment',
      'PENDING': 'Pending',
      'CLOSED': 'Closed',
      'ON_HOLD': 'On Hold',
      'CANCELED': 'Cancelled'
    };
    
    const labels = data.map((item: any) => statusMap[item.status] || item.status);
    const values = data.map((item: any) => item.count || 0);
    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#f59e0b', '#6b7280', '#8b5cf6', '#ef4444'];
    
    this.drawDoughnutChart(canvas, labels, values, colors.slice(0, labels.length));
  }

  drawCustomerSegmentsChart(): void {
    const canvas = this.customerSegmentsChart?.nativeElement;
    if (!canvas) return;
    
    const labels = ['Consumer', 'Corporate', 'Home Office'];
    const values = [1500, 800, 400];
    const colors = ['#3b82f6', '#10b981', '#f59e0b'];
    
    this.drawDoughnutChart(canvas, labels, values, colors);
  }

  drawTopProductsChart(): void {
    const canvas = this.topProductsChart?.nativeElement;
    if (!canvas) return;
    
    const data = this.productReport?.topSellingProducts || [];
    const labels = data.length > 0 ? data.map((item: any) => item.productName || 'Unknown') : ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
    const values = data.length > 0 ? data.map((item: any) => item.quantitySold || 0) : [1200, 950, 800, 600, 450];
    
    this.drawHorizontalBarChart(canvas, labels, values);
  }

  drawStockStatusChart(): void {
    const canvas = this.stockStatusChart?.nativeElement;
    if (!canvas) return;
    
    const data = this.inventoryReport?.stockStatus || [
      { status: 'In Stock', count: 163 },
      { status: 'Low Stock', count: 11 },
      { status: 'Out of Stock', count: 4 }
    ];
    
    const labels = data.map((item: any) => item.status);
    const values = data.map((item: any) => item.count || 0);
    const colors = ['#10b981', '#f59e0b', '#ef4444'];
    
    this.drawDoughnutChart(canvas, labels, values, colors.slice(0, labels.length));
  }

  drawPurchaseTrendChart(): void {
    const canvas = this.purchaseTrendChart?.nativeElement;
    if (!canvas) return;
    
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const values = [8000, 9500, 8700, 11000, 12500, 11500, 13500, 14000, 13000, 15000, 16000, 17000];
    
    this.drawLineChart(canvas, labels, values, '#22d3ee', '$');
  }

  drawPurchaseStatusChart(): void {
    const canvas = this.purchaseStatusChart?.nativeElement;
    if (!canvas) return;
    
    const labels = ['Draft', 'Pending', 'Approved', 'Received', 'Cancelled'];
    const values = [60, 80, 150, 200, 52];
    const colors = ['#9ca3af', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
    
    this.drawDoughnutChart(canvas, labels, values, colors);
  }

  drawShippingPerformanceChart(): void {
    const canvas = this.shippingPerformanceChart?.nativeElement;
    if (!canvas) return;
    
    const labels = ['Advance', 'On Time', 'Late', 'Cancelled'];
    const values = [150, 420, 70, 20];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
    
    this.drawBarChart(canvas, labels, values, colors, '');
  }

  // =========================
  // CORE CHART DRAWING FUNCTIONS
  // =========================

  drawLineChart(canvas: HTMLCanvasElement, labels: string[], data: number[], color: string, prefix: string = ''): void {
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.parentElement?.getBoundingClientRect();
    const width = rect?.width || 400;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    const padding = { top: 30, right: 30, bottom: 50, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const max = Math.max(...data) * 1.1 || 1;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    for (let i = 0; i < data.length; i++) {
      const x = padding.left + (chartWidth / (data.length - 1)) * i;
      const y = padding.top + chartHeight - ((data[i]) / max) * chartHeight;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    for (let i = 0; i < data.length; i++) {
      const x = padding.left + (chartWidth / (data.length - 1)) * i;
      const y = padding.top + chartHeight - ((data[i]) / max) * chartHeight;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    ctx.fillStyle = '#6b7280';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding.left + (chartWidth / (labels.length - 1)) * i;
      ctx.fillText(labels[i], x, height - 10);
    }

    ctx.textAlign = 'right';
    ctx.font = '11px sans-serif';
    for (let i = 0; i < 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      const value = (max - (max / 5) * i);
      ctx.fillText(prefix + value.toFixed(2), padding.left - 10, y + 4);
    }
  }

  drawBarChart(canvas: HTMLCanvasElement, labels: string[], data: number[], colors: string[], prefix: string = ''): void {
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.parentElement?.getBoundingClientRect();
    const width = rect?.width || 400;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    const padding = { top: 30, right: 30, bottom: 50, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const max = Math.max(...data) * 1.1 || 1;

    ctx.clearRect(0, 0, width, height);

    const barWidth = chartWidth / data.length * 0.7;
    const gap = (chartWidth / data.length - barWidth) / 2;

    for (let i = 0; i < data.length; i++) {
      const x = padding.left + (chartWidth / data.length) * i + gap;
      const barHeight = (data[i] / max) * chartHeight;
      const y = padding.top + chartHeight - barHeight;

      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 4);
      ctx.fill();

      ctx.fillStyle = '#374151';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(prefix + data[i].toFixed(2), x + barWidth / 2, y - 8);
    }

    ctx.fillStyle = '#6b7280';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding.left + (chartWidth / data.length) * i + barWidth / 2 + gap;
      ctx.fillText(labels[i], x, height - 10);
    }
  }

  drawDoughnutChart(canvas: HTMLCanvasElement, labels: string[], data: number[], colors: string[]): void {
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.parentElement?.getBoundingClientRect();
    const width = rect?.width || 700;
    const height = rect?.height || 500;
    canvas.width = width;
    canvas.height = height;
  
    const centerX = width / 2;
    const centerY = height / 2 - 10;
    
    // ✅ زود الـ radius من 80 لـ 100 عشان الدايرة تكبر
    const radius = Math.min(width, height) / 2 - 60;  
    const innerRadius = radius * 0.55;
    const total = data.reduce((a, b) => a + b, 0) || 1;
  
    let startAngle = -Math.PI / 2;
    ctx.clearRect(0, 0, width, height);
  
    // Draw slices
    for (let i = 0; i < data.length; i++) {
      const sliceAngle = (data[i] / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
  
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
  
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
  
      const midAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 0.78;
      const x = centerX + Math.cos(midAngle) * labelRadius;
      const y = centerY + Math.sin(midAngle) * labelRadius;
      const percent = ((data[i] / total) * 100);
  
      if (percent > 3) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 4;
        ctx.fillText(percent.toFixed(1) + '%', x, y);
        ctx.shadowBlur = 0;
      }
  
      startAngle = endAngle;
    }
  
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toFixed(0), centerX, centerY - 10);
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px sans-serif';
    ctx.fillText('Total', centerX, centerY + 18);
  
    // ==================== LEGEND ====================
    const legendItems = labels.map((label, i) => ({
      label: label,
      color: colors[i % colors.length],
      value: data[i],
      percent: ((data[i] / total) * 100)
    }));
  
    legendItems.sort((a, b) => b.value - a.value);
  
    const legendY = height - 25;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
  
    let totalWidth = 0;
    const tempItems = legendItems.map(item => {
      const text = item.label + ' (' + item.percent.toFixed(1) + '%)';
      const w = ctx.measureText(text).width + 35;
      totalWidth += w;
      return { ...item, text, width: w };
    });
  
    if (totalWidth < width - 40) {
      let currentX = (width - totalWidth) / 2;
      tempItems.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(currentX + 7, legendY, 7, 0, Math.PI * 2);
        ctx.fill();
  
        ctx.fillStyle = '#1f2937';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.text, currentX + 18, legendY);
  
        currentX += item.width;
      });
    } else {
      let currentX = 20;
      let currentY = legendY - 15;
      const maxWidth = width - 40;
      const rowHeight = 26;
  
      tempItems.forEach((item, index) => {
        if (currentX + item.width > maxWidth && index > 0) {
          currentX = 20;
          currentY += rowHeight;
        }
  
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(currentX + 7, currentY, 7, 0, Math.PI * 2);
        ctx.fill();
  
        ctx.fillStyle = '#1f2937';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.text, currentX + 18, currentY);
  
        currentX += item.width + 5;
      });
    }
  }

  drawHorizontalBarChart(canvas: HTMLCanvasElement, labels: string[], data: number[]): void {
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.parentElement?.getBoundingClientRect();
    const width = rect?.width || 400;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    const padding = { top: 30, right: 60, bottom: 30, left: 100 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const max = Math.max(...data) * 1.1 || 1;

    ctx.clearRect(0, 0, width, height);

    const barHeight = chartHeight / data.length * 0.7;
    const gap = (chartHeight / data.length - barHeight) / 2;

    for (let i = 0; i < data.length; i++) {
      const y = padding.top + (chartHeight / data.length) * i + gap;
      const barWidth = (data[i] / max) * chartWidth;

      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(padding.left, y, barWidth, barHeight, 4);
      ctx.fill();

      ctx.fillStyle = '#374151';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(data[i].toFixed(0), padding.left + barWidth + 8, y + barHeight / 2 + 4);

      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], padding.left - 12, y + barHeight / 2);
    }
  }
}