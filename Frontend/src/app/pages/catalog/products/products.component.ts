import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IProduct } from '../../../core/Models/product.model';
import { ICategories } from '../../../core/Models/categories';
import { ProductDialog } from './product-dialog/product-dialog';
import { ProductService } from '../../../core/services/product-service';
import { CategoryService } from '../../../core/services/category-service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductDialog
  ],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class ProductsComponent implements OnInit {
  products: IProduct[] = [];
  categories: ICategories[] = [];
  filteredProducts: IProduct[] = [];
  loading = false;

  // Filters
  searchQuery = '';
  selectedCategory = 'All Categories';
  selectedStatus = 'All';

  // Dialog
  isDialogOpen = false;
  dialogMode: 'add' | 'edit' | 'view' = 'add';
  selectedProduct: IProduct | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.filterData();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = true;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  filterData(): void {
    const search = this.searchQuery.toLowerCase();

    this.filteredProducts = this.products.filter(product => {
      const matchesSearch =
        product.Product_Name.toLowerCase().includes(search) ||
        (product.categoryRef?.Category_Name || '').toLowerCase().includes(search) ||
        product.Product_Card_Id?.toString().includes(search);

      const matchesCategory =
        this.selectedCategory === 'All Categories' ||
        product.categoryRef?.Category_Name === this.selectedCategory;

      const matchesStatus =
        this.selectedStatus === 'All' ||
        product.Product_Status === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'All Categories';
    this.selectedStatus = 'All';
    this.filterData();
  }

  // Dialog methods
  openDialog(mode: 'add' | 'edit' | 'view', product?: IProduct): void {
    this.dialogMode = mode;
    this.selectedProduct = product || null;
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.selectedProduct = null;
  }

  saveProduct(product: IProduct): void {
    if (this.dialogMode === 'add') {
      this.addProduct(product);
    } else if (this.dialogMode === 'edit') {
      this.updateProduct(product);
    }
  }

  // CRUD Operations
  addProduct(product: IProduct): void {
    this.productService.addProduct(product).subscribe({
      next: (response) => {
        console.log('Product Added:', response);
        this.closeDialog();
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error Adding Product:', error);
      }
    });
  }

  updateProduct(product: IProduct): void {
    this.productService.updateProduct(product._id, product).subscribe({
      next: (response) => {
        console.log('Product Updated:', response);
        this.closeDialog();
        this.loadProducts();
      },
      error: (error) => {
        console.error('Failed to update product:', error);
      }
    });
  }

  deleteProduct(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    this.productService.deleteProduct(id).subscribe({
      next: (response) => {
        console.log('Product Deleted:', response);
        this.loadProducts();
      },
      error: (error) => {
        console.error('Failed to delete product:', error);
      }
    });
  }
}