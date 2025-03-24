import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {SubscriptionService} from '../../services/subscription.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-my-subscriptions',
  imports: [
    DatePipe
  ],
  templateUrl: './my-subscriptions.component.html'
})
export class MySubscriptionsComponent implements OnInit {
  subscriptions: Subscription[] = [];
  loading = true;
  error = '';

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.subscriptionService.getMySubscriptions().subscribe(
      subs => {
        this.subscriptions = subs;
        this.loading = false;
      },
      error => {
        this.error = 'Failed to load subscriptions';
        this.loading = false;
      }
    );
  }

  cancelSubscription(subscriptionId: number): void {
    if (confirm('Are you sure you want to cancel this subscription?')) {
      this.subscriptionService.cancelSubscription(subscriptionId).subscribe(
        () => {
          this.loadSubscriptions();
        },
        error => {
          this.error = 'Failed to cancel subscription';
        }
      );
    }
  }
}
