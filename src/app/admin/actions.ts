
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

async function verifyAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error('Not authorized');
  }
  return supabase;
}

export async function approvePayment(formData: FormData) {
  const supabase = await verifyAdmin();
  const paymentId = formData.get('paymentId') as string;

  if (!paymentId) {
    return { error: 'Payment ID is missing.' };
  }

  try {
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('user_id, plan_id')
      .eq('id', paymentId)
      .eq('status', 'pending')
      .single();

    if (paymentError || !payment) {
      throw new Error('Pending payment not found or could not be fetched.');
    }

    const { user_id, plan_id } = payment;

    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('name, period_days')
      .eq('id', plan_id)
      .single();

    if (planError || !plan) {
      throw new Error('Plan details not found.');
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        current_plan: plan.name,
        plan_start: new Date().toISOString(),
        plan_end: new Date(new Date().getTime() + plan.period_days * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', user_id);

    if (profileError) {
      throw new Error('Failed to update user profile with new plan.');
    }

    const { error: updatePaymentError } = await supabase
      .from('payments')
      .update({ status: 'approved' })
      .eq('id', paymentId);

    if (updatePaymentError) {
      throw new Error('Failed to update payment status.');
    }
  
  } catch (error: any) {
    console.error('Approve Payment Transaction Error:', error.message);
    return { error: error.message };
  }
  
  revalidatePath('/admin');
  revalidatePath('/admin?tab=payments', 'page');
}


export async function rejectPayment(formData: FormData) {
  const supabase = await verifyAdmin();
  const paymentId = formData.get('paymentId') as string;

  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected' })
    .eq('id', paymentId);
    
  if (error) {
    console.error('Reject Payment Error:', error);
    return { error: 'Failed to reject payment.' };
  }

  revalidatePath('/admin');
  revalidatePath('/admin?tab=payments', 'page');
}

export async function approveWithdrawal(formData: FormData) {
  const supabase = await verifyAdmin();
  const withdrawalId = formData.get('withdrawalId') as string;
  
  try {
    const { data: withdrawal, error: wError } = await supabase
      .from('withdrawals')
      .select('amount, user_id')
      .eq('id', withdrawalId)
      .eq('status', 'pending')
      .single();

    if (wError || !withdrawal) throw new Error('Pending withdrawal not found.');

    const { data: profile, error: pError } = await supabase
      .from('profiles')
      .select('current_balance')
      .eq('id', withdrawal.user_id)
      .single();
    
    if (pError || !profile) throw new Error('User profile not found.');

    const newBalance = profile.current_balance - withdrawal.amount;
    if (newBalance < 0) throw new Error('User has insufficient funds for this withdrawal.');

    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({ current_balance: newBalance })
      .eq('id', withdrawal.user_id);

    if (profileUpdateError) throw new Error('Failed to update user balance.');

    const { error: withdrawalUpdateError } = await supabase
      .from('withdrawals')
      .update({ status: 'approved' })
      .eq('id', withdrawalId);

    if (withdrawalUpdateError) throw new Error('Failed to update withdrawal status.');

  } catch (error: any) {
     console.error('Approve Withdrawal Error:', error);
     return { error: error.message };
  }
  
  revalidatePath('/admin');
  revalidatePath('/admin?tab=withdrawals', 'page');
  revalidatePath('/dashboard');
}

export async function rejectWithdrawal(formData: FormData) {
  const supabase = await verifyAdmin();
  const withdrawalId = formData.get('withdrawalId') as string;

  const { error } = await supabase
    .from('withdrawals')
    .update({ status: 'rejected' })
    .eq('id', withdrawalId);

  if (error) {
    console.error('Reject Withdrawal Error:', error);
    return { error: 'Failed to reject withdrawal.' };
  }

  revalidatePath('/admin');
  revalidatePath('/admin?tab=withdrawals', 'page');
}

const planSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Plan name is required'),
    investment: z.coerce.number().positive('Investment must be a positive number'),
    daily_earning: z.coerce.number().positive('Daily earning must be a positive number'),
    period_days: z.coerce.number().int().positive('Period must be a positive integer'),
    total_return: z.coerce.number().positive('Total return must be a positive number'),
    referral_bonus: z.coerce.number().positive('Referral bonus must be a positive number'),
});

export async function savePlan(formData: z.infer<typeof planSchema>) {
    const supabase = await verifyAdmin();
    const validatedData = planSchema.parse(formData);
    const { id, ...planData } = validatedData;

    try {
        if (id) {
            const { error } = await supabase.from('plans').update(planData).eq('id', id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('plans').insert(planData);
            if (error) throw error;
        }
    } catch (error: any) {
        console.error('Save Plan Error:', error);
        return { error: `Failed to save plan. Database error: ${error.message}` };
    }

    revalidatePath('/admin');
    revalidatePath('/admin?tab=plans', 'page');
    revalidatePath('/plans');
    return { error: null };
}
