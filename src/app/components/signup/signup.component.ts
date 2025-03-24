import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {Router, RouterModule} from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl:'signup.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule]
})
export class SignupComponent {
  signupForm: FormGroup;
  otpForm: FormGroup;
  errorMessage: string = '';
  showOtpField: boolean = false;
  userEmail: string = '';
  roles = [
    { value: 'USER', label: 'Regular User' },
    { value: 'ADMIN', label: 'Gym Administrator' }
  ];

  successMessage: string = '';

  loading: boolean = false;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['',[Validators.required]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  onSignupSubmit(): void {
    if (this.signupForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const signupData = {
        name: this.signupForm.get('name')?.value,
        email: this.signupForm.get('email')?.value,
        password: this.signupForm.get('password')?.value,
        role: this.signupForm.get('role')?.value
      };

      this.authService.register(signupData).subscribe({
        next: (response) => {
          this.loading = false;
          this.showOtpField = true;
          this.successMessage = 'Registration successful! Please verify your email with OTP.';
          console.log('Registration successful:', response);
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 409) {
            this.errorMessage = 'This email is already registered or pending verification.';
          } else {
            this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          }
          console.error('Registration error:', error);
        }
      });
    }
  }

  onOtpSubmit(): void {
    if (this.otpForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const email = this.signupForm.get('email')?.value;
      const otp = this.otpForm.get('otp')?.value;

      this.authService.verifyOTP(email, otp).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Email verified successfully! Please login to continue.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 400) {
            this.errorMessage = 'Invalid OTP. Please try again.';
          } else if (error.status === 404) {
            this.errorMessage = 'Verification failed. Please try registering again.';
            setTimeout(() => {
              this.showOtpField = false;
              this.signupForm.reset();
              this.otpForm.reset();
            }, 2000);
          } else {
            this.errorMessage = 'Verification failed. Please try again.';
          }
          console.error('OTP verification error:', error);
        }
      });
    }
  }
  resendOTP(): void {
    const email = this.signupForm.get('email')?.value;
    this.loading = true;
    this.errorMessage = '';

    this.authService.resendOTP(email).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'New OTP has been sent to your email.';
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to resend OTP.';
        console.error('Resend OTP error:', error);
      }
    });
  }
}
