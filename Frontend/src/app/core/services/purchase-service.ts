import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPurchase } from '../Models/IPurchase';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  count: number;
  data: T;
}
@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private apiUrl = 'http://localhost:3000/purchases';

  constructor(private http: HttpClient) { }



  getPurchases(): Observable<ApiResponse<IPurchase[]>> {
    return this.http.get<ApiResponse<IPurchase[]>>(this.apiUrl);
  }

  getPurchasesById(id: string): Observable<{ success: boolean; data: IPurchase }> {
    return this.http.get<{ success: boolean; data: IPurchase }>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  createPurchase(purchase: any): Observable<any> {
    return this.http.post(this.apiUrl, purchase);
  }

  updatePurchase(id: string, purchase: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, purchase);
  }

  deletePurchase(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
