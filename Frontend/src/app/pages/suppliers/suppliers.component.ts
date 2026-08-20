import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ISupplier, ISupplierDetailsResponse, ISupplierProduct } from '../../core/Models/isupplier';
import { IProduct } from '../../core/Models/product.model';
import { SupplierDialog } from './supplier-dialog/supplier-dialog';
import { SupplierService } from '../../core/services/supplier-service';



@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SupplierDialog

  ],
  templateUrl: './suppliers.component.html',
  styleUrl : './suppliers.component.css'
})
export class SuppliersComponent implements OnInit{
  displayedColumns: string[] = ['supplier', 'contact', 'location', 'products', 'status', 'actions'];

  suppliers: ISupplier[] = []
  filteredSuppliers : ISupplier[] = [];
  loading = false;

  searchQuery = '';
  selectedStatus = ' ';
  selectedPaymentTerms = '';

  dialogMode: 'add' | 'edit' | 'view' = 'add';
  isDialogOpen: boolean = false;
  selectedSupplier: ISupplier | null = null;
  selectedProducts: ISupplierProduct[] = []
  constructor(private supplierServ: SupplierService) {}
  ngOnInit(): void {
   this.getSuppliers()
  }

  filterData() {
    const search = this.searchQuery.toLowerCase();
    this.filteredSuppliers = this.suppliers.filter(supplier =>{
      const matchSearch = supplier.Supplier_Company_Name.toLowerCase().includes(search);
      const matchPayment = !this.selectedPaymentTerms || supplier.Payment_Terms === this.selectedPaymentTerms;
      const matchStatus = !this.selectedStatus || this.selectedStatus === ' ' || supplier.Status === this.selectedStatus;
      return matchSearch && matchPayment && matchStatus;
    });
  }

  openDialog(mode: 'add' | 'edit' | 'view', supplier?: ISupplier) {
    this.dialogMode = mode;
    this.selectedSupplier = supplier || null;
    if(mode === 'view' && supplier){
      const foundSupplier = this.suppliers.find(s=> s._id === supplier._id)
      this.openView(supplier._id)
      return;
    }
    this.isDialogOpen = true;
  }
  clearFilters() : void{
    this.searchQuery = ''
    this.selectedPaymentTerms = ''
    this.selectedStatus = 'Active'
    
    this.filterData();
  }
  closeDialog(){
    this.isDialogOpen = false;
    this.selectedSupplier = null;
    this.selectedProducts = []
  }
  saveSupplier(supplier: ISupplier){
    
  }
  getLocationDisplay(address: ISupplier['Address']){
    if(!address) return '-';
    return [
      address.City,
      address.Country,
      
      address.Street
    ].filter(Boolean).join(' , ') || '-'
  }
  getStatusClass(status: ISupplier['Status']): string {
    return status === 'Active'
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';
  }

  getSuppliers(){
    this.loading = true;
    this.supplierServ.getSuppliers().subscribe({
      next :(response) =>{
        this.suppliers = response;
        this.filterData();
        this.loading = false;
      },
      error: (error) =>{
        console.log(error);
        this.loading = true;
        
      }
    })
  }
  updateSupplier(){

  }
  deleteSupplier(id: string){

  }
  openView(id: string): void {

    this.supplierServ.getSupplierById(id).subscribe({
  
      next: (response: ISupplierDetailsResponse) => {
          console.log('📦 FULL RESPONSE:', JSON.stringify(response, null, 2));
          console.log('🏢 SUPPLIER:', response.data);
          console.log('📦 PRODUCTS:', response.products);
          console.log('📦 PRODUCTS TYPE:', typeof response.products);
          console.log('📦 PRODUCTS LENGTH:', response.products?.length);
          console.log('📦 PRODUCTS IS ARRAY:', Array.isArray(response.products));
    
        this.selectedSupplier = response.data;
        this.selectedProducts = response.products;

        console.log(this.selectedProducts.length);
        
  
        this.dialogMode = 'view';
        this.isDialogOpen = true;
        
      },
  
      error: (err) => {
        console.error(err);
      }
  
    });
  }

}
