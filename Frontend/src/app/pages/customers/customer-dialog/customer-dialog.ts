// customer-dialog/customer-dialog.ts
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICustomer, customerSegment } from '../../../core/Models/icustomer';

@Component({
  selector: 'app-customer-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-dialog.html'
})
export class CustomerDialogComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'add' | 'edit' | 'view' = 'add';
  @Input() customer: ICustomer | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<ICustomer>();

  formData: any = {
    Customer_Id: null,
    Customer_FullName: '',
    Customer_Segment: 'Consumer',
    location: {
      Customer_City: '',
      Customer_State: '',
      Customer_Country: '',
      Customer_Street: '',
      Customer_Zipcode: '',
      Latitude: 0,
      Longitude: 0
    }
  };

  isSaving = false;
  errorMessage = '';

  // Segment options
  segmentOptions = ['Consumer', 'Corporate', 'Home Office'];

  ngOnInit(): void {
    if (this.customer) {
      this.fillForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customer'] && this.customer) {
      this.fillForm();
    }
    if (changes['mode']) {
      this.errorMessage = '';
      this.isSaving = false;
      if (this.mode === 'add') {
        this.resetForm();
      }
    }
  }

  fillForm(): void {
    if (!this.customer) return;

    this.formData = {
      Customer_Id: this.customer.Customer_Id || null,
      Customer_FullName: this.customer.Customer_FullName || '',
      Customer_Segment: this.customer.Customer_Segment || 'Consumer',
      location: {
        Customer_City: this.customer.location?.Customer_City || '',
        Customer_State: this.customer.location?.Customer_State || '',
        Customer_Country: this.customer.location?.Customer_Country || '',
        Customer_Street: this.customer.location?.Customer_Street || '',
        Customer_Zipcode: this.customer.location?.Customer_Zipcode || '',
        Latitude: this.customer.location?.Latitude || 0,
        Longitude: this.customer.location?.Longitude || 0
      }
    };
  }

  resetForm(): void {
    this.formData = {
      Customer_Id: null,
      Customer_FullName: '',
      Customer_Segment: 'Consumer',
      location: {
        Customer_City: '',
        Customer_State: '',
        Customer_Country: '',
        Customer_Street: '',
        Customer_Zipcode: '',
        Latitude: 0,
        Longitude: 0
      }
    };
    this.errorMessage = '';
  }

  close(): void {
    this.closed.emit();
  }

  save(): void {
    // Validation
    if (!this.formData.Customer_FullName || !this.formData.Customer_FullName.trim()) {
      this.errorMessage = 'Customer name is required';
      return;
    }

    if (!this.formData.Customer_Segment) {
      this.errorMessage = 'Segment is required';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const customerData: ICustomer = {
      _id: this.customer?._id || '',
      Customer_Id: Number(this.formData.Customer_Id) || Date.now(),
      Customer_FullName: this.formData.Customer_FullName.trim(),
      Customer_Segment: this.formData.Customer_Segment,
      location: {
        Customer_ID: Number(this.formData.Customer_Id) || Date.now(),
        Customer_City: this.formData.location.Customer_City || '',
        Customer_State: this.formData.location.Customer_State || '',
        Customer_Country: this.formData.location.Customer_Country || '',
        Customer_Street: this.formData.location.Customer_Street || '',
        Customer_Zipcode: this.formData.location.Customer_Zipcode || '',
        Latitude: this.formData.location.Latitude || 0,
        Longitude: this.formData.location.Longitude || 0
      }
    };

    this.saved.emit(customerData);
    this.isSaving = false;
    this.close();
  }
}