
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Plan } from '@/lib/types';
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
  
  const { error } = await supabase
    .from('payments')
    .update({ status: 'approved' })
    .eq('id', paymentId);
  
  if (error) console.error('Approve Payment Error:', error);

  // In a real app, you'd also update the user's plan details in the profiles table.
  // And start calculating their earnings. This is a complex task for another time.

  revalidatePath('/admin');
}

export async function rejectPayment(formData: FormData) {
  const supabase = await verifyAdmin();
  const paymentId = formData.get('paymentId') as string;

  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected' })
    .eq('id', paymentId);
    
  if (error) console.error('Reject Payment Error:', error);

  revalidatePath('/admin');
}

export async function approveWithdrawal(formData: FormData) {
  const supabase = await verifyAdmin();
  const withdrawalId = formData.get('withdrawalId') as string;
  
  // First, get the withdrawal amount and user_id
  const { data: withdrawal } = await supabase
    .from('withdrawals')
    .select('amount, user_id')
    .eq('id', withdrawalId)
    .single();

  if (!withdrawal) return;

  // Next, subtract the amount from user's balance
  // Note: This should ideally be a database transaction or an RPC call
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_balance')
    .eq('id', withdrawal.user_id)
    .single();
    
  if (profile) {
    const newBalance = profile.current_balance - withdrawal.amount;
    await supabase.from('profiles').update({ current_balance: newBalance }).eq('id', withdrawal.user_id);
  }

  // Finally, update the withdrawal status
  const { error } = await supabase
    .from('withdrawals')
    .update({ status: 'approved' })
    .eq('id', withdrawalId);

  if (error) console.error('Approve Withdrawal Error:', error);
  
  revalidatePath('/admin');
  revalidatePath('/dashboard');
}

export async function rejectWithdrawal(formData: FormData) {
  const supabase = await verifyAdmin();
  const withdrawalId = formData.get('withdrawalId') as string;

  const { error } = await supabase
    .from('withdrawals')
    .update({ status: 'rejected' })
    .eq('id', withdrawalId);

  if (error) console.error('Reject Withdrawal Error:', error);

  revalidatePath('/admin');
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

    if (id) {
        // Update existing plan
        const { error } = await supabase.from('plans').update(planData).eq('id', id);
        if (error) {
            console.error('Update Plan Error:', error);
            return { error: 'Failed to update plan.' };
        }
    } else {
        // Create new plan
        const { error } = await supabase.from('plans').insert(planData);
        if (error) {
            console.error('Create Plan Error:', error);
            return { error: 'Failed to create plan.' };
        }
    }

    revalidatePath('/admin');
    return { error: null };
}
