
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { MOCK_USERS, MOCK_WITHDRAWALS } from '@/lib/mock-data';
import { getSession } from '@/lib/session';

const withdrawalSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive.'),
  bank_name: z.string().min(1, 'Bank name is required.'),
  holder_name: z.string().min(1, 'Account holder name is required.'),
  account_number: z.string().min(1, 'Account number is required.'),
});

export async function requestWithdrawal(formData: z.infer<typeof withdrawalSchema>) {
  const session = await getSession();
  if (!session?.email) {
    return { error: 'You must be logged in to make a withdrawal.' };
  }
  
  const user = MOCK_USERS.find(u => u.email === session.email);
  if (!user) {
    return { error: 'User not found.' };
  }

  if (formData.amount > user.current_balance) {
    return { error: 'Insufficient balance.' };
  }

  // This is a mock action. In a real app, you'd save this to a database
  // and update the user's balance.
  console.log('Mock Withdrawal Request:', formData);

  MOCK_WITHDRAWALS.unshift({
    id: `withdrawal-${Date.now()}`,
    user_id: user.id,
    amount: formData.amount,
    status: 'pending',
    created_at: new Date().toISOString(),
    account_info: {
        bank_name: formData.bank_name,
        holder_name: formData.holder_name,
        account_number: formData.account_number,
    },
    users: { name: user.name || 'Unknown' },
  });
  
  // You could update the mock data here if you wanted the balance to change,
  // for now it will just reset on page reload.

  revalidatePath('/withdraw');
  revalidatePath('/dashboard');
  revalidatePath('/admin');
  return { error: null };
}
