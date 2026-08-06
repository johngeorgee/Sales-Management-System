// core/services/customer-service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICustomer } from '../Models/icustomer';

export interface CustomerResponse {
  message: string;
  data: ICustomer[];
  pagination: {
    currentPage: number;
    limit: number;
    totalCustomers: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'http://localhost:3000/customers';

  constructor(private http: HttpClient) {}

  // Get all customers with pagination
  getCustomers(page: number = 1, limit: number = 20): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  // Get customer by ID
  getCustomerById(id: string): Observable<ICustomer> {
    return this.http.get<{ message: string; data: ICustomer }>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  // Add customer
  addCustomer(customer: ICustomer): Observable<ICustomer> {
    return this.http.post<{ message: string; data: ICustomer }>(this.apiUrl, customer)
      .pipe(map(response => response.data));
  }

  // Update customer
  updateCustomer(id: string, customer: Partial<ICustomer>): Observable<ICustomer> {
    return this.http.put<{ message: string; data: ICustomer }>(`${this.apiUrl}/${id}`, customer)
      .pipe(map(response => response.data));
  }

  // Delete customer
  deleteCustomer(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}