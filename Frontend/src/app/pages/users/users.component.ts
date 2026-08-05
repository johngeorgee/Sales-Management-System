import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  // Mock data
  users: User[] = [
    { id: 'U-001', fullName: 'Alice Johnson', email: 'alice@example.com', role: 'Administrator', status: 'Active', lastLogin: '2024-07-20' },
    { id: 'U-002', fullName: 'Bob Smith', email: 'bob@example.com', role: 'Sales Manager', status: 'Active', lastLogin: '2024-07-18' },
    { id: 'U-003', fullName: 'Carol Lee', email: 'carol@example.com', role: 'Sales Representative', status: 'Inactive', lastLogin: '2024-06-30' },
    { id: 'U-004', fullName: 'David Kim', email: 'david@example.com', role: 'Inventory Manager', status: 'Active', lastLogin: '2024-07-19' },
    { id: 'U-005', fullName: 'Eve Martinez', email: 'eve@example.com', role: 'Purchasing Manager', status: 'Active', lastLogin: '2024-07-15' },
    { id: 'U-006', fullName: 'Frank Zhou', email: 'frank@example.com', role: 'Accountant', status: 'Inactive', lastLogin: '2024-06-25' },
  ];

  displayedColumns: string[] = ['avatar', 'fullName', 'id', 'email', 'role', 'status', 'lastLogin', 'actions'];

  // Toolbar filters
  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';

  get filteredUsers(): User[] {
    return this.users.filter(u => {
      const matchesSearch = this.searchTerm
        ? u.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) || u.email.toLowerCase().includes(this.searchTerm.toLowerCase()) || u.id.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      const matchesRole = this.selectedRole ? u.role === this.selectedRole : true;
      const matchesStatus = this.selectedStatus ? u.status === this.selectedStatus : true;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
  }

  // Placeholder methods for actions
  addUser() {
    console.log('Add User clicked');
  }

  viewUser(user: User) {
    console.log('View user', user);
  }

  editUser(user: User) {
    console.log('Edit user', user);
  }

  deleteUser(user: User) {
    console.log('Delete user', user);
  }
}
