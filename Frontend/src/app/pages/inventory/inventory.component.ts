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

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
}

@Component({
  selector: 'app-inventory',
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
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  // Mock data
  products: Product[] = [
    { id: 'P-001', name: 'Widget A', category: 'Widgets', stock: 120, reorderLevel: 30, status: 'In Stock', lastUpdated: '2024-07-12' },
    { id: 'P-002', name: 'Gadget B', category: 'Gadgets', stock: 8, reorderLevel: 20, status: 'Low Stock', lastUpdated: '2024-07-10' },
    { id: 'P-003', name: 'Doohickey C', category: 'Doohickeys', stock: 0, reorderLevel: 10, status: 'Out of Stock', lastUpdated: '2024-07-08' },
    { id: 'P-004', name: 'Widget D', category: 'Widgets', stock: 45, reorderLevel: 15, status: 'In Stock', lastUpdated: '2024-07-11' },
    { id: 'P-005', name: 'Gadget E', category: 'Gadgets', stock: 5, reorderLevel: 10, status: 'Low Stock', lastUpdated: '2024-07-09' },
    { id: 'P-006', name: 'Doohickey F', category: 'Doohickeys', stock: 0, reorderLevel: 5, status: 'Out of Stock', lastUpdated: '2024-07-07' },
    { id: 'P-007', name: 'Widget G', category: 'Widgets', stock: 200, reorderLevel: 50, status: 'In Stock', lastUpdated: '2024-07-13' },
    { id: 'P-008', name: 'Gadget H', category: 'Gadgets', stock: 12, reorderLevel: 25, status: 'Low Stock', lastUpdated: '2024-07-10' },
    { id: 'P-009', name: 'Doohickey I', category: 'Doohickeys', stock: 75, reorderLevel: 20, status: 'In Stock', lastUpdated: '2024-07-12' },
    { id: 'P-010', name: 'Widget J', category: 'Widgets', stock: 0, reorderLevel: 15, status: 'Out of Stock', lastUpdated: '2024-07-06' },
  ];

  displayedColumns: string[] = ['name', 'id', 'category', 'stock', 'reorderLevel', 'status', 'lastUpdated', 'actions'];

  // Toolbar filters
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';

  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const matchesSearch = this.searchTerm ? p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || p.id.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const matchesCategory = this.selectedCategory ? p.category === this.selectedCategory : true;
      const matchesStatus = this.selectedStatus ? p.status === this.selectedStatus : true;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  // KPI calculations
  get totalProducts(): number { return this.products.length; }
  get inStock(): number { return this.products.filter(p => p.status === 'In Stock').length; }
  get lowStock(): number { return this.products.filter(p => p.status === 'Low Stock').length; }
  get outOfStock(): number { return this.products.filter(p => p.status === 'Out of Stock').length; }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
  }
}
