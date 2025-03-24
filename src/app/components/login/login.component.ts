import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

import {CommonModule, NgClass} from '@angular/common';
import {Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl:'login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin/gyms']);
          } else {
            this.router.navigate(['/map']);
          }
        },
        error: (error) => {
          this.errorMessage = 'Invalid credentials';
        }
      });
    }
  }
}
