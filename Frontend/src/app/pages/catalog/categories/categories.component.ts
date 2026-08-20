// categories.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryDialog } from './category-dialog/category-dialog';
import { IProduct } from '../../../core/Models/product.model';
import { ICategories } from '../../../core/Models/categories';
import { ProductService } from '../../../core/services/product-service';
import { CategoryService } from '../../../core/services/category-service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CategoryDialog  
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class CategoriesComponent implements OnInit {
  products: IProduct[] = [];
  categories: ICategories[] = [];
  filteredCategories: ICategories[] = [];
  loading = false;  
  searchQuery = '';

  // Dialog properties
  isDialogOpen = false;
  dialogMode: 'add' | 'edit' | 'view' = 'add';
  selectedCategory: ICategories | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  filterData(): void {
    const search = this.searchQuery.toLowerCase();
    this.filteredCategories = this.categories.filter(category => {
      const matchesSearch = category.Category_Name.toLowerCase().includes(search);
      return matchesSearch;
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterData();
  }

  // Dialog methods
  openDialog(mode: 'add' | 'edit' | 'view', category?: ICategories): void {
    this.dialogMode = mode;
    this.selectedCategory = category || null;
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.selectedCategory = null;
  }

  saveCategory(category: ICategories): void {
    if (this.dialogMode === 'add') {
      this.addCategory(category);
    } else if (this.dialogMode === 'edit') {
      this.updateCategory(category);
    }
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        console.log('Products loaded:', response);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        console.log('Categories loaded:', response);
        this.filterData();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  addCategory(category: ICategories): void {
    this.categoryService.addCategory(category).subscribe({
      next: (response) => {
        console.log('Category Added:', response);
        this.closeDialog();
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error Adding Category:', error);
      }
    });
  }

  updateCategory(category: ICategories): void {
    this.categoryService.updateCategory(category._id, category).subscribe({
      next: (response) => {
        console.log('Category Updated:', response);
        this.closeDialog();
        this.loadCategories();
      },
      error: (error) => {
        console.error('Failed to update category:', error);
      }
    });
  }

  deleteCategory(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this category?');
    if (!confirmed) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: (response) => {
        console.log('Category Deleted:', response);
        this.loadCategories();
      },
      error: (error) => {
        console.error('Failed to delete category:', error);
      }
    });
  }

  getProductCount(categoryId: number): number {
    return this.products.filter(
      product => product.categoryRef?.Category_Id === categoryId
    ).length;
  }
}