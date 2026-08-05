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

// Simple dialog component for Add/Edit/View Customer (UI only)
@Component({
  selector: 'app-customer-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl : './customers.html',
  styleUrl: './customers.css'
})
export class CustomerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; customer: any }
  ) {}
}

@Component({
  selector: 'app-customers',
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

  ],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 m-0 leading-tight">Customers</h1>
          <p class="text-sm text-gray-5 0 mt-1">Manage customers and customer information.</p>
        </div>
        <button mat-flat-button color="primary" (click)="openDialog('add')">Add Customer</button>
      </div>

      <!-- Toolbar -->
      <mat-card class="!shadow-sm border border-gray-100 !rounded-xl">
        <mat-card-content class="p-4 pb-0 flex flex-col md:flex-row gap-4 items-center">
          <mat-form-field appearance="outline" class="w-full md:w-96 m-0" subscriptSizing="dynamic">
            <mat-icon matPrefix class="text-gray-400">search</mat-icon>
            <input matInput placeholder="Search customers..." [(ngModel)]="searchQuery" (input)="filterData()" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full md:w-48 m-0" subscriptSizing="dynamic">
            <mat-select [(ngModel)]="selectedSegment" (selectionChange)="filterData()">
              <mat-option value="All Segments">All Segments</mat-option>
              <mat-option value="Consumer">Consumer</mat-option>
              <mat-option value="Corporate">Corporate</mat-option>
              <mat-option value="Home Office">Home Office</mat-option>
            </mat-select>
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

      <!-- Customers Table -->
      <mat-card class="!shadow-sm border border-gray-100 !rounded-xl overflow-hidden">
        <div class="overflow-x-auto w-full">
          <table mat-table [dataSource]="filteredCustomers" class="w-full min-w-[800px]">
            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-600">Customer</th>
              <td mat-cell *matCellDef="let element">
                <div class="flex items-center gap-3 py-2">
                  <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                    {{element.avatarInitial}}
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{element.name}}</div>
                    <div class="text-sm text-gray-5 0">ID: {{element.id}}</div>
                  </div>
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="segment">
              <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-600">Segment</th>
              <td mat-cell *matCellDef="let element" class="text-gray-600">{{element.segment}}</td>
            </ng-container>
            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-600">Location</th>
              <td mat-cell *matCellDef="let element" class="text-gray-600">{{element.location}}</td>
            </ng-container>
            <ng-container matColumnDef="orders">
              <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-600">Orders</th>
              <td mat-cell *matCellDef="let element" class="text-gray-600">{{element.orders}}</td>
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
          <div *ngIf="filteredCustomers.length === 0" class="p-8 text-center text-gray-500">
            No customers match your search criteria.
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }`
  ]
})
export class CustomersComponent {
  displayedColumns: string[] = ['customer', 'segment', 'location', 'orders', 'status', 'actions'];

  allCustomers = [
    { id: '20755', name: 'Cally Holloway', segment: 'Consumer', location: 'Caguas, Puerto Rico', orders: 12, status: 'Active', avatarInitial: 'C' },
    { id: '20756', name: 'Marco Rivera', segment: 'Corporate', location: 'San Juan, Puerto Rico', orders: 34, status: 'Active', avatarInitial: 'M' },
    { id: '20757', name: 'Lena Ortiz', segment: 'Home Office', location: 'Ponce, Puerto Rico', orders: 5, status: 'Inactive', avatarInitial: 'L' },
    { id: '20758', name: 'Juan Perez', segment: 'Consumer', location: 'Mayagüez, Puerto Rico', orders: 8, status: 'Active', avatarInitial: 'J' },
    { id: '20759', name: 'Sofia Garcia', segment: 'Corporate', location: 'Arecibo, Puerto Rico', orders: 22, status: 'Active', avatarInitial: 'S' },
    { id: '20760', name: 'Diego Torres', segment: 'Home Office', location: 'Cayey, Puerto Rico', orders: 3, status: 'Inactive', avatarInitial: 'D' }
  ];

  filteredCustomers = [...this.allCustomers];

  searchQuery = '';
  selectedSegment = 'All Segments';
  selectedStatus = 'All';

  constructor(private dialog: MatDialog) {}

  filterData() {
    this.filteredCustomers = this.allCustomers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || c.id.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesSegment = this.selectedSegment === 'All Segments' || c.segment === this.selectedSegment;
      const matchesStatus = this.selectedStatus === 'All' || c.status === this.selectedStatus;
      return matchesSearch && matchesSegment && matchesStatus;
    });
  }

  openDialog(mode: 'add' | 'edit' | 'view', customer?: any) {
    this.dialog.open(CustomerDialogComponent, { width: '500px', data: { mode, customer: customer || {} } });
  }
}
