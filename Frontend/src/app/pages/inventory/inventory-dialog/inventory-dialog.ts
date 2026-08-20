import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../../core/Models/product.model';

@Component({
  selector: 'app-inventory-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-dialog.html',
  styleUrls: ['./inventory-dialog.css']
})
export class InventoryDialogComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'view' | 'adjust' = 'view';
  @Input() product: IProduct | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<IProduct>();

  // Form data
  formData: any = {
    _id: '',
    Product_Name: '',
    Product_Card_Id: null,
    Product_Price: 0,
    Product_Stock: 0,
    Product_Reorder_Level: 0,
    Product_Status: 'Active',
    Product_Image: '',
    categoryRef: null
  };

  // Stock adjustment fields
  adjustmentType: 'add' | 'remove' = 'add';
  adjustmentQuantity: number = 1;
  adjustmentReason: string = '';

  isSaving = false;
  errorMessage = '';

  ngOnInit(): void {
    if (this.product) {
      this.fillForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.fillForm();
    }
    if (changes['mode']) {
      this.errorMessage = '';
      this.isSaving = false;
      // Reset adjustment fields when opening adjust mode
      if (this.mode === 'adjust') {
        this.adjustmentType = 'add';
        this.adjustmentQuantity = 1;
        this.adjustmentReason = '';
      }
    }
  }

  fillForm(): void {
    if (!this.product) return;

    this.formData = {
      _id: this.product._id,
      Product_Name: this.product.Product_Name || '',
      Product_Card_Id: this.product.Product_Card_Id || null,
      Product_Price: this.product.Product_Price || 0,
      Product_Stock: this.product.Product_Stock || 0,
      Product_Reorder_Level: this.product.Product_Reorder_Level || 0,
      Product_Status: this.product.Product_Status || 'Active',
      Product_Image: this.product.Product_Image || '',
      categoryRef: this.product.categoryRef || null
    };
  }

  // Close dialog
  close(): void {
    this.closed.emit();
  }

  // Save changes
  save(): void {
    if (this.mode === 'adjust') {
      this.saveStockAdjustment();
    } else {
      this.saveProductChanges();
    }
  }

  // Save product changes (view mode with edit)
  saveProductChanges(): void {
    if (!this.formData.Product_Name) {
      this.errorMessage = 'Product name is required';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const productData: IProduct = {
      ...this.formData,
      _id: this.formData._id,
      Product_Stock: Number(this.formData.Product_Stock) || 0,
      Product_Price: Number(this.formData.Product_Price) || 0,
      Product_Reorder_Level: Number(this.formData.Product_Reorder_Level) || 0
    };

    this.saved.emit(productData);
    this.isSaving = false;
    this.close();
  }

  // Save stock adjustment
  saveStockAdjustment(): void {
    if (!this.adjustmentQuantity || this.adjustmentQuantity <= 0) {
      this.errorMessage = 'Please enter a valid quantity';
      return;
    }

    if (!this.adjustmentReason) {
      this.errorMessage = 'Please provide a reason for the adjustment';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const newStock = this.adjustmentType === 'add'
      ? this.formData.Product_Stock + this.adjustmentQuantity
      : this.formData.Product_Stock - this.adjustmentQuantity;

    if (newStock < 0) {
      this.errorMessage = 'Stock cannot be negative';
      this.isSaving = false;
      return;
    }

    const productData: IProduct = {
      ...this.formData,
      Product_Stock: newStock,
      _id: this.formData._id,
      Product_Price: Number(this.formData.Product_Price) || 0,
      Product_Reorder_Level: Number(this.formData.Product_Reorder_Level) || 0,
      // Add adjustment metadata
      adjustment: {
        type: this.adjustmentType,
        quantity: this.adjustmentQuantity,
        reason: this.adjustmentReason,
        date: new Date().toISOString()
      }
    };

    this.saved.emit(productData);
    this.isSaving = false;
    this.close();
  }

  // Helper methods
  getStockStatus(stock: number, reorderLevel: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock <= reorderLevel) return 'Low Stock';
    return 'In Stock';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getInitials(name: string): string {
    if (!name) return 'P';
    return name.charAt(0).toUpperCase();
  }

  formatCurrency(value: number): string {
    return '$' + (value || 0).toFixed(2);
  }

  // Check if form is valid
  isFormValid(): boolean {
    if (this.mode === 'adjust') {
      return this.adjustmentQuantity > 0 && !!this.adjustmentReason;
    }
    return !!this.formData.Product_Name;
  }

  // Get dialog title
  get dialogTitle(): string {
    return this.mode === 'view'
      ? 'Product Details'
      : 'Stock Adjustment';
  }

  // Get dialog description
  get dialogDescription(): string {
    return this.mode === 'view'
      ? 'View product information and stock details'
      : 'Adjust stock levels for this product';
  }
}