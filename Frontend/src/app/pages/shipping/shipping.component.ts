// shipping.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IShipping, deliveryStatus, shippingMode, deliveryRisk, ShippingResponse } from '../../core/Models/ishipping';
import { ShippingService } from '../../core/services/shipping-service';
import { ShippingDialog } from './shipping-dialog/shipping-dialog';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ShippingDialog
  ],
  templateUrl: './shipping.html',
  styleUrl: './shipping.css'
})
export class ShippingComponent implements OnInit {
  shipping: IShipping[] = [];
  filteredShipping: IShipping[] = [];
  loading = false;

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;
  totalShippings = 0;

  // Filters
  searchQuery = '';
  selectedStatus = 'All';
  selectedMode = 'All';
  selectedRisk = 'All';

  // Dialog
  isDialogOpen = false;
  dialogMode: 'add' | 'edit' | 'view' = 'add';
  selectedShipping: IShipping | null = null;

  constructor(
    private router: Router,
    private shippingService: ShippingService
  ) {}

  ngOnInit(): void {
    this.loadShipping();
  }

  loadShipping(): void {
    this.loading = true;
    this.shippingService
      .getShippings(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: ShippingResponse) => {
          this.shipping = response.data;
          this.filteredShipping = [...this.shipping];
          this.currentPage = response.pagination.currentPage;
          this.totalPages = response.pagination.totalPages;
          this.totalShippings = response.pagination.totalShippings;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading shipping:', err);
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    const search = this.searchQuery.toLowerCase();
    this.filteredShipping = this.shipping.filter(s => {
      const matchesSearch =
        s.Shipping_ID.toString().toLowerCase().includes(search) ||
        s.Shipping_Mode.toLowerCase().includes(search) ||
        s.Delivery_Status.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        s.Delivery_Status === this.selectedStatus;

      const matchesMode =
        this.selectedMode === 'All' ||
        s.Shipping_Mode === this.selectedMode;

      const matchesRisk =
        this.selectedRisk === 'All' ||
        s.Late_delivery_risk === this.selectedRisk;

      return matchesSearch && matchesStatus && matchesMode && matchesRisk;
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = 'All';
    this.selectedMode = 'All';
    this.selectedRisk = 'All';
    this.applyFilters();
  }

  // Dialog Methods
  openDialog(mode: 'add' | 'edit' | 'view', shipping?: IShipping): void {
    this.dialogMode = mode;
    this.selectedShipping = shipping || null;
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.selectedShipping = null;
  }

  createShipping(): void {
    this.openDialog('add');
  }

  viewShipping(id: string): void {
    const shipping = this.shipping.find(s => s._id === id);
    if (!shipping) return;
    this.openDialog('view', shipping);
  }

  editShipping(shipping: IShipping): void {
    this.openDialog('edit', shipping);
  }

  saveShipping(shippingData: any): void {
    if (this.dialogMode === 'add') {
      this.addShipping(shippingData);
    } else if (this.dialogMode === 'edit') {
      this.updateShipping(shippingData);
    }
  }

  // CRUD Operations
  addShipping(shipping: IShipping): void {
    this.shippingService.addShipping(shipping).subscribe({
      next: () => {
        this.closeDialog();
        this.loadShipping();
      },
      error: (err) => {
        console.error('Error adding shipping:', err);
      }
    });
  }

  updateShipping(shipping: IShipping): void {
    this.shippingService.updateShipping(shipping._id, shipping).subscribe({
      next: () => {
        this.closeDialog();
        this.loadShipping();
      },
      error: (err) => {
        console.error('Error updating shipping:', err);
      }
    });
  }

  deleteShipping(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this shipping record?');
    if (!confirmed) return;

    this.shippingService.deleteShipping(id).subscribe({
      next: () => {
        this.loadShipping();
      },
      error: (err) => {
        console.error('Error deleting shipping:', err);
      }
    });
  }

  // Pagination
  nextPage(): void {
    if (this.currentPage >= this.totalPages) return;
    this.currentPage++;
    this.loadShipping();
  }

  previousPage(): void {
    if (this.currentPage <= 1) return;
    this.currentPage--;
    this.loadShipping();
  }

  // Helper methods for template
  getStatusClass(status: string): string {
    const classes = {
      'Advance Shipping': 'bg-green-100 text-green-800',
      'Shipping On Time': 'bg-blue-100 text-blue-800',
      'Late Delivery': 'bg-yellow-100 text-yellow-800',
      'Shipping Cancelled': 'bg-red-100 text-red-700'
    };
    return classes[status as keyof typeof classes] || '';
  }

  getRiskClass(risk: string): string {
    const classes = {
      'No Risk': 'bg-green-100 text-green-800',
      'High Risk': 'bg-red-100 text-red-700'
    };
    return classes[risk as keyof typeof classes] || '';
  }
}