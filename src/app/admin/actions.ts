
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { PostgrestError } from '@supabase/supabase-js';

async function verifyAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error('Not authorized');
  }
  return supabase;
}

// Helper function to handle Supabase responses
async function handleSupabaseResponse<T>(query: Promise<{ data: T | null; error: PostgrestError | null }>): Promise<T> {
  const { data, error } = await query;
  if (error) {
    console.error("Supabase Error:", error.message);
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("No data returned from the query.");
  }
  return data;
}


export async function approvePayment(formData: FormData) {
  const paymentId = formData.get('paymentId') as string;
  if (!paymentId) return { error: 'Payment ID is missing.' };

  const supabase = await verifyAdmin();
  
  try {
    const payment = await handleSupabaseResponse(
      supabase
        .from('payments')
        .select('user_id, plan_id')
        .eq('id', paymentId)
        .eq('status', 'pending')
        .single()
    );

    const plan = await handleSupabaseResponse(
      supabase
        .from('plans')
        .select('name, period_days, referral_bonus')
        .eq('id', payment.plan_id)
        .single()
    );

    const profile = await handleSupabaseResponse(
      supabase
        .from('profiles')
        .select('id, referred_by')
        .eq('id', payment.user_id)
        .single()
    );
      
    // Use a transaction to ensure all or nothing
    const { error: transactionError } = await supabase.rpc('approve_payment_and_distribute_bonus', {
        p_payment_id: paymentId,
        p_user_id: profile.id,
        p_plan_name: plan.name,
        p_plan_period_days: plan.period_days,
        p_referral_bonus: plan.referral_bonus,
        p_referred_by_id: profile.referred_by
    });

    if (transactionError) {
        throw new Error(`Transaction failed: ${transactionError.message}`);
    }

  } catch (error: any) {
    console.error('Approve Payment Logic Error:', error.message);
    return { error: error.message };
  }
  
  revalidatePath('/admin');
  return { error: null };
}


export async function rejectPayment(formData: FormData) {
  const supabase = await verifyAdmin();
  const paymentId = formData.get('paymentId') as string;

  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected' })
    .eq('id', paymentId);
    
  if (error) {
    console.error('Reject Payment Error:', error);
    return { error: 'Failed to reject payment.' };
  }

  revalidatePath('/admin');
}

export async function approveWithdrawal(formData: FormData) {
  const supabase = await verifyAdmin();
  const withdrawalId = formData.get('withdrawalId') as string;
  
  try {
     await supabase.rpc('approve_withdrawal', { p_withdrawal_id: withdrawalId });
  } catch (error: any) {
     console.error('Approve Withdrawal Error:', error);
     return { error: error.message };
  }
  
  revalidatePath('/admin');
  revalidatePath('/dashboard');
}

export async function rejectWithdrawal(formData: FormData) {
  const supabase = await verifyAdmin();
  const withdrawalId = formData.get('withdrawalId') as string;

  const { error } = await supabase
    .from('withdrawals')
    .update({ status: 'rejected' })
    .eq('id', withdrawalId);

  if (error) {
    console.error('Reject Withdrawal Error:', error);
    return { error: 'Failed to reject withdrawal.' };
  }

  revalidatePath('/admin');
}

const planSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Plan name is required'),
    investment: z.coerce.number().positive('Investment must be a positive number'),
    daily_earning: z.coerce.number().positive('Daily earning must be a positive number'),
    period_days: z.coerce.number().int().positive('Period must be a positive integer'),
    total_return: z.coerce.number().positive('Total return must be a positive number'),
    referral_bonus: z.coerce.number().positive('Referral bonus must be a positive number'),
});

export async function savePlan(formData: z.infer<typeof planSchema>) {
    const supabase = await verifyAdmin();
    const validatedData = planSchema.parse(formData);
    const { id, ...planData } = validatedData;

    try {
        if (id) {
            const { error } = await supabase.from('plans').update(planData).eq('id', id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('plans').insert(planData);
            if (error) throw error;
        }
    } catch (error: any) {
        console.error('Save Plan Error:', error);
        return { error: `Failed to save plan. Database error: ${error.message}` };
    }

    revalidatePath('/admin');
    revalidatePath('/admin?tab=plans', 'page');
    revalidatePath('/plans');
    return { error: null };
}


const taskSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Task title is required'),
    url: z.string().url('Must be a valid URL'),
});

export async function saveTask(formData: z.infer<typeof taskSchema>) {
    const supabase = await verifyAdmin();
    const validatedData = taskSchema.parse(formData);
    const { id, ...taskData } = validatedData;

    try {
        if (id) {
            await supabase.from('tasks').update(taskData).eq('id', id);
        } else {
            await supabase.from('tasks').insert(taskData);
        }
    } catch (error: any) {
        console.error('Save Task Error:', error);
        return { error: `Failed to save task. Database error: ${error.message}` };
    }

    revalidatePath('/admin');
    revalidatePath('/admin?tab=tasks', 'page');
    revalidatePath('/tasks');
    return { error: null };
}

export async function deleteTask(formData: FormData) {
    const supabase = await verifyAdmin();
    const id = formData.get('id') as string;
    if (!id) return { error: 'Task ID is missing' };

    try {
        await supabase.from('tasks').delete().eq('id', id);
    } catch (error: any) {
        console.error('Delete Task Error:', error);
        return { error: `Failed to delete task. Database error: ${error.message}` };
    }

    revalidatePath('/admin');
    revalidatePath('/admin?tab=tasks', 'page');
    revalidatePath('/tasks');
    return { error: null };
}
