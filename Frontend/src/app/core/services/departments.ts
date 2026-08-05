import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepartments } from '../Models/departments';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {

  private apiUrl = 'http://localhost:3000/departments';

  constructor(private http: HttpClient) {}

  // Get All Departments
  getDepartments(): Observable<{
    success: boolean;
    count: number;
    data: IDepartments[];
  }> {
    return this.http.get<{
      success: boolean;
      count: number;
      data: IDepartments[];
    }>(this.apiUrl);
  }

  // Get Department By ID
  getDepartmentById(id: string): Observable<{
    success: boolean;
    data: IDepartments;
  }> {
    return this.http.get<{
      success: boolean;
      data: IDepartments;
    }>(`${this.apiUrl}/${id}`);
  }

  // Add Department
  addDepartment(department: IDepartments): Observable<{
    success: boolean;
    message: string;
    data: IDepartments;
  }> {
    return this.http.post<{
      success: boolean;
      message: string;
      data: IDepartments;
    }>(this.apiUrl, department);
  }

  // Update Department
  updateDepartment(
    id: string,
    department: Partial<IDepartments>
  ): Observable<{
    success: boolean;
    message: string;
    data: IDepartments;
  }> {
    return this.http.put<{
      success: boolean;
      message: string;
      data: IDepartments;
    }>(`${this.apiUrl}/${id}`, department);
  }

  // Delete Department
  deleteDepartment(id: string): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.delete<{
      success: boolean;
      message: string;
    }>(`${this.apiUrl}/${id}`);
  }
}