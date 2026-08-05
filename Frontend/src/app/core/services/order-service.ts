import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrder } from '../Models/iorder';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}


  // GET ALL ORDERS
  getOrders(
    page: number,
    limit: number
  ): Observable<{
    message: string;
    data: IOrder[];
    pagination: {
      currentPage: number;
      limit: number;
      totalOrders: number;
      totalPages: number;
    };
  }> {

    return this.http.get<{
      message: string;
      data: IOrder[];
      pagination: {
        currentPage: number;
        limit: number;
        totalOrders: number;
        totalPages: number;
      };
    }>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    );
  }


  // GET ORDER BY ID
  getOrderById(
    id: string
  ): Observable<{
    message: string;
    data: IOrder;
  }> {

    return this.http.get<{
      message: string;
      data: IOrder;
    }>(
      `${this.apiUrl}/${id}`
    );
  }


  // CREATE ORDER
  addOrder(
    order: Partial<IOrder>
  ): Observable<{
    message: string;
    data: IOrder;
  }> {

    return this.http.post<{
      message: string;
      data: IOrder;
    }>(
      this.apiUrl,
      order
    );
  }


  // UPDATE ORDER
  updateOrder(
    id: string,
    order: Partial<IOrder>
  ): Observable<{
    message: string;
    data: IOrder;
  }> {

    return this.http.put<{
      message: string;
      data: IOrder;
    }>(
      `${this.apiUrl}/${id}`,
      order
    );
  }


  // DELETE ORDER
  deleteOrder(
    id: string
  ): Observable<{
    message: string;
  }> {

    return this.http.delete<{
      message: string;
    }>(
      `${this.apiUrl}/${id}`
    );
  }
}