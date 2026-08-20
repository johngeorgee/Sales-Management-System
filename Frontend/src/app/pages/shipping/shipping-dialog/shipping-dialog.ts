import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IShipping, deliveryStatus, shippingMode, deliveryRisk } from '../../../core/Models/ishipping';

@Component({
  selector: 'app-shipping-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shipping-dialog.html'
})
export class ShippingDialog implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'add' | 'edit' | 'view' = 'add';
  @Input() shipping: IShipping | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<IShipping>();

  formData: any = {
    Shipping_ID: null,
    Shipping_Mode: '',
    Delivery_Status: '',
    Days_for_shipping_real: 0,
    Days_for_shipment_scheduled: 0,
    Late_delivery_risk: ''
  };

  isSaving = false;
  errorMessage = '';

  // Available options for dropdowns
  deliveryStatusOptions = Object.values(deliveryStatus);
  shippingModeOptions = Object.values(shippingMode);
  deliveryRiskOptions = Object.values(deliveryRisk);

  ngOnInit(): void {
    if (this.shipping) {
      this.fillForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shipping'] && this.shipping) {
      this.fillForm();
    }
    if (changes['mode']) {
      this.errorMessage = '';
      this.isSaving = false;
      // Reset form when switching to add mode
      if (this.mode === 'add') {
        this.resetForm();
      }
    }
  }

  fillForm(): void {
    if (!this.shipping) return;

    this.formData = {
      Shipping_ID: this.shipping.Shipping_ID || null,
      Shipping_Mode: this.shipping.Shipping_Mode || '',
      Delivery_Status: this.shipping.Delivery_Status || '',
      Days_for_shipping_real: this.shipping.Days_for_shipping_real || 0,
      Days_for_shipment_scheduled: this.shipping.Days_for_shipping_scheduled || 0,
      Late_delivery_risk: this.shipping.Late_delivery_risk || ''
    };
  }

  resetForm(): void {
    this.formData = {
      Shipping_ID: null,
      Shipping_Mode: '',
      Delivery_Status: '',
      Days_for_shipping_real: 0,
      Days_for_shipment_scheduled: 0,
      Late_delivery_risk: ''
    };
    this.errorMessage = '';
  }

  close(): void {
    this.closed.emit();
  }

  save(): void {
    // Validation
    if (!this.formData.Shipping_ID) {
      this.errorMessage = 'Shipping ID is required';
      return;
    }

    if (!this.formData.Shipping_Mode) {
      this.errorMessage = 'Shipping Mode is required';
      return;
    }

    if (!this.formData.Delivery_Status) {
      this.errorMessage = 'Delivery Status is required';
      return;
    }

    if (!this.formData.Late_delivery_risk) {
      this.errorMessage = 'Risk is required';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const shippingData: IShipping = {
      _id: this.shipping?._id || '',
      Shipping_ID: Number(this.formData.Shipping_ID),
      Shipping_Mode: this.formData.Shipping_Mode as shippingMode,
      Delivery_Status: this.formData.Delivery_Status as deliveryStatus,
      Days_for_shipping_real: Number(this.formData.Days_for_shipping_real) || 0,
      Days_for_shipping_scheduled: Number(this.formData.Days_for_shipment_scheduled) || 0,
      Late_delivery_risk: this.formData.Late_delivery_risk as deliveryRisk,
      orderId: 0 // This will be set by backend
    };

    this.saved.emit(shippingData);
    this.isSaving = false;
    this.close();
  }
}