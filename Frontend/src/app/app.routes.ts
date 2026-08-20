import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/Auth/Login/login.component';
import { DashboardComponent } from './pages/Dashboard/dashboard.component';
import { ProductsComponent } from './pages/catalog/products/products.component';
import { CategoriesComponent } from './pages/catalog/categories/categories.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { PurchasesComponent } from './pages/purchases/purchases.component';
import { ReportsComponent } from './pages/reports/reports.component';

import { UsersComponent } from './pages/users/users.component';
import { RolesComponent } from './pages/roles/roles.component';
import { RoleDetailsComponent } from './pages/roles/role-details/role-details.component';
import { RegisterComponent } from './pages/Auth/register/register';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/Auth/register/register')
        .then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/Auth/Login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized')
        .then(m => m.Unauthorized)
  },

  {
    path: '',
    component: LayoutComponent,
    children: [

      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/Dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },

      {
        path: 'products',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/catalog/products/products.component')
            .then(m => m.ProductsComponent)
      },

      {
        path: 'categories',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/catalog/categories/categories.component')
            .then(m => m.CategoriesComponent)
      },

      {
        path: 'customers',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/customers/customers.component')
            .then(m => m.CustomersComponent)
      },

      {
        path: 'suppliers',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/suppliers/suppliers.component')
            .then(m => m.SuppliersComponent)
      },

      {
        path: 'orders',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/orders/orders.component')
            .then(m => m.OrdersComponent)
      },

      {
        path: 'shipping',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/shipping/shipping.component')
            .then(m => m.ShippingComponent)
      },

      {
        path: 'inventory',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/inventory/inventory.component')
            .then(m => m.InventoryComponent)
      },

      {
        path: 'purchases',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/purchases/purchases.component')
            .then(m => m.PurchasesComponent)
      },


      {
        path: 'reports',
        canActivate: [authGuard, roleGuard],
        data: {roles: ['Admin', 'Manager']},
        loadComponent: () =>
          import('./pages/reports/reports.component')
            .then(m => m.ReportsComponent)
      },

      {
        path: 'users',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Admin']},
        loadComponent: () =>
          import('./pages/users/users.component')
            .then(m => m.UsersComponent)
      },

      {
        path: 'roles',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Admin']},
        loadComponent: () =>
          import('./pages/roles/roles.component')
            .then(m => m.RolesComponent)
      },

      {
        path: 'roles/:id',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Admin']},
        loadComponent: () =>
          import('./pages/roles/role-details/role-details.component')
            .then(m => m.RoleDetailsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  },


];
