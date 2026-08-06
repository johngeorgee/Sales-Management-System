import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, DeleteResponse, IUser, LoginResponse, UserResponse, UsersResponse } from '../Models/iuser';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:3000'

  constructor(private http:HttpClient) {
    
  }



  //Authorization Endpoints
  getUsers(): Observable<IUser[]> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/users`).pipe(map(res=> res.data))
  }

  getUserById(id: string) : Observable<UserResponse>{
    return this.http.get<UserResponse>(`${this.apiUrl}/users/${id}`);
  }
  updateUser (id: string, userData: Partial<IUser>) : Observable<ApiResponse<IUser>>{
    return this.http.put<ApiResponse<IUser>>(`${this.apiUrl}/users/${id}`, userData);
  }

  deleteUser(id: string) : Observable<DeleteResponse>{
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/user/${id}`)
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/roles`)
      .pipe(map(response => response.data));
  }

}
