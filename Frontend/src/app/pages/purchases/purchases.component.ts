import { Component, OnInit } from '@angular/core';
import { CommonModule, formatCurrency } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { IPurchase, PurchaseStatus } from '../../core/Models/IPurchase';
import { PurchaseService } from '../../core/services/purchase-service';
import { PurchaseDialogComponent } from './purchase-dialog/purchase-dialog';




type PurchaseDialogMode = 'create' | 'view' | 'edit'

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PurchaseDialogComponent
  ],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.css'

})
export class PurchasesComponent implements OnInit {
  purchase: IPurchase[] = []
  searchQuery: string = '';
  selectedStatus: PurchaseStatus | '' = '';
  loading: boolean = false;
  errorMessage: string = '';
  readonly statuses: PurchaseStatus[] = ['Draft', 'Pending', 'Approved', 'Received', 'Cancelled'];
  showPurchaseDialog = false;
  purchaseDialogMode: PurchaseDialogMode = 'create';
  selectedPurchase: IPurchase | null = null;
  constructor(
    private readonly purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
    this.loadPurchases();
  }
  loadPurchases(): void {
    this.loading = true;
    this.errorMessage = '';

    this.purchaseService.getPurchases().subscribe({
      next: (response) => {
        this.purchase = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('error loading purchases', error);
        this.errorMessage = 'Failed to load purchases';
        this.loading = false;
      }
    });
  }

  get filteredPurchases(): IPurchase[] {
    return this.purchase.filter(p => {
      const matchesSearch = !this.searchQuery ||
        p.Purchase_Order_Business_Id.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.supplierRef?.Supplier_Company_Name.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = !this.selectedStatus || p.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    })
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.loadPurchases();
  }

  formatDate(date?: string): string {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return date;
    }

  }
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
    }).format(amount);
  }

  getStatusClasses(status: PurchaseStatus): string {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Received':
        return 'bg-purple-100 text-purple-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  openCreateDialog(): void {
    this.purchaseDialogMode = 'create';
    this.selectedPurchase = null;
    this.showPurchaseDialog = true;
  }
  openViewDialog(
    purchase: IPurchase
  ): void {

    this.selectedPurchase = purchase;

    this.purchaseDialogMode = 'view';

    this.showPurchaseDialog = true;
  }

  openEditDialog(
    purchase: IPurchase
  ): void {

    if (
      purchase.status === 'Received' ||
      purchase.status === 'Cancelled'
    ) {

      alert(
        `Cannot edit a purchase with status ${purchase.status}.`
      );

      return;

    }


    this.selectedPurchase = purchase;

    this.purchaseDialogMode = 'edit';

    this.showPurchaseDialog = true;

  }

  deletePurchase(purchase: IPurchase): void {

    const confirmed = confirm(
      `Are you sure you want to delete PO-${purchase.Purchase_Order_Business_Id}?`
    );

    if (!confirmed) {
      return;
    }

    this.purchaseService.deletePurchase(purchase._id).subscribe({

      next: () => {
        this.loadPurchases();
      },

      error: (error) => {
        console.error('Error deleting purchase:', error);

        this.errorMessage =
          error?.error?.message ||
          'Failed to delete purchase';
      }

    });
  }

  closePurchaseDialog(): void {

    this.showPurchaseDialog = false;

    this.selectedPurchase = null;

  }

  handlePurchaseSave(payload: any): void {
    if (this.purchaseDialogMode === 'create') {
      this.purchaseService.createPurchase(payload).subscribe({
        next: (response) => {
          console.log('Purchase created:', response);
          this.closePurchaseDialog();
          this.loadPurchases();
        },
        error: (err) => {
          console.error('error creating purchase', err);
        }
      });
    } else if (this.purchaseDialogMode === 'edit') {
      this.purchaseService.updatePurchase(this.selectedPurchase!._id, payload).subscribe({
        next: (response) => {
          console.log('Purchase updated:', response);

          this.closePurchaseDialog();

          this.loadPurchases();
        },
        error: (err) => {
          console.error('error updating purchase', err);
        }
      });
    }
  }





}
