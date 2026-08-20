import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICustomer, customerSegment } from '../../core/Models/icustomer';
import { CustomerService, CustomerResponse } from '../../core/services/customer-service';
import { CustomerLocationService } from '../../core/services/customer-location-service';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomerDialogComponent
  ],
  templateUrl: './customers.html'
})
export class CustomersComponent implements OnInit {
  customers: ICustomer[] = [];
  filteredCustomers: ICustomer[] = [];
  loading = false;

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;
  totalCustomers = 0;

  // Filters
  searchQuery = '';
  selectedSegment = 'All Segments';

  // Dialog
  isDialogOpen = false;
  dialogMode: 'add' | 'edit' | 'view' = 'add';
  selectedCustomer: ICustomer | null = null;

  constructor(
    private customerService: CustomerService,
    private locationService: CustomerLocationService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getCustomers(this.currentPage, this.pageSize).subscribe({
      next: (response: CustomerResponse) => {
        this.customers = response.data;
        this.filteredCustomers = [...this.customers];
        this.currentPage = response.pagination.currentPage;
        this.totalPages = response.pagination.totalPages;
        this.totalCustomers = response.pagination.totalCustomers;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    const search = this.searchQuery.toLowerCase();
    this.filteredCustomers = this.customers.filter(c => {
      const matchesSearch =
        c.Customer_FullName.toLowerCase().includes(search) ||
        c.Customer_Id.toString().includes(search);

      const matchesSegment =
        this.selectedSegment === 'All Segments' ||
        c.Customer_Segment === this.selectedSegment;

      return matchesSearch && matchesSegment;
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedSegment = 'All Segments';
    this.applyFilters();
  }

  // Dialog Methods
  openDialog(mode: 'add' | 'edit' | 'view', customer?: ICustomer): void {
    this.dialogMode = mode;
    this.selectedCustomer = customer || null;
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.selectedCustomer = null;
  }

  createCustomer(): void {
    this.openDialog('add');
  }

  viewCustomer(id: string): void {
    const customer = this.customers.find(c => c._id === id);
    if (!customer) return;
    this.openDialog('view', customer);
  }

  editCustomer(customer: ICustomer): void {
    this.openDialog('edit', customer);
  }

  saveCustomer(customerData: any): void {
    if (this.dialogMode === 'add') {
      this.addCustomer(customerData);
    } else if (this.dialogMode === 'edit') {
      this.updateCustomer(customerData);
    }
  }

  // CRUD Operations
  addCustomer(customer: ICustomer): void {
    this.customerService.addCustomer(customer).subscribe({
      next: () => {
        this.closeDialog();
        this.loadCustomers();
      },
      error: (err) => {
        console.error('Error adding customer:', err);
      }
    });
  }

  updateCustomer(customer: ICustomer): void {
    this.customerService.updateCustomer(customer._id!, customer).subscribe({
      next: () => {
        this.closeDialog();
        this.loadCustomers();
      },
      error: (err) => {
        console.error('Error updating customer:', err);
      }
    });
  }

  deleteCustomer(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this customer?');
    if (!confirmed) return;

    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
        this.loadCustomers();
      },
      error: (err) => {
        console.error('Error deleting customer:', err);
      }
    });
  }

  // Pagination
  nextPage(): void {
    if (this.currentPage >= this.totalPages) return;
    this.currentPage++;
    this.loadCustomers();
  }

  previousPage(): void {
    if (this.currentPage <= 1) return;
    this.currentPage--;
    this.loadCustomers();
  }

  getInitials(name: string): string {
    if (!name) return 'C';
    return name.charAt(0).toUpperCase();
  }
}