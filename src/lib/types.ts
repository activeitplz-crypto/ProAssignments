
export interface Plan {
  id: string;
  name: string;
  investment: number;
  daily_earning: number;
  period_days: number;
  total_return: number;
  referral_bonus: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  current_plan: string | null;
  plan_start: string | null;
  plan_end: string | null;
  total_earning: number;
  today_earning: number;
  referral_count: number;
  referral_bonus: number;
  current_balance: number;
  referral_code: string;
  avatarUrl?: string | null;
}

export interface Payment {
  id: string;
  user_id: string;
  plan_id: string;
  payment_uid: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  users?: Pick<UserProfile, 'name'>;
  plans?: Pick<Plan, 'name'>;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  account_info: {
    bank_name: string;
    holder_name: string;
    account_number: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  users?: Pick<UserProfile, 'name'>;
}
