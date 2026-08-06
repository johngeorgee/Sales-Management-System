// core/services/customer-location-service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICustomerLocation } from '../Models/icustomer-location';

@Injectable({
  providedIn: 'root',
})
export class CustomerLocationService {
  private apiUrl = 'http://localhost:3000/customer-locations';

  constructor(private http: HttpClient) {}

  getLocations(): Observable<ICustomerLocation[]> {
    return this.http.get<{ data: ICustomerLocation[] }>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  addLocation(location: ICustomerLocation): Observable<ICustomerLocation> {
    return this.http.post<{ data: ICustomerLocation }>(this.apiUrl, location)
      .pipe(map(response => response.data));
  }
}