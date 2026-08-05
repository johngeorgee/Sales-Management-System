import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

interface RoleDetail {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  users: { id: string; fullName: string; email: string }[];
  permissions: Permission[];
}

@Component({
  selector: 'app-role-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.css'],
})
export class RoleDetailsComponent implements OnInit {
  roleId: string | null = null;
  role: RoleDetail | null = null;

  displayedColumns: string[] = ['module', 'view', 'create', 'update', 'delete'];

  // Mock data – in a real app this would be fetched based on roleId
  mockRoles: RoleDetail[] = [
    {
      id: 'R-001',
      name: 'Administrator',
      description: 'Full system access',
      status: 'Active',
      users: [
        { id: 'U-001', fullName: 'Alice Johnson', email: 'alice@example.com' },
      ],
      permissions: [
        { module: 'Dashboard', view: true, create: true, update: true, delete: true },
        { module: 'Products', view: true, create: true, update: true, delete: true },
        { module: 'Orders', view: true, create: true, update: true, delete: true },
        // Add more modules as needed
      ],
    },
    {
      id: 'R-002',
      name: 'Sales Manager',
      description: 'Manage sales and customers',
      status: 'Active',
      users: [
        { id: 'U-002', fullName: 'Bob Smith', email: 'bob@example.com' },
        { id: 'U-003', fullName: 'Carol Lee', email: 'carol@example.com' },
      ],
      permissions: [
        { module: 'Orders', view: true, create: true, update: true, delete: false },
        { module: 'Customers', view: true, create: true, update: true, delete: false },
      ],
    },
  ];

  ngOnInit() {
    // Retrieve the id from the route (static UI – we just pick the first mock role if missing)
    this.roleId = this.route.snapshot.paramMap.get('id');
    this.role = this.mockRoles.find(r => r.id === this.roleId) || this.mockRoles[0];
  }

  constructor(private route: ActivatedRoute) {}
}
