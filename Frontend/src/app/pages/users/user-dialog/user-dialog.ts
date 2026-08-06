// features/users/user-dialog/user-dialog.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../core/services/users-service';
import { IUser } from '../../../core/Models/iuser';
import { AuthService } from '../../../core/services/auth-service';


@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-dialog.html'
})
export class UserDialogComponent implements OnInit {
  @Input() isOpen = false;
  @Input() mode: 'add' | 'edit' | 'view' = 'add';
  @Input() user: IUser | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  formData = {
    username: '',
    email: '',
    password: '',
    roleId: '',
    isActive: true
  };

  roles: any[] = [];
  isSaving = false;
  errorMessage = '';

  constructor(private userService: UsersService, private auth: AuthService) {}

  ngOnInit() {
    this.loadRoles();
  }

  ngOnChanges() {
    if (this.mode === 'edit' && this.user) {
      this.formData = {
        username: this.user.username,
        email: this.user.email,
        password: '',
        roleId: this.user.role?._id || '',
        isActive: this.user.isActive !== undefined ? this.user.isActive : true
      };
    } else if (this.mode === 'add') {
      this.formData = {
        username: '',
        email: '',
        password: '',
        roleId: '',
        isActive: true
      };
    }
    this.errorMessage = '';
  }

  loadRoles() {
    this.userService.getRoles().subscribe({
      next: (response: any) => {
        this.roles = response.data || [];
      },
      error: (err) => {
        console.error('Error loading roles:', err);
      }
    });
  }

  getInitials(username: any): string {
    if (!username) return '';
    return username.charAt(0).toUpperCase();
  }

  close() {
    this.closed.emit();
  }

  save() {
    if (this.mode === 'add') {
      this.addUser();
    } else if (this.mode === 'edit') {
      this.updateUser();
    }
  }

  addUser() {
    if (!this.formData.username || !this.formData.email || !this.formData.password) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    if (this.formData.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    this.auth.register(this.formData).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.saved.emit(response);
        this.close();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Failed to add user';
      }
    });
  }

  updateUser() {
    if (!this.user) return;

    this.isSaving = true;
    this.errorMessage = '';

    const userData = {
      username: this.formData.username,
      email: this.formData.email,
      roleId: this.formData.roleId || null,
      isActive: this.formData.isActive
    };

    this.userService.updateUser(this.user._id, userData).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.saved.emit(response);
        this.close();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Failed to update user';
      }
    });
  }
}