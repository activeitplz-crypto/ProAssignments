
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
