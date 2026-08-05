
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

import { FormsModule } from '@angular/forms';
import { ProductDialog } from './product-dialog/product-dialog';
import { ProductService } from '../../../core/services/product-service';
import { IProduct } from '../../../core/Models/product.model';
import { ICategories } from '../../../core/Models/categories';
import { CategoryService } from '../../../core/services/category-service';


@Component({
  selector: 'app-products',
  standalone: true,
    imports: [
      CommonModule,
      MatTableModule,
      MatButtonModule,
      MatIconModule,
      MatInputModule,
      MatSelectModule,
      MatCardModule,
      MatMenuModule,
      MatDialogModule,
      FormsModule,
      MatDividerModule,
    ],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class ProductsComponent implements OnInit {
  products: IProduct[] = []
  categories: ICategories[] = [];
  displayedColumns: string[] = ['product', 'productId', 'category', 'price', 'status', 'actions'];
  


  filteredProducts : IProduct[] = [];

  searchQuery = '';
  selectedCategory = 'All Categories';
  selectedStatus = 'All';
 

  constructor(private dialog: MatDialog, private productServ: ProductService, private categoryServ: CategoryService) {}
  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  filterData(): void {
    const search = this.searchQuery.toLowerCase();
  
    this.filteredProducts = this.products.filter(product => {
  
      const matchesSearch =
        product.Product_Name.toLowerCase().includes(search) ||
        product.categoryRef.Category_Name.toLowerCase().includes(search);
  
      const matchesCategory =
        this.selectedCategory === 'All Categories' ||
        product.categoryRef.Category_Name === this.selectedCategory;
  
      const matchesStatus =
        this.selectedStatus === 'All' ||
        product.Product_Status === this.selectedStatus;
  
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  openDialog(mode: 'add' | 'edit' | 'view', product?: IProduct) {
    const dialogRef= this.dialog.open(ProductDialog, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      autoFocus: false,
      panelClass: 'product-dialog',
      data: {
        mode,
        product: product || null
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return;
      }
  
      if (result.action === 'add') {
        this.addProduct(result.product);
      }
  
      if (result.action === 'edit') {
        this.updateProduct(result.product);
      }
  
    });
  }

  loadProducts(): void {
    this.productServ.getProducts().subscribe({
      next: (response) =>{
        this.products = response.data;
        console.log(response);
        this.filterData();
        
      }
    })
  }

  loadCategories(): void{
    this.categoryServ.getCategories().subscribe({
      next: (response)=>{
        this.categories = response.data
        console.log(response);
        
      }
    })
  }

  addProduct(product: IProduct) : void {
    this.productServ.addProduct(product).subscribe({
      next: (response)=>{
        console.log('Product Added', response);
        this.loadProducts()        
      },
      error: (error)=>{
        console.log('Error Adding Products', error);
        
      }
    })
  }
  
  updateProduct(product: IProduct): void {

    this.productServ.updateProduct(
      product._id,
      product
    ).subscribe({
      next: (response) => {
  
        console.log(response);
  
        this.loadProducts();
  
      },
  
      error: (error) => {
        console.error('Failed to update product', error);
      }
    });
  
  }

  deleteProduct(id: string): void {

    this.productServ.deleteProduct(id).subscribe({
      next: (response) => {
  
        console.log(response);
  
        this.loadProducts();
  
      },
  
      error: (error) => {
        console.error('Failed to delete product', error);
      }
    });
  
  }

}
