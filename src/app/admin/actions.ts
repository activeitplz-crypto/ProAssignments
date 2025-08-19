
'use server';

import { revalidatePath } from 'next/cache';
import { MOCK_PAYMENTS, MOCK_WITHDRAWALS, MOCK_PLANS } from '@/lib/mock-data';

// Mock function to verify admin
async function verifyAdmin() {
  // In a real app, you'd check a session here.
  // For this mock setup, we assume if this action is called, the user is an admin.
  return true;
}

export async function approvePayment(formData: FormData) {
  await verifyAdmin();
  const paymentId = formData.get('paymentId') as string;
  
  const payment = MOCK_PAYMENTS.find(p => p.id === paymentId);
  if (payment) {
    payment.status = 'approved';
  }

  revalidatePath('/admin');
  revalidatePath('/(app)/dashboard');
}

export async function rejectPayment(formData: FormData) {
  await verifyAdmin();
  const paymentId = formData.get('paymentId') as string;

  const payment = MOCK_PAYMENTS.find(p => p.id === paymentId);
  if (payment) {
    payment.status = 'rejected';
  }

  revalidatePath('/admin');
}

export async function approveWithdrawal(formData: FormData) {
  await verifyAdmin();
  const withdrawalId = formData.get('withdrawalId') as string;
  
  const withdrawal = MOCK_WITHDRAWALS.find(w => w.id === withdrawalId);
  if (withdrawal) {
    withdrawal.status = 'approved';
  }

  revalidatePath('/admin');
}

export async function rejectWithdrawal(formData: FormData) {
  await verifyAdmin();
  const withdrawalId = formData.get('withdrawalId') as string;

  const withdrawal = MOCK_WITHDRAWALS.find(w => w.id === withdrawalId);
  if (withdrawal) {
    withdrawal.status = 'rejected';
  }
  revalidatePath('/admin');
}
