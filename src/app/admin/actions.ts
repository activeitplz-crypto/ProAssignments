
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { add } from 'date-fns';

async function verifyAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized');
  }
  return supabase;
}

export async function approvePayment(formData: FormData) {
  const supabase = await verifyAdmin();
  const paymentId = formData.get('paymentId') as string;
  const userId = formData.get('userId') as string;
  const planId = formData.get('planId') as string;
  
  // Use a transaction to ensure all or nothing
  const { error } = await supabase.rpc('approve_payment_and_update_user', {
    p_payment_id: paymentId,
    p_user_id: userId,
    p_plan_id: planId,
  });

  if (error) {
    console.error('RPC Error:', error);
    throw new Error(`Failed to approve payment: ${error.message}`);
  }

  revalidatePath('/admin');
  revalidatePath('/(app)/dashboard');
}

export async function rejectPayment(formData: FormData) {
  const supabase = await verifyAdmin();
  const paymentId = formData.get('paymentId') as string;

  const { error } = await supabase.from('payments').update({ status: 'rejected' }).eq('id', paymentId);
  if (error) throw new Error(error.message);

  revalidatePath('/admin');
}

export async function approveWithdrawal(formData: FormData) {
  const supabase = await verifyAdmin();
  const withdrawalId = formData.get('withdrawalId') as string;
  
  // Here you might also decrease user's total_earning
  const { error } = await supabase.from('withdrawals').update({ status: 'approved' }).eq('id', withdrawalId);
  if (error) throw new Error(error.message);

  revalidatePath('/admin');
}

export async function rejectWithdrawal(formData: FormData) {
  const supabase = await verifyAdmin();
  const withdrawalId = formData.get('withdrawalId') as string;

  // In a real app, you would also need to return the amount to the user's balance.
  // This is a simplified example.
  const { error } = await supabase.from('withdrawals').update({ status: 'rejected' }).eq('id', withdrawalId);
  if (error) throw new Error(error.message);

  revalidatePath('/admin');
}

export async function seedInitialPlans() {
    const supabase = await verifyAdmin();
    const initialPlans = [
      { name: 'Basic Plan', investment: 1000, daily_earning: 200, period_days: 90, total_return: 18000, referral_bonus: 200 },
      { name: 'Standard Plan', investment: 1500, daily_earning: 300, period_days: 90, total_return: 27000, referral_bonus: 300 },
      { name: 'Advanced Plan', investment: 2000, daily_earning: 400, period_days: 90, total_return: 36000, referral_bonus: 400 },
      { name: 'Premium Plan', investment: 3000, daily_earning: 600, period_days: 90, total_return: 54000, referral_bonus: 600 },
      { name: 'Elite Plan', investment: 4500, daily_earning: 900, period_days: 90, total_return: 81000, referral_bonus: 900 },
      { name: 'Pro Plan', investment: 7000, daily_earning: 1400, period_days: 90, total_return: 126000, referral_bonus: 1400 },
      { name: 'Business Plan', investment: 10000, daily_earning: 2000, period_days: 90, total_return: 180000, referral_bonus: 2000 },
      { name: 'Ultimate Plan', investment: 40000, daily_earning: 8000, period_days: 90, total_return: 720000, referral_bonus: 8000 },
    ];

    const { error } = await supabase.from('plans').insert(initialPlans);
    if(error){
        console.error("Error seeding plans from admin", error);
        throw new Error("Failed to seed plans.");
    }

    revalidatePath('/admin');
    revalidatePath('/(app)/plans');
}
