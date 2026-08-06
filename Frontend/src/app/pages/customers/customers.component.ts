import { Component, Inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';

import { CustomerService } from '../../core/services/customer-service';
import { CustomerLocationService } from '../../core/services/customer-location-service';

import { ICustomer, customerSegment } from '../../core/Models/icustomer';

// ======================
// Customer Dialog
// ======================

@Component({
  selector: 'app-customer-dialog',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],

  template: `
    <h2 mat-dialog-title>
      {{ data.mode === 'add' ? 'Add' : data.mode === 'edit' ? 'Edit' : 'View' }} Customer
    </h2>

    <mat-dialog-content>
      <form #form="ngForm">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label> Full Name </mat-label>

          <input
            matInput
            [(ngModel)]="data.customer.Customer_FullName"
            name="Customer_FullName"
            required
          />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label> Segment </mat-label>

          <mat-select [(ngModel)]="data.customer.Customer_Segment" name="Customer_Segment" required>
            <mat-option value="Consumer"> Consumer </mat-option>

            <mat-option value="Corporate"> Corporate </mat-option>

            <mat-option value="Home Office"> Home Office </mat-option>
          </mat-select>
        </mat-form-field>

        <h3 class="font-semibold mt-3">Location</h3>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label> City </mat-label>

          <input matInput [(ngModel)]="data.customer.location.Customer_City" name="Customer_City" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label> Country </mat-label>

          <input
            matInput
            [(ngModel)]="data.customer.location.Customer_Country"
            name="Customer_Country"
          />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label> Street </mat-label>

          <input
            matInput
            [(ngModel)]="data.customer.location.Customer_Street"
            name="Customer_Street"
          />
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>

      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="save()">
        Save
      </button>
    </mat-dialog-actions>
  `,
})
export class CustomerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CustomerDialogComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: string;
      customer: ICustomer;
    },
  ) {
    if (!this.data.customer.location) {
      this.data.customer.location = {
        Customer_ID: this.data.customer.Customer_Id,

        Customer_City: '',

        Customer_State: '',

        Customer_Country: '',

        Customer_Street: '',

        Customer_Zipcode: '',

        Latitude: 0,

        Longitude: 0,
      };
    }
  }

  save() {
    this.dialogRef.close(this.data);
  }
}

// ======================
// Customers Component
// ======================

@Component({
  selector: 'app-customers',

  standalone: true,

  imports: [
    CommonModule,

    FormsModule,

    MatTableModule,

    MatButtonModule,

    MatIconModule,

    MatInputModule,

    MatSelectModule,

    MatCardModule,

    MatMenuModule,

    MatDialogModule,

    MatDividerModule,
  ],

  template: `
    <div class="max-w-7xl mx-auto space-y-6 p-4 sm:p-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Customers</h1>
          <p class="text-sm text-gray-500 mt-1">
            Manage and track your customer accounts and locations.
          </p>
        </div>

        <button
          mat-flat-button
          class="!bg-indigo-600 hover:!bg-indigo-700 !text-white !py-2.5 !px-5 !rounded-xl flex items-center gap-2 shadow-sm transition-all"
          (click)="openDialog('add')"
        >
          <mat-icon class="!w-5 !h-5 !text-base">add</mat-icon>
          <span>Add Customer</span>
        </button>
      </div>

      <!-- Filters Bar -->
      <mat-card class="!shadow-sm border border-gray-100 !rounded-2xl bg-white overflow-hidden">
        <mat-card-content class="!p-4 flex flex-col md:flex-row gap-4 items-center">
          <!-- Search Input -->
          <mat-form-field appearance="outline" class="w-full md:w-96 m-0" subscriptSizing="dynamic">
            <mat-icon matPrefix class="text-gray-400 mr-2">search</mat-icon>
            <input
              matInput
              placeholder="Search by name, ID, or city..."
              [(ngModel)]="searchQuery"
              (input)="filterData()"
            />
          </mat-form-field>

          <!-- Segment Filter -->
          <mat-form-field appearance="outline" class="w-full md:w-52 m-0" subscriptSizing="dynamic">
            <mat-icon matPrefix class="text-gray-400 mr-2">category</mat-icon>
            <mat-select [(ngModel)]="selectedSegment" (selectionChange)="filterData()">
              <mat-option value="All Segments">All Segments</mat-option>
              <mat-option value="Consumer">Consumer</mat-option>
              <mat-option value="Corporate">Corporate</mat-option>
              <mat-option value="Home Office">Home Office</mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <!-- Customers Table Card -->
      <mat-card class="!shadow-sm border border-gray-100 !rounded-2xl overflow-hidden bg-white">
        <div class="overflow-x-auto w-full">
          <table mat-table [dataSource]="filteredCustomers" class="w-full min-w-[700px]">
            <!-- Customer Column -->
            <ng-container matColumnDef="customer">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="font-semibold text-gray-600 bg-gray-50/80 py-4 text-xs uppercase tracking-wider"
              >
                Customer
              </th>
              <td mat-cell *matCellDef="let c">
                <div class="flex items-center gap-3 py-3">
                  <!-- Colorful Gradient Avatar -->
                  <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm"
                  >
                    {{ c.Customer_FullName?.charAt(0)?.toUpperCase() || 'C' }}
                  </div>
                  <div>
                    <div
                      class="font-semibold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer"
                      (click)="openDialog('view', c)"
                    >
                      {{ c.Customer_FullName }}
                    </div>
                    <div class="text-xs text-gray-400 font-mono mt-0.5">
                      ID: {{ c.Customer_Id }}
                    </div>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Segment Column -->
            <ng-container matColumnDef="segment">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="font-semibold text-gray-600 bg-gray-50/80 py-4 text-xs uppercase tracking-wider"
              >
                Segment
              </th>
              <td mat-cell *matCellDef="let c">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  {{ c.Customer_Segment || 'General' }}
                </span>
              </td>
            </ng-container>

            <!-- Location Column -->
            <ng-container matColumnDef="location">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="font-semibold text-gray-600 bg-gray-50/80 py-4 text-xs uppercase tracking-wider"
              >
                Location
              </th>
              <td mat-cell *matCellDef="let c" class="text-gray-600 text-sm">
                <div class="flex items-center gap-1.5">
                  <mat-icon class="!w-4 !h-4 !text-base text-gray-400">place</mat-icon>
                  <span>{{ c.location?.Customer_City || '-' }}</span>
                  <span *ngIf="c.location?.Customer_Country" class="text-gray-400 text-xs">
                    ({{ c.location?.Customer_Country }})
                  </span>
                </div>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="w-16 bg-gray-50/80 py-4"></th>
              <td mat-cell *matCellDef="let c" class="text-right">
                <button
                  mat-icon-button
                  [matMenuTriggerFor]="menu"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <mat-icon>more_vert</mat-icon>
                </button>

                <mat-menu #menu="matMenu" xPosition="before">
                  <button mat-menu-item (click)="openDialog('view', c)">
                    <mat-icon class="text-gray-500">visibility</mat-icon>
                    <span>View Profile</span>
                  </button>
                  <button mat-menu-item (click)="openDialog('edit', c)">
                    <mat-icon class="text-indigo-600">edit</mat-icon>
                    <span>Edit Customer</span>
                  </button>
                  <mat-divider></mat-divider>
                  <button mat-menu-item (click)="deleteCustomer(c)">
                    <mat-icon class="text-rose-500">delete</mat-icon>
                    <span class="text-rose-600">Delete</span>
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              class="hover:bg-slate-50/70 transition-colors border-b border-gray-100/60"
            ></tr>
          </table>

          <!-- Empty State (عندما لا توجد نتائج للبحث) -->
          <div *ngIf="filteredCustomers?.length === 0" class="p-12 text-center">
            <div
              class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3"
            >
              <mat-icon class="!w-8 !h-8 !text-2xl text-gray-400">search_off</mat-icon>
            </div>
            <h4 class="text-base font-semibold text-gray-700 m-0">No customers found</h4>
            <p class="text-xs text-gray-400 mt-1">
              Try adjusting your search query or segment filter.
            </p>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `
      ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }
      ::ng-deep .mat-mdc-table {
        background: transparent;
      }
    `,
  ],
})
export class CustomersComponent implements OnInit {
  displayedColumns = ['customer', 'segment', 'location', 'actions'];

  customers: ICustomer[] = [];

  filteredCustomers: ICustomer[] = [];

  searchQuery = '';

  selectedSegment = 'All Segments';

  constructor(
    private dialog: MatDialog,

    private customerService: CustomerService,

    private locationService: CustomerLocationService,
  ) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService

      .getCustomers()

      .subscribe((customers) => {
        this.locationService

          .getLocations()

          .subscribe((locations) => {
            this.customers = customers.map((c) => ({
              ...c,

              location: locations.find((l) => l.customerRef === c._id) || {
                Customer_ID: c.Customer_Id,

                Customer_City: '',

                Customer_State: '',

                Customer_Country: '',

                Customer_Street: '',

                Customer_Zipcode: '',

                Latitude: 0,

                Longitude: 0,
              },
            }));

            this.filteredCustomers = [...this.customers];
          });
      });
  }

  filterData() {
    const search = this.searchQuery.toLowerCase();

    this.filteredCustomers = this.customers.filter((c) => {
      return (
        c.Customer_FullName.toLowerCase().includes(search) &&
        (this.selectedSegment === 'All Segments' || c.Customer_Segment === this.selectedSegment)
      );
    });
  }

  openDialog(mode: 'add' | 'edit' | 'view', customer?: ICustomer) {
    const dialog = this.dialog.open(
      CustomerDialogComponent,

      {
        width: '600px',

        data: {
          mode,

          customer: customer
            ? JSON.parse(JSON.stringify(customer))
            : {
                Customer_Id: Date.now(),

                Customer_FullName: '',

                Customer_Segment: customerSegment.Consumer,

                location: {
                  Customer_ID: Date.now(),

                  Customer_City: '',

                  Customer_State: '',

                  Customer_Country: '',

                  Customer_Street: '',

                  Customer_Zipcode: '',

                  Latitude: 0,

                  Longitude: 0,
                },
              },
        },
      },
    );

    dialog
      .afterClosed()

      .subscribe((result) => {
        if (!result) return;

        if (result.mode === 'add') this.addCustomer(result.customer);

        if (result.mode === 'edit') this.updateCustomer(result.customer);
      });
  }

  addCustomer(customer: ICustomer) {
    const location = customer.location;

    const customerData = {
      Customer_Id: customer.Customer_Id,

      Customer_FullName: customer.Customer_FullName,

      Customer_Segment: customer.Customer_Segment,
    };

    this.customerService

      .addCustomer(customerData as ICustomer)

      .subscribe((newCustomer) => {
        if (location) {
          location.Customer_ID = newCustomer.Customer_Id;

          location.customerRef = newCustomer._id;

          this.locationService

            .addLocation(location)

            .subscribe(() => {
              this.loadCustomers();
            });
        }
      });
  }

  updateCustomer(customer: ICustomer) {
    this.customerService

      .updateCustomer(
        customer._id!,

        customer,
      )

      .subscribe(() => {
        this.loadCustomers();
      });
  }

  deleteCustomer(customer: ICustomer) {
    this.customerService

      .deleteCustomer(customer._id!)

      .subscribe(() => {
        this.loadCustomers();
      });
  }
}
