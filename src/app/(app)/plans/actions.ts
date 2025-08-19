
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function purchasePlan(formData: FormData) {
  const planId = formData.get('plan_id') as string;
  const paymentUid = formData.get('payment_uid') as string;

  if (!planId || !paymentUid) {
    return { error: 'Missing plan information or payment UID.' };
  }
  
  // This is a mock action. In a real app you'd save this to a database.
  console.log(`Mock Purchase: User wants to buy plan ${planId} with UID ${paymentUid}`);


  revalidatePath('/plans');
  revalidatePath('/dashboard');
  redirect('/dashboard');
}
