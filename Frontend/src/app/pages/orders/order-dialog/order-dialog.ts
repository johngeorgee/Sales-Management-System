import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IOrder } from '../../../core/Models/iorder';
import { ICustomer } from '../../../core/Models/icustomer';
import { IShipping } from '../../../core/Models/ishipping';

import { CustomerService } from '../../../core/services/customer-service';
import { ShippingService } from '../../../core/services/shipping-service';

@Component({
  selector: 'app-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  
  templateUrl: './order-dialog.html',
  styleUrl: './order-dialog.css'
})
export class OrderDialog implements OnInit, OnChanges {

  @Input() isOpen = false;

  @Input() mode: 'add' | 'edit' | 'view' = 'add';

  @Input() order: IOrder | null = null;

  @Output() closed = new EventEmitter<void>();

  @Output() saved = new EventEmitter<IOrder>();

  customers: ICustomer[] = [];

  shippingOptions: IShipping[] = [];
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;
  totalShippings = 0;
  formData: any = {
    Order_Id: null,
    Customer_Id: null,
    Shipping_ID: null,

    order_date: null,
    order_date_ui: '',

    shipping_date: null,

    Order_Status: 'Pending Payment',

    Order_City: '',
    Order_State: '',
    Order_Country: '',
    Order_Region: '',

    Market: '',
    Type: '',

    customerRef: '',
    shippingRef: ''
  };

  constructor(
    private customerService: CustomerService,
    private shippingService: ShippingService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order'] && this.order) {
      this.fillForm();
    }
  }

  ngOnInit(): void {

    this.loadCustomers();

    this.loadShippingOptions();

    if (this.order) {
      this.fillForm();
    }

  }

  fillForm(): void {

    this.formData = {

      Order_Id: this.order?.Order_Id,

      Customer_Id: this.order?.Customer_Id,

      Shipping_ID: this.order?.Shipping_ID,

      order_date: this.order?.order_date,

      order_date_ui: this.toDateInput(this.order?.order_date),

      shipping_date: this.order?.shipping_date,

      Order_Status: this.order?.Order_Status,

      Order_City: this.order?.Order_City,

      Order_State: this.order?.Order_State,

      Order_Country: this.order?.Order_Country,

      Order_Region: this.order?.Order_Region,

      Market: this.order?.Market,

      Type: this.order?.Type,

      customerRef: this.order?.customerRef?._id ?? '',

      shippingRef: this.order?.shippingRef?._id ?? ''

    };

  }

  loadCustomers(): void {

    this.customerService.getCustomers().subscribe({

      next: (customers) => {

        this.customers = customers;

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  loadShippingOptions(): void {

    this.shippingService.getShippings(this.currentPage, this.pageSize).subscribe({

      next: (response) => {

        this.shippingOptions = response.data;
        
      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  onCustomerChange(customerId: string): void {

    const customer = this.customers.find(

      c => c._id === customerId

    );

    if (!customer) {
      return;
    }

    this.formData.customerRef = customer._id;

    this.formData.Customer_Id = customer.Customer_ID;

  }

  onShippingChange(shippingId: string): void {

    const shipping = this.shippingOptions.find(

      s => s._id === shippingId

    );

    if (!shipping) {
      return;
    }

    this.formData.shippingRef = shipping._id;

    this.formData.Shipping_ID = shipping.Shipping_ID;

  }

  save(): void {

    if (

      !this.formData.Customer_Id ||

      !this.formData.Shipping_ID ||

      !this.formData.order_date_ui

    ) {

      return;

    }

    this.formData.order_date = this.toExcelDate(

      this.formData.order_date_ui

    );

    this.saved.emit(this.formData);

    this.close();

  }

  close(): void {

    this.closed.emit();

  }

  formatExcelDate(serial: number | null | undefined): string {

    if (!serial) {

      return '-';

    }

    return new Date(

      (serial - 25569) * 86400 * 1000

    ).toLocaleDateString();

  }

  toDateInput(serial: number | null | undefined): string {

    if (!serial) {

      return '';

    }

    const date = new Date(

      (serial - 25569) * 86400 * 1000

    );

    return date.toISOString().split('T')[0];

  }

  toExcelDate(date: string): number {

    const jsDate = new Date(date);

    return Math.floor(

      jsDate.getTime() / 86400000 + 25569

    );

  }

}