import {Component, OnInit} from '@angular/core';
import {Gym} from '../../models/gym';
import {SubscriptionPlan} from '../../models/subscription-plan';
import {ActivatedRoute} from '@angular/router';
import {GymService} from '../../services/gym.service';
import {SubscriptionService} from '../../services/subscription.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-gym-detail',
  imports:[CommonModule],
  templateUrl: './gym-detail.component.html',
  styles: [`
    .gym-detail-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .hero-section {
      background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/src/assets/gym-background.png');
      background-size : cover;
      background-position: center;  /* Added this */
      background-repeat: no-repeat;
      color: white;
      padding: 4rem 2rem;
      margin-bottom: 2rem;
    }

    .content-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    .gym-meta {
      display: flex;
      gap: 2rem;
      margin-top: 1rem;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      max-width: 1200px;
      margin: -2rem auto 2rem;
      padding: 0 1rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #4285f4;
    }

    .content-tabs {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .equipment-grid, .trainers-grid, .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 3rem;
      margin-top: 0.5rem;
    }

    .equipment-card, .trainer-card, .plan-card {
      background: white;
      border-radius: 10px;
      overflow: scroll ;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-5px);
      }
    }

    .equipment-card img, .trainer-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .equipment-info, .trainer-info, .plan-header {
      padding: 1rem;
    }

    .plan-card {
      padding: 2rem;
      text-align: center;
    }

    .price {
      font-size: 2rem;
      color: #4285f4;
      font-weight: bold;
    }

    .nav-tabs {
      border: none;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .nav-link {
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      color: #666;

      &.active {
        background: #4285f4;
        color: white;
      }
    }
  `]
})
export class GymDetailComponent implements OnInit {
  gym: Gym | null = null;
  loading = true;
  error = '';
  successMessage: string = '';
  errorMessage: string = '';
  activeTab: string = 'equipment';

  constructor(
    private route: ActivatedRoute,
    private gymService: GymService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    const gymId = this.route.snapshot.paramMap.get('id');
    if (gymId) {
      this.loadGymDetails(+gymId);
    }
  }

  private loadGymDetails(gymId: number): void {
    console.log('Loading gym details for ID:', gymId);
    this.gymService.getGymById(gymId).subscribe({
      next: (gym) => {
        console.log('Received gym data:', gym);
        this.gym = gym;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading gym:', error);
        this.error = 'Failed to load gym details';
        this.loading = false;
      }
    });
  }

  subscribeToPlan(planId: number): void {
    this.subscriptionService.subscribeToPlan(planId).subscribe({
      next: (response) => {
        console.log('Successfully subscribed to plan');
        // Add user feedback
        this.successMessage = 'Successfully subscribed to plan!';
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Subscription error:', error);
        this.errorMessage = error?.error?.message || 'Failed to subscribe to plan';
        this.successMessage = '';
      }
    });
  }
}
