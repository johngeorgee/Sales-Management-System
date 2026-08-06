// inventory.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Product {
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
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html'
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
    { id: 'P-010', name: 'Widget J', category: 'Widgets', stock: 0, reorderLevel: 15, status: 'Out of Stock', lastUpdated: '2024-07-06' }
  ];

  filteredProducts: Product[] = [];

  // Filters
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';

  // Get unique categories
  get categories(): string[] {
    return [...new Set(this.products.map(p => p.category))];
  }

  constructor() {
    this.filteredProducts = [...this.products];
  }

  // KPI calculations
  get totalProducts(): number {
    return this.products.length;
  }

  get inStock(): number {
    return this.products.filter(p => p.status === 'In Stock').length;
  }

  get lowStock(): number {
    return this.products.filter(p => p.status === 'Low Stock').length;
  }

  get outOfStock(): number {
    return this.products.filter(p => p.status === 'Out of Stock').length;
  }

  // Filter methods
  applyFilters(): void {
    this.filteredProducts = this.products.filter(p => {
      const matchesSearch = this.searchTerm
        ? p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const matchesCategory = this.selectedCategory
        ? p.category === this.selectedCategory
        : true;

      const matchesStatus = this.selectedStatus
        ? p.status === this.selectedStatus
        : true;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.filteredProducts = [...this.products];
  }

  // Action methods
  openStockAdjustment(): void {
    console.log('Open Stock Adjustment');
  }

  viewProduct(product: Product): void {
    console.log('View product:', product);
  }

  adjustStock(product: Product): void {
    console.log('Adjust stock for:', product);
  }
}