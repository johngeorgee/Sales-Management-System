import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../Models/iuser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  constructor(private http: HttpClient) {
    
  }
  login(email: string, password: string) :  Observable<LoginResponse> {
   return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`,{
    email, password
   }).pipe(tap(response=>{
    localStorage.setItem(this.TOKEN_KEY, response.token);
    if(response.user){
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    }
   }));
  }
  register(userData: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/auth/register`,
      userData
    );
  }

  logout(): Observable<any> {

    return this.http
      .post(
        `${this.apiUrl}/auth/logout`,
        {}
      )
      .pipe(
        tap(() => {
          this.clearAuth();
        })
      );
  }
  getUser(): any | null {

    const user = localStorage.getItem(this.USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  getToken() : string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  hasPermission(permission: string): boolean {

    const user = this.getUser();

    if (!user) {
      return false;
    }

    const permissions = user.permissions ?? [];

    return permissions.includes(permission);
  }

  clearAuth(): void {

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

}
