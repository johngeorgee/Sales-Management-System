// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';

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
  loading = false;
  error: string = ''
  constructor(private router: Router, private authServ: AuthService) {}

  onSubmit(): void {
    if(!this.email || !this.password){
      this.error = 'Please enter email & Password';
      return;
    }
    this.loading = true;
    this.error = '';
    this.authServ.login(this.email, this.password).subscribe({
      next: (response) =>{
        console.log('Login Succesfully', response);
        this.loading = false;
        this.router.navigate(['/dashboard'])
      }, 
      error:(err) => {
        console.error('Login failed', err); 
        this.loading = false; 
        this.error = err.error?.message || 'Login failed. Please check your email and password.';
        
      },
    })
    }
    
    // Redirect to dashboard after successful login
    // this.router.navigate(['/dashboard']);
  }
