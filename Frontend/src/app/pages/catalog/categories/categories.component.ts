import { MatDividerModule } from '@angular/material/divider';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
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
  templateUrl: './categories.html' ,
  styleUrl: './categories.css'
})
export class CategoriesComponent implements OnInit {
  products: IProduct[] = []
  categories: ICategories[] = []
  
  displayedColumns: string[] = ['category', 'categoryId', 'products', 'Department', 'actions'];
  
 
  filteredCategories: ICategories[] = [];

  searchQuery = '';


  constructor(private dialog: MatDialog, private productServ: ProductService, private categoryServ:CategoryService) {}
  ngOnInit(): void {
   this.loadCategories();
   this.loadProducts();
  }

  filterData() : void {
    const search = this.searchQuery.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>{
      const matchesSearch = category.Category_Name.toLowerCase().includes(search);
      return matchesSearch;
    })
   

  }

  openDialog(mode: 'add' | 'edit' | 'view', category?: ICategories) {
    const dialogRef = this.dialog.open(CategoryDialog, {
      width: '400px',
      data: { mode, category: category || null }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        console.log("Action Not Completed");
        
        return;
      }
  
      if (result.action === 'add') {
        this.addCategory(result.category);
      }
  
      if (result.action === 'edit') {
        this.updateCategory(result.category);
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
        console.log(response); console.log(
          'DEPARTMENT:',
          this.categories[0]?.departmentRef
        );
        console.log(
          'DEPARTMENT NAME:',
          this.categories[0]?.departmentRef?.Department_Name
        );
        this.filterData()
      }
    })
  }

  addCategory(category: ICategories) : void {
    this.categoryServ.addCategory(category).subscribe({
      next: (response)=>{
        console.log('Category Added', response);
        this.loadCategories()        
      },
      error: (error)=>{
        console.log('Error Adding Category', error);
        
      }
    })
  }
  
  updateCategory(category: ICategories): void {

    this.categoryServ.updateCategory(
      category._id,
      category
    ).subscribe({
      next: (response) => {
  
        console.log(response);
  
        this.loadCategories();
  
      },
  
      error: (error) => {
        console.error('Failed to update category', error);
      }
    });
  
  }

  deleteCategory(id: string): void {

    this.categoryServ.deleteCategory(id).subscribe({
      next: (response) => {
          console.log(response);
          this.loadCategories();
  
      },
  
      error: (error) => {
        console.error('Failed to delete category', error);
      }
    });
  
  }
  getProductCount(categoryId: number): number {
    return this.products.filter(
      product => product.categoryRef.Category_Id === categoryId
    ).length;
  }

}
