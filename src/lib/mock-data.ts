
import type { Plan, UserProfile, Payment, Withdrawal } from './types';

export const MOCK_AUTH_COOKIE_NAME = 'mock-auth-token';
export const MOCK_ADMIN_EMAIL = 'jnzb505@gmail.com';

// This is now our mock "database" of users
export const MOCK_USERS: UserProfile[] = [
  // Admin User
  {
    id: 'mock-admin-001',
    name: 'Admin',
    email: MOCK_ADMIN_EMAIL,
    current_plan: 'Ultimate Plan',
    plan_start: new Date('2023-10-01T10:00:00Z').toISOString(),
    plan_end: new Date('2024-01-01T10:00:00Z').toISOString(),
    total_earning: 99999,
    today_earning: 8000,
    referral_count: 50,
    referral_bonus: 25000,
    current_balance: 50000,
    referral_code: 'ADMIN-REF-001',
    avatarUrl: null,
  },
  // Default User for login
  {
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
    avatarUrl: null,
  },
   {
    id: 'mock-user-456',
    name: 'Ali Khan',
    email: 'ali.khan@example.com',
    current_plan: 'Standard Plan',
    plan_start: new Date('2023-10-26T10:00:00Z').toISOString(),
    plan_end: new Date('2024-01-26T10:00:00Z').toISOString(),
    total_earning: 5000,
    today_earning: 300,
    referral_count: 2,
    referral_bonus: 600,
    current_balance: 1500,
    referral_code: 'ALI-REF-456',
    avatarUrl: null,
  },
   {
    id: 'mock-user-789',
    name: 'Fatima Ahmed',
    email: 'fatima.ahmed@example.com',
    current_plan: 'Basic Plan',
    plan_start: new Date('2023-10-25T10:00:00Z').toISOString(),
    plan_end: new Date('2024-01-25T10:00:00Z').toISOString(),
    total_earning: 2000,
    today_earning: 200,
    referral_count: 1,
    referral_bonus: 200,
    current_balance: 500,
    referral_code: 'FATIMA-REF-789',
    avatarUrl: null,
  }
];

// Single MOCK_USER for simple access where we know one user is logged in
// DEPRECATED in favor of finding user in MOCK_USERS, but kept for non-user specific pages if needed.
export const MOCK_USER: UserProfile = MOCK_USERS[1];


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

export const MOCK_PAYMENTS: Payment[] = [
    { id: 'payment-1', user_id: 'mock-user-456', plan_id: '2', payment_uid: '123456789', status: 'pending', created_at: new Date().toISOString(), users: { name: 'Ali Khan' }, plans: { name: 'Standard Plan' } },
    { id: 'payment-2', user_id: 'mock-user-789', plan_id: '1', payment_uid: '987654321', status: 'approved', created_at: new Date('2023-10-25').toISOString(), users: { name: 'Fatima Ahmed' }, plans: { name: 'Basic Plan' } },
];

export const MOCK_WITHDRAWALS: Withdrawal[] = [
    { id: 'withdrawal-1', user_id: 'mock-user-123', amount: 500, account_info: { bank_name: 'Easypaisa', holder_name: 'Jahanzaib', account_number: '03123456789' }, status: 'pending', created_at: new Date().toISOString(), users: { name: 'Jahanzaib'} },
    { id: 'withdrawal-2', user_id: 'mock-user-456', amount: 1000, account_info: { bank_name: 'JazzCash', holder_name: 'Ali Khan', account_number: '03009876543' }, status: 'approved', created_at: new Date('2023-10-26').toISOString(), users: { name: 'Ali Khan'} },
];
