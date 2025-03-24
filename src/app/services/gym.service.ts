import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Gym} from '../models/gym';
import {tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GymService {
  private apiUrl = 'http://localhost:8080/api/gyms';

  constructor(private http: HttpClient) { }

  getAllGyms(): Observable<Gym[]> {
    return this.http.get<Gym[]>(this.apiUrl);
  }

  updateGym(id: number, gymData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}`, gymData,{ headers });
  }

  deleteGym(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getGymById(id: number): Observable<Gym> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Request URL:', url);
    return this.http.get<Gym>(url).pipe(
      tap(response => console.log('API Response:', response)),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  searchGyms(name: string): Observable<Gym[]> {
    return this.http.get<Gym[]>(`${this.apiUrl}/search`, {
      params: { name }
    });
  }
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post('/api/files/upload', formData);
  }

  getNearbyGyms(latitude: number, longitude: number, radius: number = 5): Observable<Gym[]> {
    return this.http.get<Gym[]>(`${this.apiUrl}/nearby`, {
      params: { latitude: latitude.toString(), longitude: longitude.toString(), radius: radius.toString() }
    });
  }

  createGym(gymData: any): Observable<any> {
    console.log('Creating gym with data:', gymData); // Debug log
    console.log('Equipment data:', gymData.equipment); // Debug log
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(this.apiUrl, gymData, { headers });
  }
}
