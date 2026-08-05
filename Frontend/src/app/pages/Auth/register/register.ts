// register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

export interface UserRegistration {
  username: string;
  password: string;
  phoneNumber?: number;
  gender?: 'male' | 'female';
  email: string;
  age?: number;
  isActive?: boolean;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  user: UserRegistration = {
    username: '',
    password: '',
    email: '',
    isActive: true
  };
  
  hidePassword: boolean = true;

  constructor(private router: Router) {}

  isFormValid(): boolean {
    return (
      this.user.username?.trim()?.length > 0 &&
      this.user.email?.trim()?.length > 0 &&
      this.user.password?.length >= 8 &&
      this.isValidEmail(this.user.email)
    );
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    // Implement your registration logic here
    console.log('Registration attempt:', this.user);
    
    // You would typically call your registration service here
    // this.authService.register(this.user).subscribe({
    //   next: (response) => {
    //     console.log('Registration successful', response);
    //     this.router.navigate(['/login']);
    //   },
    //   error: (error) => {
    //     console.error('Registration failed', error);
    //   }
    // });
    
    // For demo purposes, redirect to login
    // this.router.navigate(['/login']);
  }
}