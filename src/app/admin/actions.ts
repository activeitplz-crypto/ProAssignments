
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function verifyAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error('Not authorized');
  }
}

export async function approvePayment(formData: FormData) {
  await verifyAdmin();
  const paymentId = formData.get('paymentId') as string;
  const supabase = createClient();
  
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
  await verifyAdmin();
  const paymentId = formData.get('paymentId') as string;
  const supabase = createClient();

  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected' })
    .eq('id', paymentId);
    
  if (error) console.error('Reject Payment Error:', error);

  revalidatePath('/admin');
}

export async function approveWithdrawal(formData: FormData) {
  await verifyAdmin();
  const withdrawalId = formData.get('withdrawalId') as string;
  const supabase = createClient();
  
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
  await verifyAdmin();
  const withdrawalId = formData.get('withdrawalId') as string;
  const supabase = createClient();

  const { error } = await supabase
    .from('withdrawals')
    .update({ status: 'rejected' })
    .eq('id', withdrawalId);

  if (error) console.error('Reject Withdrawal Error:', error);

  revalidatePath('/admin');
}
