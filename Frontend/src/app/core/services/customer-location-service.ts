import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomerLocation } from '../Models/icustomer-location';

@Injectable({
  providedIn: 'root',
})
export class CustomerLocationService {
  private apiUrl = 'http://localhost:5000/customer-locations';

  constructor(private http: HttpClient) {}

  // Get all locations
  getLocations(): Observable<ICustomerLocation[]> {
    return this.http.get<ICustomerLocation[]>(this.apiUrl);
  }

  // Get location by ID
  getLocationById(id: string): Observable<ICustomerLocation> {
    return this.http.get<ICustomerLocation>(
      `${this.apiUrl}/${id}`
    );
  }

  // Add location
  addLocation(
    location: ICustomerLocation
  ): Observable<ICustomerLocation> {
    return this.http.post<ICustomerLocation>(
      this.apiUrl,
      location
    );
  }

  // Update location
  updateLocation(
    id: string,
    location: Partial<ICustomerLocation>
  ): Observable<ICustomerLocation> {
    return this.http.put<ICustomerLocation>(
      `${this.apiUrl}/${id}`,
      location
    );
  }

  // Delete location
  deleteLocation(id: string): Observable<{
    message: string;
  }> {
    return this.http.delete<{
      message: string;
    }>(`${this.apiUrl}/${id}`);
  }
}
