'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { PostgrestError } from '@supabase/supabase-js';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error('Not authorized');
  }
  return supabase;
}

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
        .select('name')
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
      
    const { error: transactionError } = await supabase.rpc('approve_payment_and_distribute_bonus', {
        p_payment_id: paymentId,
        p_user_id: profile.id,
        p_plan_name: plan.name,
        p_referred_by_id: profile.referred_by || null
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
     const { error } = await supabase.rpc('approve_withdrawal', { p_withdrawal_id: withdrawalId });
     if (error) throw error;
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

  try {
    const { data: withdrawal, error: fetchError } = await supabase
      .from('withdrawals')
      .select('user_id, amount, status')
      .eq('id', withdrawalId)
      .single();

    if (fetchError || !withdrawal) throw new Error('Withdrawal not found.');
    if (withdrawal.status !== 'pending') throw new Error('Withdrawal is already processed.');

    const { data: profile, error: profileFetchError } = await supabase
      .from('profiles')
      .select('current_balance')
      .eq('id', withdrawal.user_id)
      .single();

    if (profileFetchError || !profile) throw new Error('User profile not found for refund.');

    const { error: refundError } = await supabase
      .from('profiles')
      .update({ current_balance: profile.current_balance + withdrawal.amount })
      .eq('id', withdrawal.user_id);

    if (refundError) throw new Error('Failed to refund balance to user.');

    const { error: updateError } = await supabase
      .from('withdrawals')
      .update({ status: 'rejected' })
      .eq('id', withdrawalId);

    if (updateError) throw new Error('Failed to update withdrawal status.');

  } catch (error: any) {
    console.error('Reject Withdrawal Logic Error:', error.message);
    return { error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/dashboard');
  revalidatePath('/withdraw');
  return { error: null };
}

const planSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Plan name is required'),
    investment: z.coerce.number().positive('Investment must be a positive number'),
    daily_earning: z.coerce.number().positive('Daily earning must be a positive number'),
    daily_assignments: z.coerce.number().int().positive('Daily assignments must be a positive integer'),
    original_investment: z.coerce.number().nullable().optional(),
    offer_name: z.string().nullable().optional(),
    offer_expires_at: z.string().nullable().optional(),
});

export async function savePlan(formData: z.infer<typeof planSchema>) {
    const supabase = await verifyAdmin();
    const validatedData = planSchema.parse(formData);
    const { id, ...planData } = validatedData;
    
    if (planData.offer_name === '') planData.offer_name = null;
    if (planData.original_investment === 0) planData.original_investment = null;
    if (planData.offer_expires_at === '') planData.offer_expires_at = null;

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
    revalidatePath('/tasks');
    return { error: null };
}

export async function approveAssignment(formData: FormData) {
  const supabase = await verifyAdmin();
  const assignmentId = formData.get('assignmentId') as string;
  if (!assignmentId) return { error: 'Assignment ID is missing.' };

  const { data: assignment, error: fetchError } = await supabase
    .from('assignments')
    .select('user_id, status')
    .eq('id', assignmentId)
    .single();
  
  if (fetchError || !assignment) return { error: 'Assignment not found.' };
  if (assignment.status === 'approved') return { error: 'Assignment has already been approved.' };

  const { error } = await supabase
    .from('assignments')
    .update({ status: 'approved' })
    .eq('id', assignmentId);
  
  if (error) {
    console.error('Approve Assignment Error:', error);
    return { error: 'Could not approve assignment.' };
  }

  revalidatePath('/admin');
  revalidatePath('/assignments');
  return { error: null };
}

export async function rejectAssignment(formData: FormData) {
  const supabase = await verifyAdmin();
  const assignmentId = formData.get('assignmentId') as string;

  const { error } = await supabase
    .from('assignments')
    .update({ status: 'rejected' })
    .eq('id', assignmentId);

  if (error) {
    console.error('Reject Assignment Error:', error);
    return { error: 'Failed to reject assignment.' };
  }

  revalidatePath('/admin');
  revalidatePath('/assignments');
}

const socialLinkSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    icon_url: z.string().url('Must be a valid URL'),
    social_link: z.string().url('Must be a valid URL'),
});

export async function saveSocialLink(formData: z.infer<typeof socialLinkSchema>) {
    const supabase = await verifyAdmin();
    const validatedData = socialLinkSchema.parse(formData);
    const { id, ...socialLinkData } = validatedData;

    try {
        if (id) {
            await supabase.from('social_links').update(socialLinkData).eq('id', id);
        } else {
            await supabase.from('social_links').insert(socialLinkData);
        }
    } catch (error: any) {
        console.error('Save Social Link Error:', error);
        return { error: `Failed to save social link. Database error: ${error.message}` };
    }

    revalidatePath('/admin');
    revalidatePath('/social');
    return { error: null };
}

export async function deleteSocialLink(formData: FormData) {
    const supabase = await verifyAdmin();
    const id = formData.get('id') as string;
    if (!id) return { error: 'Social Link ID is missing' };

    try {
        await supabase.from('social_links').delete().eq('id', id);
    } catch (error: any) {
        console.error('Delete Social Link Error:', error);
        return { error: `Failed to delete social link. Database error: ${error.message}` };
    }

    revalidatePath('/admin');
    revalidatePath('/social');
    return { error: null };
}
