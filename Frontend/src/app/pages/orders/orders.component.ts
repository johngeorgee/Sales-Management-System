import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IOrder } from '../../core/Models/iorder';
import { IOrderItem } from '../../core/Models/iorder-item';
import { OrderService } from '../../core/services/order-service';
import { OrderDialog } from './order-dialog/order-dialog';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OrderDialog
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class OrdersComponent implements OnInit, OnChanges {
  ngOnInit(): void {
    this.loadOrders();
  }
  constructor( private orderService: OrderService, private router: Router ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.loadOrders();
  }
  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  searchQuery = '';
  selectedStatus = 'All';
  dateFrom = '';
  dateTo = '';
  loading = false;
  currentPage = 1;
  pageSize = 15;
  totalPages = 1;
   totalOrders = 0;
   orderItems?: IOrderItem[]
  // Dialog
  
  isDialogOpen = false;

  dialogMode: 'add' | 'edit' | 'view' = 'add';

  selectedOrder: IOrder | null = null;
  loadOrders(): void {

    this.loading = true;

    this.orderService
      .getOrders(this.currentPage, this.pageSize)
      .subscribe({

        next: (response) => {

          this.orders = response.data;

          this.filteredOrders = [...this.orders];

          this.currentPage = response.pagination.currentPage;

          this.totalPages = response.pagination.totalPages;

          this.totalOrders = response.pagination.totalOrders;

          this.loading = false;

        },

        error: (err) => {

          console.error(err);

          this.loading = false;

        }

      });

  }
  applyFilters(): void {

    const search = this.searchQuery.toLowerCase();

    this.filteredOrders = this.orders.filter(order => {

      const matchesSearch =

        order.Order_Id.toString().includes(search) ||

        order.customerRef?.Customer_FullName
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =

        this.selectedStatus === 'All' ||

        order.Order_Status === this.selectedStatus;

      const orderDate = new Date(

        (order.order_date - 25569) * 86400 * 1000

      );

      const matchesFrom =

        !this.dateFrom ||

        orderDate >= new Date(this.dateFrom);

      const matchesTo =!this.dateTo || orderDate <= new Date(this.dateTo);
      return (

        matchesSearch &&

        matchesStatus &&

        matchesFrom &&

        matchesTo

      );

    });

  }
  clearFilters(): void {

    this.searchQuery = '';

    this.selectedStatus = 'All';

    this.dateFrom = '';

    this.dateTo = '';

    this.filteredOrders = [...this.orders];

  }
  formatDate(serial: number): string {

    if (!serial) {

      return '-';

    }

    return new Date(

      (serial - 25569) * 86400 * 1000

    ).toLocaleDateString();

  }
  openDialog(

    mode: 'add' | 'edit' | 'view',

    order?: IOrder

  ): void {

    this.dialogMode = mode;

    this.selectedOrder = order ?? null;

    this.isDialogOpen = true;

  }
  closeDialog(): void {

    this.isDialogOpen = false;

    this.selectedOrder = null;

  }
  createOrder(): void {

    this.openDialog('add');

  }
  viewOrder(id: string): void {

    const order = this.orders.find(

      o => o._id === id

    );

    if (!order) {

      return;

    }

    this.openDialog('view', order);

  }
  saveOrder(order: IOrder): void {

    if (this.dialogMode === 'add') {
  
      this.addOrder(order);
  
      return;
  
    }
  
    if (this.dialogMode === 'edit') {
  
      this.updateOrder(order);
  
      return;
  
    }
  
  }
  addOrder(order: IOrder): void {

    this.orderService
      .addOrder(order)
      .subscribe({
  
        next: () => {
  
          this.closeDialog();
  
          this.loadOrders();
  
        },
  
        error: (err) => {
  
          console.error(err);
  
        }
  
      });
  
  }
  updateOrder(order: IOrder): void {

    this.orderService
      .updateOrder(order._id, order)
      .subscribe({
  
        next: () => {
  
          this.closeDialog();
  
          this.loadOrders();
  
        },
  
        error: (err) => {
  
          console.error(err);
  
        }
  
      });
  
  }
  deleteOrder(id: string): void {

    const confirmed = confirm(
  
      'Are you sure you want to delete this order?'
  
    );
  
    if (!confirmed) {
  
      return;
  
    }
  
    this.orderService
      .deleteOrder(id)
      .subscribe({
  
        next: () => {
  
          this.loadOrders();
  
        },
  
        error: (err) => {
  
          console.error(err);
  
        }
  
      });
  
  }
  nextPage(): void {

    if (
  
      this.currentPage >= this.totalPages
  
    ) {
  
      return;
  
    }
  
    this.currentPage++;
  
    this.loadOrders();
  
  }
  previousPage(): void {

    if (
  
      this.currentPage <= 1
  
    ) {
  
      return;
  
    }
  
    this.currentPage--;
  
    this.loadOrders();
  
  }
  editOrder(order: IOrder): void {

    this.selectedOrder = { ...order };
  
    this.dialogMode = 'edit';
  
    this.isDialogOpen = true;
  
  }
}