import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissionsCount: number;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    RouterModule,
  ],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent {
  roles: Role[] = [
    { id: 'R-001', name: 'Administrator', description: 'Full system access', usersCount: 1, permissionsCount: 12, status: 'Active' },
    { id: 'R-002', name: 'Sales Manager', description: 'Manage sales and customers', usersCount: 2, permissionsCount: 8, status: 'Active' },
    { id: 'R-003', name: 'Inventory Manager', description: 'Handle inventory and purchases', usersCount: 1, permissionsCount: 7, status: 'Active' },
    { id: 'R-004', name: 'Purchasing Manager', description: 'Oversee purchase orders', usersCount: 1, permissionsCount: 6, status: 'Inactive' },
    { id: 'R-005', name: 'Accountant', description: 'Financial reporting', usersCount: 1, permissionsCount: 5, status: 'Active' },
  ];

  displayedColumns: string[] = ['name', 'id', 'description', 'usersCount', 'permissionsCount', 'status', 'actions'];

  // Toolbar filters (optional – can add later)

  addRole() {
    console.log('Add Role clicked');
  }

  viewRole(role: Role) {
    console.log('View role', role);
  }

  editRole(role: Role) {
    console.log('Edit role', role);
  }

  deleteRole(role: Role) {
    console.log('Delete role', role);
  }
}
