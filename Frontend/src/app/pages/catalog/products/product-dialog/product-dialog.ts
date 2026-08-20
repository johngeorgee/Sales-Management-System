import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../../../core/Models/product.model';
import { ICategories } from '../../../../core/Models/categories';
import { CategoryService } from '../../../../core/services/category-service';


@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './product-dialog.html',
  styleUrl: './product-dialog.css'
})
export class ProductDialog implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'add' | 'edit' | 'view' = 'add';
  @Input() product: IProduct | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<IProduct>();

  categories: ICategories[] = [];
  isSaving = false;
  errorMessage = '';

  formData: any = {
    Product_Card_Id: null,
    Product_Name: '',
    Product_Price: null,
    Product_Status: 'Active',
    Product_Image: '',
    Product_Category_Id: null,
    categoryRef: null
  };

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.fillForm();
    }
    if (changes['mode']) {
      this.errorMessage = '';
      this.isSaving = false;
    }
  }

  fillForm(): void {
    if (!this.product) return;

    this.formData = {
      Product_Card_Id: this.product.Product_Card_Id,
      Product_Name: this.product.Product_Name,
      Product_Price: this.product.Product_Price,
      Product_Status: this.product.Product_Status || 'Active',
      Product_Image: this.product.Product_Image || '',
      Product_Category_Id: this.product.Product_Category_Id,
      categoryRef: this.product.categoryRef?._id || null
    };
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
      }
    });
  }

  onCategoryChange(categoryId: string): void {
    const selectedCategory = this.categories.find(
      category => category._id === categoryId
    );

    if (!selectedCategory) return;

    this.formData.categoryRef = selectedCategory._id;
    this.formData.Product_Category_Id = selectedCategory.Category_Id;
  }

  close(): void {
    this.closed.emit();
  }

  save(): void {
    // Validation
    if (!this.formData.Product_Name || !this.formData.Product_Name.trim()) {
      this.errorMessage = 'Product name is required';
      return;
    }

    if (!this.formData.Product_Price || this.formData.Product_Price <= 0) {
      this.errorMessage = 'Please enter a valid price';
      return;
    }

    if (!this.formData.categoryRef) {
      this.errorMessage = 'Please select a category';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    // Emit the form data as a product
    const productData: IProduct = {
      ...this.formData,
      _id: this.product?._id || '',
      Product_Name: this.formData.Product_Name.trim(),
      Product_Price: Number(this.formData.Product_Price),
      Product_Card_Id: Number(this.formData.Product_Card_Id) || 0
    };

    this.saved.emit(productData);
    this.isSaving = false;
    this.close();
  }

  // Helper method for view mode - format date if needed
  formatDate(date: any): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  }
}