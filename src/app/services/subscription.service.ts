import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {SubscriptionPlan} from '../models/subscription-plan';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = 'http://localhost:8080/api/subscriptions';

  constructor(private http: HttpClient) { }

  getGymSubscriptionPlans(gymId: number): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${this.apiUrl}/gym/${gymId}/plans`);
  }

  createSubscriptionPlan(gymId: number, planData: any): Observable<SubscriptionPlan> {
    return this.http.post<SubscriptionPlan>(`${this.apiUrl}/gym/${gymId}/plans`, planData);
  }

  subscribeToPlan(planId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscribe/${planId}`, {});
  }

  getMySubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}/my-subscriptions`);
  }

  cancelSubscription(subscriptionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cancel/${subscriptionId}`, {});
  }
}
