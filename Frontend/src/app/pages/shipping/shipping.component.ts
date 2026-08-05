import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IShipping } from '../../core/Models/ishipping';
import { ShippingService } from '../../core/services/shipping-service';

interface Shipping {
  id: string;
  orderId: string;
  mode: string;
  deliveryStatus: string;
  realDays: string;
  scheduledDays: string;
  risk: string;
}

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './shipping.html',
  styleUrl: './shipping.css'
})
export class ShippingComponent implements OnInit {
  displayedColumns: string[] = ['shippingId','orderId','mode','deliveryStatus','realDays','scheduledDays','risk','actions'];

  shipping:IShipping[]=[];

  filteredShipping:IShipping[]=[];
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;
  totalShippings = 0;
  
  searchQuery = '';
  selectedStatus = 'All';
  selectedMode = 'All';
  selectedRisk = 'All';

  constructor(private router: Router,private shippingServ: ShippingService) {}
  ngOnInit(): void {
    this.loadShipping();
  }

  applyFilters() {
    this.filteredShipping = this.shipping.filter(s => {
      const matchesSearch = s.Shipping_ID.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) || s.orderId.toString().toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.selectedStatus === 'All' || s.Delivery_Status === this.selectedStatus;
      const matchesMode = this.selectedMode === 'All' || s.Shipping_Mode === this.selectedMode;
      const matchesRisk = this.selectedRisk === 'All' || s.Late_delivery_risk === this.selectedRisk;
      return matchesSearch && matchesStatus && matchesMode && matchesRisk;
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedStatus = 'All';
    this.selectedMode = 'All';
    this.selectedRisk = 'All';
    this.applyFilters();
  }
  loadShipping(){

    this.shippingServ
      .getShippings(this.currentPage, this.pageSize)
      .subscribe(res => {
  
        this.shipping = res.data;
  
        this.filteredShipping = [...this.shipping];
  
        this.currentPage = res.pagination.currentPage;
        this.totalPages = res.pagination.totalPages;
        this.totalShippings = res.pagination.totalShippings;
  
      });
  
  }

  createShipping() { console.log('Create Shipping clicked'); }
  viewShipping(id: string) { console.log('View Shipping', id); }
  editShipping(id: string) { console.log('Edit Shipping', id); }
  deleteShipping(id: string){}
}
