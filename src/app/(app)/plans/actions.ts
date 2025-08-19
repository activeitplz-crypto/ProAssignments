
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { MOCK_PAYMENTS } from '@/lib/mock-data';

export async function purchasePlan(formData: FormData) {
  const planId = formData.get('plan_id') as string;
  const paymentUid = formData.get('payment_uid') as string;
  const planName = formData.get('plan_name') as string;

  if (!planId || !paymentUid) {
    return { error: 'Missing plan information or payment UID.' };
  }
  
  // This is a mock action. 
  // In a real app you'd save this to a database.
  // Here, we add it to our mock payments array.
  console.log(`Mock Purchase: User wants to buy plan ${planId} with UID ${paymentUid}`);
  
  MOCK_PAYMENTS.unshift({
    id: `payment-${Date.now()}`,
    user_id: 'mock-user-123',
    plan_id: planId,
    payment_uid: paymentUid,
    status: 'pending',
    created_at: new Date().toISOString(),
    users: { name: 'Jahanzaib' },
    plans: { name: planName },
  });


  revalidatePath('/plans');
  revalidatePath('/dashboard');
  revalidatePath('/admin'); // Revalidate admin to show new payment
  redirect('/dashboard');
}
