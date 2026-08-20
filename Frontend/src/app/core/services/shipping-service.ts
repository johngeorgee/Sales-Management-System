import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IShipping, ShippingResponse } from '../Models/ishipping';
import { Observable } from 'rxjs';
import { ApiResponse } from '../Models/api-response';

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  private apiUrl = 'http://localhost:3000/shipping'
  constructor(private http: HttpClient) {


  }


  // Get all shippings
  getShippings(page: number, limit: number) {
    return this.http.get<ShippingResponse>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    );
  }

  // Get shipping by ID
  getShippingById(id: string): Observable<{
    message: string;
    data: IShipping;
  }> {
    return this.http.get<{
      message: string;
      data: IShipping;
    }>(`${this.apiUrl}/${id}`);
  }

  // Add shipping
  addShipping(shipping: IShipping): Observable<{
    message: string;
    data: IShipping;
  }> {
    return this.http.post<{
      message: string;
      data: IShipping;
    }>(this.apiUrl, shipping);
  }

  // Update shipping
  updateShipping(
    id: string,
    shipping: Partial<IShipping>
  ): Observable<{
    message: string;
    data: IShipping;
  }> {
    return this.http.put<{
      message: string;
      data: IShipping;
    }>(`${this.apiUrl}/${id}`, shipping);
  }

  // Delete shipping
  deleteShipping(id: string): Observable<{
    message: string;
    success?: boolean;
  }> {
    return this.http.delete<{
      message: string;
      success?: boolean;
    }>(`${this.apiUrl}/${id}`);
  }
}
