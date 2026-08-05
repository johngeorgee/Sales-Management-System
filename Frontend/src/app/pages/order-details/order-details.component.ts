import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button' ;
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';   
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IOrderItem } from '../../core/Models/iorder-item';
import { IOrder, OrderStatus } from '../../core/Models/iorder';
import { OrderService } from '../../core/services/order-service';
import { OrderItemService } from '../../core/services/order-item-service';
import { OrderDialog } from '../orders/order-dialog/order-dialog';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetailsComponent implements OnInit {
  displayedItemColumns: string[] = ['product', 'productId', 'unitPrice', 'quantity', 'discount', 'discountRate', 'grossSales', 'salesPerCustomer', 'benefitPerOrder'];
  order: IOrder = {} as IOrder;
  orderItems: IOrderItem[] = []
  orderItem: IOrderItem= {} as IOrderItem;


  // State
  orderId = '';
  loadingOrder = false;
  loadingItems = false;
  errorMessage = '';

  // Pagination
  currentItemPage = 1;
  itemPageSize = 50;
  totalItemPages = 0;
  totalOrderItems = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderServ: OrderService,
    private o_itemServ: OrderItemService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.errorMessage = 'Order ID not found';
        return;
      }
      this.orderId = id;
      this.loadOrder();
    });
  }

  // Status formatting
  statusClass(status: string): string {
    switch (status) {
      case 'Pending Payment': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return '';
    }
  }

  formatStatus(status: string): string {
    if (!status) {
      return '';
    }
    const normalized = status.toUpperCase();
    switch (normalized) {
      case 'PENDING_PAYMENT':
      case 'PENDING PAYMENT':
        return 'Pending Payment';
      case 'PROCESSING':
        return 'Processing';
      case 'COMPLETE':
        return 'Complete';
      case 'CLOSED':
        return 'Closed';
      default:
        return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  // Load order
  loadOrder(): void {
    this.loadingOrder = true;
    this.errorMessage = '';
    this.o_itemServ.getItemsByOrder(this.orderId)
      .subscribe({
        next: (value) => {
          this.orderItems = value.data;
          this.loadingOrder = false;
        },
        error: (error) => {
          console.log('Failed To Load Order', error);
          this.errorMessage = 'Failed to load order details';
          this.loadingOrder = false;
        }
      });
  }

  // Load order items
  loadOrderItems(): void {
    if (!this.order) {
      return;
    }
    this.loadingItems = true;
    this.o_itemServ.getItemsByOrder(this.order._id, this.currentItemPage, this.itemPageSize)
      .subscribe({
        next: (value) => {
          this.orderItems = value.data;
          if (value.pagination) {
            this.totalOrderItems = value.pagination.totalOrderItems;
            this.totalItemPages = value.pagination.totalPages;
          }
          this.loadingItems = false;
        },
        error: (err) => {
          console.log('Failed to Load Order Items', err);
          this.errorMessage = 'Failed to load order items';
          this.loadingItems = false;
        }
      });
  }

  // Pagination for order items
  nextItemPage(): void {
    if (this.currentItemPage < this.totalItemPages) {
      this.currentItemPage++;
      this.loadOrderItems();
    }
  }

  previousItemPage(): void {
    if (this.currentItemPage > 1) {
      this.currentItemPage--;
      this.loadOrderItems();
    }
  }

  // Date formatting
  formatOrderDate(orderDate: number): string {
    if (!orderDate) {
      return '-';
    }
    const date = new Date((orderDate - 25569) * 86400 * 1000);
    return date.toLocaleDateString();
  }

  // Edit order - use dialog for consistency with Orders component
  editOrder(): void {
    if (!this.order) {
      return;
    }
    this.dialog.open(OrderDialog, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      autoFocus: false,
      panelClass: 'order-dialog',
      data: {
        mode: 'edit',
        order: this.order
      }
    });
  }

  // Delete order
  deleteOrder(): void {
    if (!this.order) {
      return;
    }

    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    this.orderServ.deleteOrder(this.order._id).subscribe({
      next: (response) => {
        console.log('Order deleted successfully');
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        console.error('Error deleting order', error);
        this.errorMessage = 'Failed to delete order';
      }
    });
  }

  // Calculate subtotal (sum of sales per customer)
  getSubtotal(): number {
    return this.orderItems.reduce(
      (total, item) => total + (item.Sales_per_Customer || 0),
      0
    );
  }

  // Calculate discount (sum of item discounts)
  getDiscount(): number {
    return this.orderItems.reduce(
      (total, item) => total + (item.Order_Item_Discount || 0),
      0
    );
  }

  // Calculate total (subtotal - discount)
  getTotal(): number {
    return this.getSubtotal() - this.getDiscount();
  }

  // View customer
  viewCustomer(): void {
    if (!this.order?.customerRef?._id) {
      return;
    }

    this.router.navigate([
      '/customers',
      this.order.customerRef._id
    ]);
  }

  // View shipping
  viewShipping(): void {
    if (!this.order.shippingRef._id) {
      return;
    }

    this.router.navigate([
      '/shipping',
      this.order.shippingRef._id
    ]);
  }
}