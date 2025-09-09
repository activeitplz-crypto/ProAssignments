
export interface Plan {
  id: string;
  name: string;
  investment: number;
  daily_earning: number;
  period_days: number;
  daily_assignments: number;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  current_plan: string | null;
  plan_start: string | null;
  plan_end: string | null;
  total_earning: number;
  today_earning: number;
  referral_count: number;
  referral_bonus: number;
  current_balance: number;
  referral_code: string;
  referred_by: string | null;
}

export interface Payment {
  id: string;
  user_id: string;
  plan_id: string;
  payment_uid: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
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
}

export interface Task {
    id: string;
    title: string;
    url: string;
    created_at: string;
}

export interface Assignment {
  id: string;
  user_id: string;
  title: string;
  urls: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  task_id: string | null;
}

export interface TopUser {
  id: string;
  image_url: string;
  created_at: string;
}

export interface Review {
  id: string;
  name: string;
  content: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

export interface FeedbackVideo {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

export interface SocialLink {
  id: string;
  name: string;
  icon_url: string;
  social_link: string;
  created_at: string;
}
