'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const withdrawalSchema = z.object({
  amount: z.coerce.number().min(700, 'Minimum withdrawal amount is 700 RS.'),
  bank_name: z.string().min(1, 'Bank name is required.'),
  holder_name: z.string().min(1, 'Account holder name is required.'),
  account_number: z.string().min(1, 'Account number is required.'),
});

export async function requestWithdrawal(formData: z.infer<typeof withdrawalSchema>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to make a withdrawal.' };
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_balance')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return { error: 'User profile not found.' };
  }

  if (formData.amount > profile.current_balance) {
    return { error: 'Insufficient balance.' };
  }

  // 1. Deduct amount immediately
  const { error: deductionError } = await supabase
    .from('profiles')
    .update({ current_balance: profile.current_balance - formData.amount })
    .eq('id', user.id);

  if (deductionError) {
    console.error('Balance Deduction Error:', deductionError);
    return { error: 'Failed to update balance for withdrawal.' };
  }
  
  // 2. Record the request
  const { error: insertError } = await supabase
    .from('withdrawals')
    .insert({
      user_id: user.id,
      amount: formData.amount,
      status: 'pending',
      account_info: {
          bank_name: formData.bank_name,
          holder_name: formData.holder_name,
          account_number: formData.account_number,
      },
    });

  if (insertError) {
    console.error('Withdrawal Request Error:', insertError);
    return { error: 'Failed to submit withdrawal request.' };
  }
  
  revalidatePath('/withdraw');
  revalidatePath('/dashboard');
  revalidatePath('/admin');
  return { error: null };
}
