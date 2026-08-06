// features/users/users.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../core/Models/iuser';
import { UserDialogComponent } from './user-dialog/user-dialog';
import { UsersService } from '../../core/services/users-service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, UserDialogComponent],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users: IUser[] = [];
  filteredUsers: IUser[] = [];
  loading = false;

  // Filters
  searchQuery = '';
  selectedRole = '';
  selectedStatus = '';

  // Dialog
  isDialogOpen = false;
  dialogMode: 'add' | 'edit' | 'view' = 'add';
  selectedUser: IUser | null = null;

  constructor(private userService: UsersService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users: IUser[]) => {
        this.users = users;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    const search = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = 
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);

      const matchesRole = 
        !this.selectedRole || 
        user.role?.name === this.selectedRole;

      const matchesStatus = 
        !this.selectedStatus ||
        (this.selectedStatus === 'Active' && user.isActive) ||
        (this.selectedStatus === 'Inactive' && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  getUniqueRoles(): any[] {
    const roles = this.users
      .map(user => user.role?.name)
      .filter(role => role);
    return [...new Set(roles)];
  }

  getInitials(username: string): string {
    if (!username) return '';
    return username.charAt(0).toUpperCase();
  }

  // Dialog methods
  createUser() {
    this.dialogMode = 'add';
    this.selectedUser = null;
    this.isDialogOpen = true;
  }

  viewUser(user: IUser) {
    this.dialogMode = 'view';
    this.selectedUser = user;
    this.isDialogOpen = true;
  }

  editUser(user: IUser) {
    this.dialogMode = 'edit';
    this.selectedUser = user;
    this.isDialogOpen = true;
  }

  deleteUser(user: IUser) {
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this.userService.deleteUser(user._id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        }
      });
    }
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.selectedUser = null;
  }

  saveUser(event: any) {
    this.loadUsers();
  }
}