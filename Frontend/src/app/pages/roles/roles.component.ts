import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],
  templateUrl: './roles.component.html'
})
export class RolesComponent {
  roles: Role[] = [
    { 
      id: 'R-001', 
      name: 'Administrator', 
      description: 'Full system access with all permissions', 
      usersCount: 1, 
      permissionsCount: 12, 
      status: 'Active' 
    },
    { 
      id: 'R-002', 
      name: 'Sales Manager', 
      description: 'Manage sales, customers, and orders', 
      usersCount: 2, 
      permissionsCount: 8, 
      status: 'Active' 
    },
    { 
      id: 'R-003', 
      name: 'Inventory Manager', 
      description: 'Handle inventory and purchase orders', 
      usersCount: 1, 
      permissionsCount: 7, 
      status: 'Active' 
    },
    { 
      id: 'R-004', 
      name: 'Purchasing Manager', 
      description: 'Oversee purchase orders and suppliers', 
      usersCount: 1, 
      permissionsCount: 6, 
      status: 'Inactive' 
    },
    { 
      id: 'R-005', 
      name: 'Accountant', 
      description: 'Financial reporting and analysis', 
      usersCount: 1, 
      permissionsCount: 5, 
      status: 'Active' 
    }
  ];

  // Methods
  addRole(): void {
    console.log('Add Role clicked');
  }

  viewRole(role: Role): void {
    console.log('View role:', role);
  }

  editRole(role: Role): void {
    console.log('Edit role:', role);
  }

  deleteRole(role: Role): void {
    if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      console.log('Delete role:', role);
    }
  }
}