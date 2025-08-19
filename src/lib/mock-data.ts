
import type { Plan, UserProfile } from './types';

export const MOCK_AUTH_COOKIE_NAME = 'mock-auth-token';

export const MOCK_USER: UserProfile = {
  id: 'mock-user-123',
  name: 'Jahanzaib',
  email: 'jaanzaib1212@gmail.com',
  current_plan: 'Premium Plan',
  plan_start: new Date('2023-10-01T10:00:00Z').toISOString(),
  plan_end: new Date('2024-01-01T10:00:00Z').toISOString(),
  total_earning: 12500,
  today_earning: 600,
  referral_count: 5,
  referral_bonus: 3000,
  current_balance: 7500,
  referral_code: 'JANZY-REF-123',
};

export const MOCK_PLANS: Plan[] = [
    { id: '1', name: 'Basic Plan', investment: 1000, daily_earning: 200, period_days: 90, total_return: 18000, referral_bonus: 200, created_at: new Date().toISOString() },
    { id: '2', name: 'Standard Plan', investment: 1500, daily_earning: 300, period_days: 90, total_return: 27000, referral_bonus: 300, created_at: new Date().toISOString() },
    { id: '3', name: 'Advanced Plan', investment: 2000, daily_earning: 400, period_days: 90, total_return: 36000, referral_bonus: 400, created_at: new Date().toISOString() },
    { id: '4', name: 'Premium Plan', investment: 3000, daily_earning: 600, period_days: 90, total_return: 54000, referral_bonus: 600, created_at: new Date().toISOString() },
    { id: '5', name: 'Elite Plan', investment: 4500, daily_earning: 900, period_days: 90, total_return: 81000, referral_bonus: 900, created_at: new Date().toISOString() },
    { id: '6', name: 'Pro Plan', investment: 7000, daily_earning: 1400, period_days: 90, total_return: 126000, referral_bonus: 1400, created_at: new Date().toISOString() },
    { id: '7', name: 'Business Plan', investment: 10000, daily_earning: 2000, period_days: 90, total_return: 180000, referral_bonus: 2000, created_at: new Date().toISOString() },
    { id: '8', name: 'Ultimate Plan', investment: 40000, daily_earning: 8000, period_days: 90, total_return: 720000, referral_bonus: 8000, created_at: new Date().toISOString() },
];
