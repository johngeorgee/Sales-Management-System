// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  hidePassword: boolean = true;

  constructor(private router: Router) {}

  onSubmit(): void {
    // Implement your login logic here
    console.log('Login attempt:', { 
      email: this.email, 
      password: this.password,
      rememberMe: this.rememberMe 
    });
    
    // Redirect to dashboard after successful login
    // this.router.navigate(['/dashboard']);
  }
}