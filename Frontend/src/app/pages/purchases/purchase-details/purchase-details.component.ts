import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';

interface PurchaseOrder {
  poNumber: string;
  supplier: string;
  date: string;
  items: number;
  total: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Received' | 'Cancelled';
  expectedDelivery: string;
  supplierInfo?: {
    contact: string;
    email: string;
    phone: string;
    address: string;
  };
  lineItems: Array<{ product: string; productId: string; unitCost: string; quantity: number; discount: string; total: string }>;
}

@Component({
  selector: 'app-purchase-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.css']
})
export class PurchaseDetailsComponent implements OnInit {
  poNumber: string = '';
  order: PurchaseOrder = {
    poNumber: '',
    supplier: '',
    date: '',
    items: 0,
    total: '$0.00',
    status: 'Draft',
    expectedDelivery: '',
    lineItems: []
  };

  // Mock data – same data source as PurchasesComponent
  purchaseOrders: PurchaseOrder[] = [
    {
      poNumber: 'PO-1001',
      supplier: 'Acme Corp',
      date: '2024-07-01',
      items: 5,
      total: '$1,250.00',
      status: 'Draft',
      expectedDelivery: '2024-07-15',
      supplierInfo: {
        contact: 'John Doe',
        email: 'john@acme.com',
        phone: '555-0101',
        address: '123 Acme St, Metropolis',
      },
      lineItems: [
        { product: 'Widget A', productId: 'P-001', unitCost: '$100.00', quantity: 3, discount: '0%', total: '$300.00' },
        { product: 'Gadget B', productId: 'P-002', unitCost: '$150.00', quantity: 2, discount: '5%', total: '$285.00' },
      ],
    },
    { poNumber: 'PO-1002', supplier: 'Globex Inc', date: '2024-07-03', items: 3, total: '$780.00', status: 'Pending', expectedDelivery: '2024-07-18', lineItems: [] },
    { poNumber: 'PO-1003', supplier: 'Umbrella Ltd', date: '2024-07-05', items: 8, total: '$2,340.00', status: 'Approved', expectedDelivery: '2024-07-20', lineItems: [] },
    { poNumber: 'PO-1004', supplier: 'Stark Industries', date: '2024-07-07', items: 2, total: '$560.00', status: 'Received', expectedDelivery: '2024-07-12', lineItems: [] },
    { poNumber: 'PO-1005', supplier: 'Wayne Enterprises', date: '2024-07-09', items: 4, total: '$1,100.00', status: 'Cancelled', expectedDelivery: '', lineItems: [] },
  ];

  displayedColumns: string[] = ['product', 'productId', 'unitCost', 'quantity', 'discount', 'total'];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.poNumber = this.route.snapshot.paramMap.get('id') || '';
    const found = this.purchaseOrders.find(p => p.poNumber === this.poNumber);
    if (found) {
      this.order = found;
    } else {
      // default to first order to keep UI safe during development
      this.order = this.purchaseOrders[0];
    }
    // Ensure lineItems is defined for the table dataSource
    if (!this.order.lineItems) {
      this.order.lineItems = [];
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Draft':
        return 'primary';
      case 'Pending':
        return 'accent';
      case 'Approved':
        return 'warn';
      case 'Received':
        return 'primary';
      case 'Cancelled':
        return 'default';
      default:
        return 'primary';
    }
  }
}
