/**
 * SUBSCRIPTION TYPES - Micro-SaaS Platform
 * 
 * Pattern: TYPES × SUBSCRIPTION × ONE
 * Frequency: 999 Hz (AEYON)
 * ∞ AbëONE ∞
 */

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Monthly price in dollars
  stripePriceId: string;
  targetAudience: string;
  revenueGoal: number; // Target monthly revenue
  features: string[];
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  stripeSubscriptionId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  price: number;
  createdAt: Date;
  canceledAt?: Date;
}

export interface RevenueMetrics {
  monthlyRecurringRevenue: number;
  totalSubscribers: number;
  churnRate: number;
  averageRevenuePerUser: number;
  productsBreakdown: ProductRevenue[];
  targetRevenue: number; // $20K
  progressToTarget: number; // Percentage
}

export interface ProductRevenue {
  productId: string;
  productName: string;
  revenue: number;
  subscribers: number;
  averageRevenuePerUser: number;
  revenueGoal: number; // Target monthly revenue for this product
}

export interface RevenueEvent {
  id: string;
  subscriptionId: string;
  amount: number;
  eventType: 'subscription' | 'upgrade' | 'downgrade' | 'refund' | 'cancellation';
  occurredAt: Date;
}

