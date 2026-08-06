// register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../../core/services/users-service';
import { AuthService } from '../../../core/services/auth-service';

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
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  hidePassword: boolean = true;

  loading = false;
  error = '';
  registerForm!: FormGroup

  constructor(private router: Router, private fb: FormBuilder, private authServ: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email : ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['' ],
      gender: ['', [Validators.required]],
      age: ['', [Validators.minLength(18), Validators.maxLength(60)]]



    })
  }
  
  isFormValid(): boolean {
    return this.registerForm.valid
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';

    const userData = this.registerForm.value;

    this.authServ.register(userData).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.loading = false;
        this.error = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  // Helper getters for template
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get gender() { return this.registerForm.get('gender'); }
  get age() { return this.registerForm.get('age'); }
}