
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { MOCK_USER } from '@/lib/mock-data';

const withdrawalSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive.'),
  bank_name: z.string().min(1, 'Bank name is required.'),
  holder_name: z.string().min(1, 'Account holder name is required.'),
  account_number: z.string().min(1, 'Account number is required.'),
});

export async function requestWithdrawal(formData: z.infer<typeof withdrawalSchema>) {
  if (formData.amount > MOCK_USER.current_balance) {
    return { error: 'Insufficient balance.' };
  }

  // This is a mock action. In a real app, you'd save this to a database
  // and update the user's balance.
  console.log('Mock Withdrawal Request:', formData);
  
  // You could update the mock data here if you wanted the balance to change,
  // for now it will just reset on page reload.

  revalidatePath('/withdraw');
  revalidatePath('/dashboard');
  return { error: null };
}
