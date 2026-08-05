import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartData } from 'chart.js';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    MatChipsModule,

  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    this.initSalesChart();
    this.initOrdersChart();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  @ViewChild('salesChart') salesChartCanvas!: ElementRef;
  @ViewChild('ordersChart') ordersChartCanvas!: ElementRef;
  // --- 3. Sales Overview Chart Data ---
  salesChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4 },
      point: { radius: 4, hitRadius: 10, hoverRadius: 6 }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6' }, // tailwind gray-100
        border: { display: false }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)', // gray-900
        titleFont: { size: 13 },
        bodyFont: { size: 13 },
        padding: 10,
        cornerRadius: 4,
        displayColors: false
      }
    }
  };

  salesChartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [12000, 14500, 13200, 16800, 19000, 17800, 21400, 22500, 20800, 24100, 26300, 28500],
        label: 'Sales ($)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // blue-500 with opacity
        borderColor: '#3b82f6', // blue-500
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3b82f6',
        pointBorderWidth: 2,
        fill: true,
      }
    ]
  };


  // --- 4. Orders Overview Chart Data ---
  ordersChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        bodyFont: { size: 13 },
        padding: 10,
        cornerRadius: 4,
      }
    }
  };

  ordersChartData: ChartData<'doughnut'> = {
    labels: ['Completed', 'Processing', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [680, 240, 180, 48],
        backgroundColor: [
          '#22c55e', // green-500
          '#3b82f6', // blue-500
          '#f59e0b', // amber-500
          '#ef4444'  // red-500
        ],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  // --- 6. Recent Orders Table Data ---
  recentOrdersColumns: string[] = ['orderId', 'customer', 'date', 'amount', 'status'];
  recentOrders = [
    { id: '#ORD-7352', customer: 'Acme Corp', date: 'Aug 02, 2026', amount: '$1,250.00', status: 'Completed' },
    { id: '#ORD-7351', customer: 'Global Tech', date: 'Aug 02, 2026', amount: '$3,420.50', status: 'Processing' },
    { id: '#ORD-7350', customer: 'Sarah Jenkins', date: 'Aug 01, 2026', amount: '$145.00', status: 'Completed' },
    { id: '#ORD-7349', customer: 'Nexus Ltd', date: 'Aug 01, 2026', amount: '$5,100.00', status: 'Pending' },
    { id: '#ORD-7348', customer: 'Emma Watson', date: 'Jul 31, 2026', amount: '$85.00', status: 'Cancelled' },
    { id: '#ORD-7347', customer: 'TechFlow', date: 'Jul 30, 2026', amount: '$920.00', status: 'Completed' },
  ];

  // --- 7. Low Stock Products Data ---
  lowStockColumns: string[] = ['product', 'stock', 'status'];
  lowStockProducts = [
    { name: 'Wireless Headphones', category: 'Electronics', stock: 2, status: 'Critical' },
    { name: 'Smart Watch Pro', category: 'Electronics', stock: 5, status: 'Low Stock' },
    { name: 'Ergonomic Chair', category: 'Furniture', stock: 3, status: 'Critical' },
    { name: 'Mechanical Keyboard', category: 'Electronics', stock: 7, status: 'Low Stock' },
    { name: 'Webcam 4K', category: 'Electronics', stock: 8, status: 'Low Stock' },
  ];
  private initSalesChart(): void {
    const canvas = this.salesChartCanvas?.nativeElement;
    if (!canvas) return;
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Sales',
          data: [3000, 4500, 3800, 5200, 4800, 6000, 5500, 7000, 6500, 8000, 7500, 9000],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  private initOrdersChart(): void {
    const canvas = this.ordersChartCanvas?.nativeElement;
    if (!canvas) return;

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Processing', 'Pending', 'Cancelled'],
        datasets: [{
          data: [680, 240, 180, 48],
          backgroundColor: ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

}
