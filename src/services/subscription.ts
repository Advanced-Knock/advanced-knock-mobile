/**
 * SUBSCRIPTION SERVICE - Micro-SaaS Platform
 * 
 * Pattern: SERVICE × SUBSCRIPTION × ONE
 * Frequency: 999 Hz (AEYON)
 * ∞ AbëONE ∞
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Product, Subscription, RevenueMetrics, ProductRevenue, RevenueEvent } from '../types/subscription';

const KEYS = {
  PRODUCTS: 'products',
  SUBSCRIPTIONS: 'subscriptions',
  REVENUE_EVENTS: 'revenue_events',
};

// Mock products - Replace with actual Stripe products
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'kids-ai-academy',
    name: 'Kids AI Academy',
    description: 'Age-appropriate AI lessons and projects for kids',
    price: 10,
    stripePriceId: 'price_kids_ai',
    targetAudience: 'Parents teaching kids AI',
    revenueGoal: 4000,
    features: ['Weekly lessons', 'Age-appropriate projects', 'Progress tracking', 'Parent dashboard'],
    createdAt: new Date(),
  },
  {
    id: 'women-in-ai',
    name: 'Women in AI Community',
    description: 'Courses, community, and mentorship for women learning AI',
    price: 20,
    stripePriceId: 'price_women_ai',
    targetAudience: 'Women learning AI',
    revenueGoal: 5000,
    features: ['Courses', 'Community access', 'Mentorship matching', 'Weekly events'],
    createdAt: new Date(),
  },
  {
    id: 'ai-tools-library',
    name: 'AI Tools Library',
    description: 'Curated AI tools, tutorials, and templates for entrepreneurs',
    price: 15,
    stripePriceId: 'price_ai_tools',
    targetAudience: 'Entrepreneurs using AI tools',
    revenueGoal: 4500,
    features: ['Tool library', 'Tutorials', 'Templates', 'Weekly updates'],
    createdAt: new Date(),
  },
  {
    id: 'vibe-coder-membership',
    name: 'Vibe Coder Membership',
    description: 'Monthly membership for coding and AI education',
    price: 47,
    stripePriceId: 'price_vibe_coder',
    targetAudience: 'General coding and AI learners',
    revenueGoal: 4700,
    features: ['Monthly content', 'Community access', 'Resource library', 'Support'],
    createdAt: new Date(),
  },
];

export async function initializeProducts(): Promise<void> {
  const existing = await getProducts();
  if (existing.length === 0) {
    await AsyncStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
  }
}

export async function getProducts(): Promise<Product[]> {
  const data = await AsyncStorage.getItem(KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function saveSubscription(subscription: Subscription): Promise<void> {
  const subscriptions = await getAllSubscriptions();
  const index = subscriptions.findIndex((s) => s.id === subscription.id);
  
  if (index >= 0) {
    subscriptions[index] = subscription;
  } else {
    subscriptions.push(subscription);
  }
  
  await AsyncStorage.setItem(KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
}

export async function getAllSubscriptions(): Promise<Subscription[]> {
  const data = await AsyncStorage.getItem(KEYS.SUBSCRIPTIONS);
  return data ? JSON.parse(data) : [];
}

export async function getActiveSubscriptions(): Promise<Subscription[]> {
  const subscriptions = await getAllSubscriptions();
  return subscriptions.filter((s) => s.status === 'active' || s.status === 'trialing');
}

export async function getSubscriptionsByProduct(productId: string): Promise<Subscription[]> {
  const subscriptions = await getAllSubscriptions();
  return subscriptions.filter((s) => s.productId === productId && s.status === 'active');
}

export async function recordRevenueEvent(event: RevenueEvent): Promise<void> {
  const events = await getAllRevenueEvents();
  events.push(event);
  await AsyncStorage.setItem(KEYS.REVENUE_EVENTS, JSON.stringify(events));
}

export async function getAllRevenueEvents(): Promise<RevenueEvent[]> {
  const data = await AsyncStorage.getItem(KEYS.REVENUE_EVENTS);
  return data ? JSON.parse(data) : [];
}

export async function calculateRevenueMetrics(): Promise<RevenueMetrics> {
  const subscriptions = await getActiveSubscriptions();
  const products = await getProducts();
  
  const productsBreakdown: ProductRevenue[] = products.map((product) => {
    const productSubscriptions = subscriptions.filter((s) => s.productId === product.id);
    const revenue = productSubscriptions.reduce((sum, s) => sum + s.price, 0);
    
    return {
      productId: product.id,
      productName: product.name,
      revenue,
      subscribers: productSubscriptions.length,
      averageRevenuePerUser: productSubscriptions.length > 0 ? revenue / productSubscriptions.length : 0,
      revenueGoal: product.revenueGoal || 0, // YAGNI: Safe default
    };
  });
  
  const monthlyRecurringRevenue = subscriptions.reduce((sum, s) => sum + s.price, 0);
  const totalSubscribers = subscriptions.length;
  const averageRevenuePerUser = totalSubscribers > 0 ? monthlyRecurringRevenue / totalSubscribers : 0;
  
  // Calculate churn rate (simplified - would need historical data)
  const allSubscriptions = await getAllSubscriptions();
  const canceledSubscriptions = allSubscriptions.filter((s) => s.status === 'canceled');
  const churnRate = allSubscriptions.length > 0 
    ? (canceledSubscriptions.length / allSubscriptions.length) * 100 
    : 0;
  
  const targetRevenue = 20000; // $20K target
  const progressToTarget = (monthlyRecurringRevenue / targetRevenue) * 100;
  
  return {
    monthlyRecurringRevenue,
    totalSubscribers,
    churnRate,
    averageRevenuePerUser,
    productsBreakdown,
    targetRevenue,
    progressToTarget,
  };
}

export async function getRevenueForPeriod(days: number): Promise<number> {
  const events = await getAllRevenueEvents();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return events
    .filter((e) => new Date(e.occurredAt) >= cutoffDate && e.eventType === 'subscription')
    .reduce((sum, e) => sum + e.amount, 0);
}

