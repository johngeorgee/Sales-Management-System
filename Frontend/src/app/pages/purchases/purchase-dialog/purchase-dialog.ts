import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../../core/services/product-service';
import { SupplierService } from '../../../core/services/supplier-service';

import { IProduct } from '../../../core/Models/product.model';
import { ISupplier } from '../../../core/Models/isupplier';
import { IPurchase } from '../../../core/Models/IPurchase';


interface PurchaseItemForm {

  productRef: string;

  quantity: number;

  unitPrice: number;

  discount: number;

}


type PurchaseDialogMode =
  'create' |
  'view' |
  'edit';


@Component({
  selector: 'app-purchase-dialog',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './purchase-dialog.html',

  styleUrls: [
    './purchase-dialog.css'
  ]
})
export class PurchaseDialogComponent
  implements OnInit {



  // Inputs


  @Input()
  mode: PurchaseDialogMode = 'create';


  @Input()
  purchase: IPurchase | null = null;



  // Outputs


  @Output()
  close = new EventEmitter<void>();


  @Output()
  save = new EventEmitter<any>();



  // Data


  products: IProduct[] = [];

  suppliers: ISupplier[] = [];


  loadingSuppliers = false;

  loadingProducts = false;



  // Form


  purchaseOrderBusinessId:
    number | null = null;


  supplierRef = '';


  deliveryTime = '';


  items: PurchaseItemForm[] = [

    {

      productRef: '',

      quantity: 1,

      unitPrice: 0,

      discount: 0

    }

  ];



  // Constructor


  constructor(

    private productService: ProductService,

    private supplierService: SupplierService

  ) { }



  // Init


  ngOnInit(): void {

    this.loadSuppliers();

    this.loadProducts();

  }



  // Mode


  get isViewMode(): boolean {

    return this.mode === 'view';

  }


  get isEditMode(): boolean {

    return this.mode === 'edit';

  }


  get isCreateMode(): boolean {

    return this.mode === 'create';

  }


  get dialogTitle(): string {

    if (this.isViewMode) {

      return 'Purchase Order Details';

    }


    if (this.isEditMode) {

      return 'Edit Purchase Order';

    }


    return 'Create Purchase Order';

  }


  get dialogDescription(): string {

    if (this.isViewMode) {

      return 'View purchase order information and items.';

    }


    if (this.isEditMode) {

      return 'Update purchase order information and items.';

    }


    return 'Add supplier and purchase items.';

  }



  // Load Suppliers


  loadSuppliers(): void {

    this.loadingSuppliers = true;


    this.supplierService
      .getSuppliers()
      .subscribe({

        next: (response) => {

          this.suppliers = response;

          this.loadingSuppliers = false;

          this.initializeForm();

        },


        error: (error) => {

          console.error(
            'Error loading suppliers:',
            error
          );

          this.loadingSuppliers = false;

        }

      });

  }



  // Load Products


  loadProducts(): void {

    this.loadingProducts = true;


    this.productService
      .getProducts()
      .subscribe({

        next: (response) => {

          this.products =
            response.data;

          this.loadingProducts = false;

          this.initializeForm();

        },


        error: (error) => {

          console.error(
            'Error loading products:',
            error
          );

          this.loadingProducts = false;

        }

      });

  }



  // Initialize Form


  initializeForm(): void {

    if (!this.purchase) {

      return;

    }


    this.purchaseOrderBusinessId =
      this.purchase.Purchase_Order_Business_Id;


    this.supplierRef =
      this.purchase.supplierRef?._id || '';


    this.deliveryTime =
      this.purchase.deliveryTime
        ? this.purchase.deliveryTime
          .substring(0, 10)
        : '';


    this.items =
      this.purchase.items.map(item => ({

        productRef:
          item.productRef?._id || '',

        quantity:
          item.quantity,

        unitPrice:
          item.unitPrice,

        discount:
          item.discount

      }));

  }



  // Supplier Changed


  onSupplierChange(): void {

    if (this.isViewMode) {

      return;

    }


    this.items.forEach(item => {

      item.productRef = '';

      item.unitPrice = 0;

    });

  }



  // Supplier Products


  getSupplierProducts(): IProduct[] {

    if (!this.supplierRef) {

      return [];

    }


    return this.products.filter(

      product =>
        product.supplierRef?._id ===
        this.supplierRef

    );

  }



  // Product Changed


  onProductChange(
    item: PurchaseItemForm
  ): void {

    if (this.isViewMode) {

      return;

    }


    const product =
      this.products.find(
        p =>
          p._id === item.productRef
      );


    if (!product) {

      item.unitPrice = 0;

      return;

    }


    item.unitPrice =
      product.Product_Price;

  }



  // Add Item


  addItem(): void {

    if (this.isViewMode) {

      return;

    }


    this.items.push({

      productRef: '',

      quantity: 1,

      unitPrice: 0,

      discount: 0

    });

  }



  // Remove Item


  removeItem(index: number): void {

    if (this.isViewMode) {

      return;

    }


    if (this.items.length === 1) {

      return;

    }


    this.items.splice(index, 1);

  }



  // Item Total


  getItemTotal(
    item: PurchaseItemForm
  ): number {

    const subtotal =
      Number(item.quantity || 0) *
      Number(item.unitPrice || 0);


    const discount =
      Number(item.discount || 0);


    return Math.max(
      0,
      subtotal - discount
    );

  }



  // Total Items


  get totalItems(): number {

    return this.items.reduce(

      (sum, item) =>
        sum +
        Number(item.quantity || 0),

      0

    );

  }



  // Total Price


  get totalPrice(): number {

    return this.items.reduce(

      (sum, item) =>
        sum +
        this.getItemTotal(item),

      0

    );

  }



  // Validation


  isFormValid(): boolean {

    if (!this.purchaseOrderBusinessId) {

      return false;

    }


    if (!this.supplierRef) {

      return false;

    }


    if (!this.items.length) {

      return false;

    }


    return this.items.every(item =>

      !!item.productRef &&

      Number(item.quantity) >= 1 &&

      Number(item.unitPrice) >= 0 &&

      Number(item.discount || 0) >= 0 &&

      this.getItemTotal(item) >= 0

    );

  }



  // Submit


  submit(): void {

    if (this.isViewMode) {

      return;

    }


    if (!this.isFormValid()) {

      return;

    }


    const payload = {

      Purchase_Order_Business_Id:
        this.purchaseOrderBusinessId,


      supplierRef:
        this.supplierRef,


      items:
        this.items.map(item => ({

          productRef:
            item.productRef,

          quantity:
            Number(item.quantity),

          unitPrice:
            Number(item.unitPrice),

          discount:
            Number(item.discount || 0)

        })),


      /*
       * Status is intentionally preserved.
       * Status changes should use the
       * dedicated status endpoint.
       */

      status:
        this.purchase?.status ||
        'Draft',


      deliveryTime:
        this.deliveryTime ||
        undefined

    };


    this.save.emit(payload);

  }



  // Close


  closeDialog(): void {

    this.close.emit();

  }



  // Currency


  formatCurrency(
    amount: number
  ): string {

    return new Intl.NumberFormat(
      'en-EG',
      {
        style: 'currency',
        currency: 'EGP'
      }
    ).format(amount || 0);

  }

}