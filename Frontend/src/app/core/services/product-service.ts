import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProduct } from '../Models/product.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../Models/api-response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products'
  constructor(private http: HttpClient) {
    
    
  }
  getProducts() : Observable<ApiResponse<IProduct[]>>{
    return this.http.get<ApiResponse<IProduct[]>>(this.apiUrl)
  }
  addProduct(product: IProduct) : Observable<{
    success: boolean;
    message: string;
    data: IProduct;
  }>{
    return this.http.post<{
      success: boolean;
      message: string;
      data: IProduct;
    }>(this.apiUrl, product)
  }

  updateProduct(
    id: string,
    product: Partial<IProduct>
  ): Observable<{
    success: boolean;
    message: string;
    data: IProduct;
  }> {
    return this.http.put<{
      success: boolean;
      message: string;
      data: IProduct;
    }>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.delete<{
      success: boolean;
      message: string;
    }>(`${this.apiUrl}/${id}`);
  }
}
