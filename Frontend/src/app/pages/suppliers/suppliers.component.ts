import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

// Simple dialog component for Add/Edit/View Supplier (UI only)
@Component({
  selector: 'app-supplier-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{data.mode === 'add' ? 'Add' : (data.mode === 'edit' ? 'Edit' : 'View')}} Supplier</h2>
    <mat-dialog-content>
      <form #form="ngForm">
        <mat-form-field appearance="outline" class="w-full mb-2" *ngIf="data.mode !== 'view'">
          <mat-label>Supplier Name</mat-label>
          <input matInput [(ngModel)]="data.supplier.name" name="name" required />
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full mb-2" *ngIf="data.mode !== 'view'">
          <mat-label>Contact Person</mat-label>
          <input matInput [(ngModel)]="data.supplier.contactPerson" name="contactPerson" required />
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full mb-2" *ngIf="data.mode !== 'view'">
          <mat-label>Email</mat-label>
          <input matInput type="email" [(ngModel)]="data.supplier.email" name="email" required />
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full mb-2" *ngIf="data.mode !== 'view'">
          <mat-label>Phone</mat-label>
          <input matInput [(ngModel)]="data.supplier.phone" name="phone" required />
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full mb-2" *ngIf="data.mode !== 'view'">
          <mat-label>Address</mat-label>
          <input matInput [(ngModel)]="data.supplier.address" name="address" required />
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full mb-2" *ngIf="data.mode !== 'view'">
          <mat-label>City</mat-label>
          <input matInput [(ngModel)]="data.supplier.city" name="city" required />
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full mb-2" *ngIf="data.mode !== 'view'">
          <mat-label>State</mat-label>
          <input matInput [(ngModel)]="data.supplier.state" name="state" required />
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full mb-2" *ngIf="data.mode !== 'view'">
          <mat-label>Country</mat-label>
          <input matInput [(ngModel)]="data.supplier.country" name="country" required />
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full mb-2" *ngIf="data.mode !== 'view'">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="data.supplier.status" name="status" required>
            <mat-option value="Active">Active</mat-option>
            <mat-option value="Inactive">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="dialogRef.close(data)">Save</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class SupplierDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SupplierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; supplier: any }
  ) {}
}

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatMenuModule,
    MatDialogModule,
    FormsModule,
    MatDividerModule,
    MatFormFieldModule,

  ],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 m-0 leading-tight">Suppliers</h1>
          <p class="text-sm text-gray-500 mt-1">Manage suppliers and supplier information.</p>
        </div>
        <button mat-flat-button color="primary" (click)="openDialog('add')">Add Supplier</button>
      </div>

      <!-- Toolbar -->
      <mat-card class="!shadow-sm border border-gray-100 !rounded-xl">
        <mat-card-content class="p-4 pb-0 flex flex-col md:flex-row gap-4 items-center">
          <mat-form-field appearance="outline" class="w-full md:w-96 m-0" subscriptSizing="dynamic">
            <mat-icon matPrefix class="text-gray-400">search</mat-icon>
            <input matInput placeholder="Search suppliers..." [(ngModel)]="searchQuery" (input)="filterData()" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full md:w-48 m-0" subscriptSizing="dynamic">
            <mat-select [(ngModel)]="selectedStatus" (selectionChange)="filterData()">
              <mat-option value="All">All</mat-option>
              <mat-option value="Active">Active</mat-option>
              <mat-option value="Inactive">Inactive</mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <!-- Suppliers Table -->
      <mat-card class="!shadow-sm border border-gray-100 !rounded-xl overflow-hidden">
        <div class="overflow-x-auto w-full">
          <table mat-table [dataSource]="filteredSuppliers" class="w-full min-w-[800px]">
            <ng-container matColumnDef="supplier">
              <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-600">Supplier</th>
              <td mat-cell *matCellDef="let element">
                <div class="flex items-center gap-3 py-2">
                  <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                    {{element.avatarInitial}}
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{element.name}}</div>
                    <div class="text-sm text-gray-500">ID: {{element.id}}</div>
                  </div>
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="contact">
              <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-600">Contact</th>
              <td mat-cell *matCellDef="let element" class="text-gray-600">
                <div>{{element.contactPerson}}</div>
                <div class="text-sm text-gray-500">{{element.email}} / {{element.phone}}</div>
              </td>
            </ng-container>
            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-600">Location</th>
              <td mat-cell *matCellDef="let element" class="text-gray-600">
                {{element.city}} / {{element.country}}
              </td>
            </ng-container>
            <ng-container matColumnDef="products">
              <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-600">Products</th>
              <td mat-cell *matCellDef="let element" class="text-gray-600">{{element.productsCount}}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-600">Status</th>
              <td mat-cell *matCellDef="let element">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [ngClass]="element.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{element.status}}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="w-16"></th>
              <td mat-cell *matCellDef="let element" class="text-right">
                <button mat-icon-button [matMenuTriggerFor]="menu" class="text-gray-400 hover:text-gray-600">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="openDialog('view', element)"><mat-icon>visibility</mat-icon>View</button>
                  <button mat-menu-item (click)="openDialog('edit', element)"><mat-icon>edit</mat-icon>Edit</button>
                  <mat-divider></mat-divider>
                  <button mat-menu-item class="text-red-600"><mat-icon class="text-red-500">delete</mat-icon>Delete</button>
                </mat-menu>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns" class="bg-gray-50"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 transition-colors"></tr>
          </table>
          <div *ngIf="filteredSuppliers.length === 0" class="p-8 text-center text-gray-500">
            No suppliers match your search criteria.
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }`
  ]
})
export class SuppliersComponent {
  displayedColumns: string[] = ['supplier', 'contact', 'location', 'products', 'status', 'actions'];

  allSuppliers = [
    { id: 'S001', name: 'Acme Corp', avatarInitial: 'A', contactPerson: 'John Doe', email: 'john@acme.com', phone: '555-1234', city: 'San Juan', country: 'Puerto Rico', address: '123 Main St', productsCount: 24, status: 'Active' },
    { id: 'S002', name: 'Global Supplies', avatarInitial: 'G', contactPerson: 'Maria Lopez', email: 'maria@globalsupplies.com', phone: '555-5678', city: 'Ponce', country: 'Puerto Rico', address: '456 Oak Ave', productsCount: 18, status: 'Active' },
    { id: 'S003', name: 'TechParts', avatarInitial: 'T', contactPerson: 'Luis Rivera', email: 'luis@techparts.com', phone: '555-9012', city: 'Cabuas', country: 'Puerto Rico', address: '789 Pine Rd', productsCount: 30, status: 'Inactive' },
    { id: 'S004', name: 'Office Goods', avatarInitial: 'O', contactPerson: 'Ana Martinez', email: 'ana@officegoods.com', phone: '555-3456', city: 'Mayagüez', country: 'Puerto Rico', address: '321 Elm St', productsCount: 12, status: 'Active' },
    { id: 'S005', name: 'Furniture Co', avatarInitial: 'F', contactPerson: 'Carlos Silva', email: 'carlos@furnitureco.com', phone: '555-7890', city: 'Arecibo', country: 'Puerto Rico', address: '654 Maple Blvd', productsCount: 9, status: 'Inactive' }
  ];

  filteredSuppliers = [...this.allSuppliers];

  searchQuery = '';
  selectedStatus = 'All';

  constructor(private dialog: MatDialog) {}

  filterData() {
    this.filteredSuppliers = this.allSuppliers.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || s.id.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.selectedStatus === 'All' || s.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  openDialog(mode: 'add' | 'edit' | 'view', supplier?: any) {
    this.dialog.open(SupplierDialogComponent, { width: '500px', data: { mode, supplier: supplier || {} } });
  }
}
