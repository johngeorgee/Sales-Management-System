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
import { PurchaseDetailsComponent } from './pages/purchases/purchase-details/purchase-details.component';
import { ReportsComponent } from './pages/reports/reports.component';

import { UsersComponent } from './pages/users/users.component';
import { RolesComponent } from './pages/roles/roles.component';
import { RoleDetailsComponent } from './pages/roles/role-details/role-details.component';
import { RegisterComponent } from './pages/Auth/register/register';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent},
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'suppliers', component: SuppliersComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders-items/:id', component: OrderDetailsComponent },
      { path: 'shipping', component: ShippingComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'purchases', component: PurchasesComponent },
      { path: 'purchases/:id', component: PurchaseDetailsComponent },
      { path: 'reports', component: ReportsComponent },
  
      { path: 'users', component: UsersComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'roles/:id', component: RoleDetailsComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
