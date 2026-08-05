import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProduct } from '../Models/product.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../Models/api-response';
import { IOrder } from '../Models/iorder';
import { IOrderItem } from '../Models/iorder-item';

@Injectable({
  providedIn: 'root',
})
export class OrderItemService {
  private apiUrl = 'http://localhost:3000/order-items'
  constructor(private http: HttpClient) {
    
    
  }
  getOrderItems(page: number, limit:number) : Observable<{
    message: string,
    data: IOrderItem[],
    pagination: {
      currentPage: number;
      limit: number;
      totalOrderItems: number;
      totalPages: number;
    }
  }>{
    return this.http.get<{
      message: string,
      data: IOrderItem[],
      pagination: {
        currentPage: number;
        limit: number;
        totalOrderItems: number;
        totalPages: number;
    }}>(`${this.apiUrl}?page=${page}&limit=${limit}`)
  }

  getOneOrderItem(id: string) : Observable<{
    message: string;
    data: IOrderItem;
  }>{
    return this.http.get<{
      message: string;
      data: IOrderItem;
    }>(`${this.apiUrl}/${id}`)
  }
  getItemsByOrder(orderId: string, page: number = 1, limit: number = 50) : Observable<{
    message: string;
    data: IOrderItem[];
    pagination: {
      currentPage: number;
      limit: number;
      totalOrderItems: number;
      totalPages: number;
    }
  }>{
    return this.http.get<{
      message: string;
      data: IOrderItem[]
      pagination: {
        currentPage: number;
        limit: number;
        totalOrderItems: number;
        totalPages: number;
      }
    }>(`${this.apiUrl}/${orderId}`)
  }
  addOrderItem(orderItem: IOrderItem) : Observable<{
    message: string;
    data: IOrderItem;
  }>{
    return this.http.post<{
      message: string;
      data: IOrderItem;
    }>(this.apiUrl, orderItem)
  }
  updateOrder(id: string, orderItem: Partial<IOrderItem>): Observable<{
    message: string;
    data: IOrderItem;
  }> {
    return this.http.put<{
      message: string;
      data: IOrderItem;
    }>(`${this.apiUrl}/${id}`, orderItem);
  }

  deleteOrderItem(id: string): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.delete<{
      success: boolean;
      message: string;
    }>(`${this.apiUrl}/${id}`);
  }
}
