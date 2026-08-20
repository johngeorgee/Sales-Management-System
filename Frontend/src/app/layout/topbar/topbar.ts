import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';


@Component({
  selector: 'app-topbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  isUserMenuOpen = false;

  username = '';
  roleName = '';
  userInitials = '';
  user: any = null;
  hasRole = false;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.loadUserInfo()
  }

  loadUserInfo(): void {
    this.user = this.authService.getUser();
    if(this.user){
      this.username = this.user.username || 'User';
      this.roleName = this.user.role?.name || 'User';
      this.userInitials = this.getInitials(this.username);
      this.hasRole = !!this.user.role
    }
  }

  getInitials(name: string): string {
    if(!name) return 'U'
    const parts = name.split(' ');
    if(parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0).toUpperCase());
  }
  
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  logout(): void{
    this.authService.logout().subscribe({
      next :() => {
       
      },
      error: () =>{
        this.authService.clearAuth();
        window.location.href = '/login';
      }
    })
  }
  
  
  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isUserMenuOpen = false;
    }
  }
}
