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
  
  // 1. Get plan details
  const { data: plan, error: planError } = await supabase.from('plans').select('*').eq('id', planId).single();
  if (planError || !plan) throw new Error('Plan not found');

  // 2. Update payment status
  const { error: paymentError } = await supabase.from('payments').update({ status: 'approved' }).eq('id', paymentId);
  if (paymentError) throw new Error(paymentError.message);

  // 3. Update user's profile with the new plan
  const plan_start = new Date();
  const plan_end = add(plan_start, { days: plan.period_days });
  
  const { error: userError } = await supabase.from('users').update({
    current_plan: plan.name,
    plan_start: plan_start.toISOString(),
    plan_end: plan_end.toISOString(),
  }).eq('id', userId);
  if (userError) throw new Error(userError.message);

  revalidatePath('/admin');
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

  const { error } = await supabase.from('withdrawals').update({ status: 'rejected' }).eq('id', withdrawalId);
  if (error) throw new Error(error.message);

  revalidatePath('/admin');
}
