
export interface Gym {
  id: number;
  name: string;
  ownerName: string;
  contactNumber: string;
  address: string;
  latitude: number;
  longitude: number;
  equipment: Equipment[];
  trainers: Trainer[];
  subscriptionPlans: SubscriptionPlan[];
}
export interface Equipment {
  name: string;
  description: string;
  imageUrl: string;
}

export interface Trainer {
  name: string;
  specialization: string;
  contactNumber: string;
  imageUrl: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  durationInMonths: number;
}

