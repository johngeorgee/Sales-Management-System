import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../../../core/Models/product.model';
import { ICategories } from '../../../../core/Models/categories';
import { CategoryService } from '../../../../core/services/category-service';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './product-dialog.html',
  styleUrl: './product-dialog.css',
})
export class ProductDialog implements OnInit {

  categories: ICategories[] = [];

  formData: any = {
    Product_Card_Id: null,
    Product_Name: '',
    Product_Price: null,
    Product_Status: 'Active',
    Product_Image: '',
    Product_Category_Id: null,
    categoryRef: null
  };

  constructor(
    public dialogRef: MatDialogRef<ProductDialog>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'add' | 'edit' | 'view';
      product: IProduct | null;
    },

    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {

    this.loadCategories();

    if (this.data.product) {

      this.formData = {
        Product_Card_Id: this.data.product.Product_Card_Id,
        Product_Name: this.data.product.Product_Name,
        Product_Price: this.data.product.Product_Price,
        Product_Status: this.data.product.Product_Status,
        Product_Image: this.data.product.Product_Image,
        Product_Category_Id: this.data.product.Product_Category_Id,
        categoryRef: this.data.product.categoryRef?._id
      };

    }
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

    if (!selectedCategory) {
      return;
    }

    this.formData.categoryRef = selectedCategory._id;
    this.formData.Product_Category_Id = selectedCategory.Category_Id;

  }

  save(): void {

    if (
      !this.formData.Product_Name ||
      !this.formData.Product_Price ||
      !this.formData.categoryRef
    ) {
      return;
    }

    this.dialogRef.close({
      action: this.data.mode,
      product: this.formData
    });

  }

  close(): void {
    this.dialogRef.close();
  }
}