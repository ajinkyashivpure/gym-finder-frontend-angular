import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, catchError, EMPTY, Observable, throwError} from 'rxjs';
import { tap } from 'rxjs/operators';
import {isPlatformBrowser} from '@angular/common';
import {jwtDecode} from 'jwt-decode';



interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const userRole = localStorage.getItem('userRole');
      return userRole === 'ADMIN';
    }
    return false;
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      this.decodeAndStoreUserInfo(token);
    }
  }
  private removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    }
  }

  private decodeAndStoreUserInfo(token: string): void {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.role) {
        localStorage.setItem('userRole', decoded.role);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      this.decodeAndStoreUserInfo(token);
      this.loadUserProfile();
    }
  }


  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  verifyOTP(email: string, otp: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('otp', otp);

    return this.http.post(`${this.apiUrl}/verify-otp`, null, {
      params,
      responseType: 'text'  // Add this line
    }).pipe(
      catchError(error => {
        console.error('OTP verification error:', error);
        return throwError(() => error.error || 'OTP verification failed');
      })
    );
  }
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      responseType: 'text'
    }).pipe(
      tap((token: string) => {
        if (token) {
          this.setToken(token);
          const decodedToken = jwtDecode<any>(token);
          if (decodedToken?.role) {
            localStorage.setItem('userRole', decodedToken.role);
          }
          this.loadUserProfile();
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => 'Invalid credentials');
      })
    );
  }

  resendOTP(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-otp`, { email });
  }

  private loadUserProfile(): void {
    this.http.get<User>('http://localhost:8080/api/users/me').pipe(
      catchError((error) => {
        this.logout();
        console.error('Error loading user profile:', error);
        return EMPTY; // or return of(null) if you want to emit a value
      })
    ).subscribe(user => {
      if (user) {
        this.currentUserSubject.next(user);
        localStorage.setItem('userRole', user.role);
      }
    });
  }

  logout(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }
}
