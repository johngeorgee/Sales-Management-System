import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomer } from '../Models/icustomer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'http://localhost:5000/customers';

  constructor(private http: HttpClient) {}

  // Get all customers
  getCustomers(): Observable<ICustomer[]> {
    return this.http.get<ICustomer[]>(this.apiUrl);
  }

  // Get customer by ID
  getCustomerById(id: string): Observable<ICustomer> {
    return this.http.get<ICustomer>(`${this.apiUrl}/${id}`);
  }

  // Add customer
  addCustomer(customer: ICustomer): Observable<ICustomer> {
    return this.http.post<ICustomer>(this.apiUrl, customer);
  }

  // Update customer
  updateCustomer(
    id: string,
    customer: Partial<ICustomer>
  ): Observable<ICustomer> {
    return this.http.put<ICustomer>(
      `${this.apiUrl}/${id}`,
      customer
    );
  }

  // Delete customer
  deleteCustomer(id: string): Observable<{
    message: string;
  }> {
    return this.http.delete<{
      message: string;
    }>(`${this.apiUrl}/${id}`);
  }
}
