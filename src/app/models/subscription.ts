import {SubscriptionPlan} from './subscription-plan';

export interface Subscription {
  id: number;
  subscriptionPlan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
