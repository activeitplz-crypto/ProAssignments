
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { UserProfile } from '@/lib/types';

const withdrawalSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive.'),
  bank_name: z.string().min(1, 'Bank name is required.'),
  holder_name: z.string().min(1, 'Account holder name is required.'),
  account_number: z.string().min(1, 'Account number is required.'),
});

export async function requestWithdrawal(formData: z.infer<typeof withdrawalSchema>) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to make a withdrawal.' };
  }

  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('current_balance')
    .eq('id', user.id)
    .single<Pick<UserProfile, 'current_balance'>>();

  if (profileError || !userProfile) {
    return { error: 'Could not retrieve user balance.' };
  }

  if (formData.amount > userProfile.current_balance) {
    return { error: 'Insufficient balance.' };
  }

  // Use a transaction to ensure both operations succeed or fail together
  const { error } = await supabase.rpc('create_withdrawal_and_update_balance', {
      p_user_id: user.id,
      p_amount: formData.amount,
      p_account_info: {
          bank_name: formData.bank_name,
          holder_name: formData.holder_name,
          account_number: formData.account_number,
      }
  });


  if (error) {
    console.error('Withdrawal RPC error:', error);
    return { error: `Withdrawal failed: ${error.message}` };
  }

  revalidatePath('/withdraw');
  revalidatePath('/dashboard');
  return { error: null };
}
