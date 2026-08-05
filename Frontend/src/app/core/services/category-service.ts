import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ApiResponse } from '../Models/api-response';
import { ICategories } from '../Models/categories';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories'
  constructor(private http: HttpClient) {
    
    
  }
  getCategories() : Observable<ApiResponse<ICategories[]>>{
    return this.http.get<ApiResponse<ICategories[]>>(this.apiUrl)
  }
  addCategory(category: ICategories) : Observable<{
    success: boolean;
    message: string;
    data: ICategories;
  }>{
    return this.http.post<{
      success: boolean;
      message: string;
      data: ICategories;
    }>(this.apiUrl, category)
  }

  updateCategory(
    id: string,
    category: Partial<ICategories>
  ): Observable<{
    success: boolean;
    message: string;
    data: ICategories;
  }> {
    return this.http.put<{
      success: boolean;
      message: string;
      data: ICategories;
    }>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: string): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.delete<{
      success: boolean;
      message: string;
    }>(`${this.apiUrl}/${id}`);
  }
}
