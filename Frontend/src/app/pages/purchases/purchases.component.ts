import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

interface PurchaseOrder {
  poNumber: string;
  supplier: string;
  date: string;
  items: number;
  total: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Received' | 'Cancelled';
  expectedDelivery: string;
}

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatChipsModule,
  ],
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']

})
export class PurchasesComponent {
  purchaseOrders: PurchaseOrder[] = [
    { poNumber: 'PO-1001', supplier: 'Acme Corp', date: '2024-07-01', items: 5, total: '$1,250.00', status: 'Draft', expectedDelivery: '2024-07-15' },
    { poNumber: 'PO-1002', supplier: 'Globex Inc', date: '2024-07-03', items: 3, total: '$780.00', status: 'Pending', expectedDelivery: '2024-07-18' },
    { poNumber: 'PO-1003', supplier: 'Umbrella Ltd', date: '2024-07-05', items: 8, total: '$2,340.00', status: 'Approved', expectedDelivery: '2024-07-20' },
    { poNumber: 'PO-1004', supplier: 'Stark Industries', date: '2024-07-07', items: 2, total: '$560.00', status: 'Received', expectedDelivery: '2024-07-12' },
    { poNumber: 'PO-1005', supplier: 'Wayne Enterprises', date: '2024-07-09', items: 4, total: '$1,100.00', status: 'Cancelled', expectedDelivery: '' },
    { poNumber: 'PO-1006', supplier: 'Oscorp', date: '2024-07-11', items: 6, total: '$1,890.00', status: 'Pending', expectedDelivery: '2024-07-25' },
    { poNumber: 'PO-1007', supplier: 'Wonka Industries', date: '2024-07-13', items: 7, total: '$1,750.00', status: 'Approved', expectedDelivery: '2024-07-28' },
  ];

  displayedColumns: string[] = ['poNumber', 'supplier', 'date', 'items', 'total', 'status', 'expectedDelivery', 'actions'];

  // Toolbar filters
  searchTerm: string = '';
  selectedStatus: string = '';

  get filteredOrders(): PurchaseOrder[] {
    return this.purchaseOrders.filter(p => {
      const matchesSearch = this.searchTerm ? p.poNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) || p.supplier.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const matchesStatus = this.selectedStatus ? p.status === this.selectedStatus : true;
      return matchesSearch && matchesStatus;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedStatus = '';
  }
}
