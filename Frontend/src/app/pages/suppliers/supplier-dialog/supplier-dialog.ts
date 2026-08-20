import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ISupplier, ISupplierProduct } from '../../../core/Models/isupplier';

@Component({
  selector: 'app-supplier-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-dialog.html',
  styleUrl: './supplier-dialog.css',
})
export class SupplierDialog implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'add' | 'edit' | 'view' = 'add';
  @Input() supplier: ISupplier | null = null;
  @Input() products: ISupplierProduct[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<ISupplier>();

  isSaving = false;
  formData: any = {
    Supplier_Company_Name: '',
    Business_Id: 0,
    Contact_Info: {
      Contact_Person: '',
      Email: '',
      Phone_Number: ''
    },
    Address: {
      Street: '',
      City: '',
      State: '',
      Country: '',
      ZipCode: ''
    },
    Payment_Terms: 'Cash',
    Notes: '',
    Status: 'Active'
  };

  ngOnChanges(changes: SimpleChanges): void {
    console.log('🔄 SupplierDialog - ngOnChanges called');
    
    if (changes['products']) {
      console.log('📦 Products changed in dialog:', this.products);
      console.log('📦 Products length in dialog:', this.products?.length);
    }

    if (changes['supplier']) {
      console.log('🏢 Supplier changed in dialog:', this.supplier);
    }

    if (changes['mode']) {
      console.log('🔄 Mode changed to:', this.mode);
    }

    if (changes['isOpen']) {
      console.log('🚪 Dialog isOpen changed to:', this.isOpen);
    }

    // Populate form data for add/edit modes
    if (this.mode === 'edit' && this.supplier) {
      this.formData = structuredClone(this.supplier);
    } else if (this.mode === 'add') {
      this.formData = {
        Supplier_Company_Name: this.supplier?.Supplier_Company_Name || '',
        Business_Id: this.supplier?.Business_Id || 0,
        Contact_Info: {
          Contact_Person: this.supplier?.Contact_Info?.Contact_Person || '',
          Email: this.supplier?.Contact_Info?.Email || '',
          Phone_Number: this.supplier?.Contact_Info?.Phone_Number || ''
        },
        Address: {
          Street: this.supplier?.Address?.Street || '',
          City: this.supplier?.Address?.City || '',
          State: this.supplier?.Address?.State || '',
          Country: this.supplier?.Address?.Country || '',
          ZipCode: this.supplier?.Address?.ZipCode || ''
        },
        Payment_Terms: this.supplier?.Payment_Terms || 'Cash',
        Notes: this.supplier?.Notes || '',
        Status: this.supplier?.Status || 'Active'
      };
    }
  }

  close(): void {
    this.closed.emit();
  }

  save() {
    if (this.isSaving) {
      return;
    }
    this.isSaving = true;
    this.saved.emit(this.formData);
    this.close();
  }
}