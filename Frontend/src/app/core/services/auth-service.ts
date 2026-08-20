import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginResponse } from '../Models/iuser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  // BehaviorSubject for real-time auth state 
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());
  private currentUser = new BehaviorSubject<any>(this.getUser());

  constructor(private http: HttpClient) {
    
  }
  login(email: string, password: string) :  Observable<LoginResponse> {
   return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`,{
    email, 
    password
   }).pipe(tap(response=>{
    localStorage.setItem(this.TOKEN_KEY, response.token);
    if(response.user){
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      this.currentUser.next(response.user)
    }
    this.authStatus.next(true);
   }));
  }
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`,userData);
  }

  logout(): Observable<any> {

    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
        tap(() => {
          this.clearAuth();
        })
      );
  }
  getUser(): any | null {
    const user = localStorage.getItem(this.USER_KEY);

    if (!user) return null;

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

    if (!user) return false;
    const permissions = user.permissions ?? [];
    return permissions.includes(permission);
  }

  hasAnyPermission(permissions: string[]) : boolean {
    const user = this.getUser();
    if(!user) return false;
    const userPermissions = user.role?.permissions ?? [];
    return permissions.some(p => userPermissions.includes(p));
  }

  hasRole(roleName: string) : boolean {
    const user = this.getUser();
    if(!user) return false;
    return user.role?.name === roleName;
  }

  hasAnyRole(roleNames: string[]){
    const user = this.getUser();
    if(!user) return false;
    return roleNames.includes(user.role?.name)
  }

  
  getUsername(): string {
    const user = this.getUser();
    return user?.username || 'User';
  }

  getRoleName(): string {
    const user = this.getUser();
    return user?.role?.name || 'No Role Assigned';
  }

  getPermission(): string{
    const user = this.getUser();
    return user?.role?.permissions ?? []
  }
  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  getCurrentUser() {
    return this.currentUser.asObservable();
  }

  clearAuth(): void {

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

}
