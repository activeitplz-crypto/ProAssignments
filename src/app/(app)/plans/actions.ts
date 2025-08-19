'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function purchasePlan(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to purchase a plan.' };
  }

  const planId = formData.get('plan_id') as string;
  const paymentUid = formData.get('payment_uid') as string;
  const planName = formData.get('plan_name') as string;

  if (!planId || !paymentUid) {
    return { error: 'Missing plan information or payment UID.' };
  }

  const { error } = await supabase.from('payments').insert({
    user_id: user.id,
    plan_id: planId,
    payment_uid: paymentUid,
    status: 'pending',
  });

  if (error) {
    return { error: `Database error: ${error.message}` };
  }

  revalidatePath('/plans');
  redirect('/dashboard');
}
