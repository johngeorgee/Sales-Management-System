import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IProduct } from '../../core/Models/product.model';
import { ProductService } from '../../core/services/product-service';
import { ExportService } from '../../core/services/export-service';
import { InventoryDialogComponent } from './inventory-dialog/inventory-dialog';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InventoryDialogComponent
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {

  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];

  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';

  loading = false;
  errorMessage = '';

  // Dialog
  isDialogOpen = false;
  dialogMode: 'view' | 'adjust' = 'view';
  selectedProduct: IProduct | null = null;

  constructor(
    private readonly productService: ProductService,
    private readonly exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading inventory products:', error);
        this.errorMessage = 'Failed to load inventory products';
        this.loading = false;
      }
    });
  }

  
  // KPI
  

  get totalProducts(): number {
    return this.products.length;
  }

  get inStock(): number {
    return this.products.filter(
      product => this.getStockStatus(product) === 'In Stock'
    ).length;
  }

  get lowStock(): number {
    return this.products.filter(
      product => this.getStockStatus(product) === 'Low Stock'
    ).length;
  }

  get outOfStock(): number {
    return this.products.filter(
      product => this.getStockStatus(product) === 'Out of Stock'
    ).length;
  }

  
  // Categories
  

  get categories(): string[] {
    return [
      ...new Set(
        this.products
          .map(product => product.categoryRef?.Category_Name)
          .filter((category): category is string => !!category)
      )
    ];
  }

  
  // Stock Status
  

  getStockStatus(product: IProduct): string {
    if (product.Product_Stock === 0) {
      return 'Out of Stock';
    }
    if (product.Product_Stock <= product.Product_Reorder_Level) {
      return 'Low Stock';
    }
    return 'In Stock';
  }

  
  // Filters
  

  applyFilters(): void {
    const search = this.searchTerm.trim().toLowerCase();

    this.filteredProducts = this.products.filter(product => {
      const matchesSearch =
        !search ||
        product.Product_Name.toLowerCase().includes(search) ||
        product.Product_Card_Id.toString().includes(search);

      const matchesCategory =
        !this.selectedCategory ||
        product.categoryRef?.Category_Name === this.selectedCategory;

      const matchesStatus =
        !this.selectedStatus ||
        this.getStockStatus(product) === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  
  // Dialog Methods
  

  openDialog(mode: 'view' | 'adjust', product: IProduct): void {
    this.dialogMode = mode;
    this.selectedProduct = product;
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.selectedProduct = null;
  }

  saveProduct(product: IProduct): void {
    // Update the product
    this.productService.updateProduct(product._id, product).subscribe({
      next: () => {
        this.loadProducts();
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.errorMessage = 'Failed to update product';
      }
    });
  }

  
  // Actions
  

  viewProduct(product: IProduct): void {
    this.openDialog('view', product);
  }

  adjustStock(product: IProduct): void {
    this.openDialog('adjust', product);
  }

  openStockAdjustment(): void {
    // Open adjustment dialog for first product or show selection
    if (this.products.length > 0) {
      this.adjustStock(this.products[0]);
    }
  }

  
  // Export Methods
  

  exportCSV(): void {
    this.exportService.exportToCSV(this.filteredProducts, 'inventory-report');
  }

  exportPDF(): void {
    this.exportService.exportToPDF(this.filteredProducts, 'Inventory Report');
  }

  printReport(): void {
    this.exportService.printReport(this.filteredProducts, 'Inventory Report');
  }
}