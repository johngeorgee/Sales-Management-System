import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ISupplier, ISupplierDetailsResponse } from '../Models/isupplier';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private apiUrl = 'http://localhost:3000/suppliers'
  constructor(private http: HttpClient) {

  }
  getSuppliers(): Observable<ISupplier[]> {
    return this.http.get<{ status: boolean, count: number, data: ISupplier[] }>(`${this.apiUrl}`)
      .pipe(map(response => response.data))
  }
  getSupplierById(id: string): Observable<ISupplierDetailsResponse> {
    return this.http.get<ISupplierDetailsResponse>(`${this.apiUrl}/${id}`)
  }
  addSupplier(supplier: Partial<ISupplier>): Observable<ISupplier> {
    return this.http.post<ISupplier>(`${this.apiUrl}`, supplier)
  }
  updateSupplier(id: string, supplier: Partial<ISupplier>): Observable<ISupplier> {
    return this.http.put<ISupplier>(`${this.apiUrl}/${id}`, supplier)
  };
  deleteSupplier(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string; }>(`${this.apiUrl}/${id}`)
  }
}



