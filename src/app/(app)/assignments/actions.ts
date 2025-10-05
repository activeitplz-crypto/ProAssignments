
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const assignmentSchema = z.object({
  taskId: z.string().uuid('Invalid Task ID.'),
  title: z.string().min(1, 'Title is required.'),
  images: z.array(z.string()).min(1, 'At least one image is required.'),
});

async function distributeEarnings(supabase: ReturnType<typeof createClient>, userId: string) {
  // This RPC call will add exactly 2000 to the user's balances.
  const { error: rpcError } = await supabase.rpc('add_fixed_earnings', {
    p_user_id: userId,
    p_amount_to_add: 2000,
  });

  if (rpcError) {
    console.error('Failed to distribute earnings via RPC:', rpcError);
    // This is a critical failure. We should throw an error to be caught by the caller.
    throw new Error('Failed to distribute earnings. Please contact support.');
  }
}

export async function submitAssignmentWithImages(formData: z.infer<typeof assignmentSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to submit an assignment.' };
  }

  // 1. Check for existing APPROVED submission for this task today
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const { data: existingSubmission, error: existingError } = await supabase
    .from('assignments')
    .select('id')
    .eq('user_id', user.id)
    .eq('task_id', formData.taskId)
    .eq('status', 'approved')
    .gte('created_at', today.toISOString())
    .maybeSingle();

  if (existingError) {
    console.error('Server-side check error:', existingError);
    return { error: 'Could not verify your submission status.' };
  }

  if (existingSubmission) {
    return { error: 'You have already submitted and been approved for this task today.' };
  }
  
  // 2. Auto-approve and distribute earnings since AI verification is removed.
  const aiResult = { isApproved: true, reason: "Submission auto-approved." };

  try {
    await distributeEarnings(supabase, user.id);
  } catch (distributionError: any) {
    // If earnings fail, we stop and return an error. Don't save the assignment.
    return { error: distributionError.message, aiFeedback: aiResult.reason, isApproved: false };
  }

  // 3. Now, insert the approved assignment record.
  const { error: insertError } = await supabase
    .from('assignments')
    .insert({
      user_id: user.id,
      task_id: formData.taskId,
      title: formData.title,
      urls: [], 
      status: 'approved',
      feedback: aiResult.reason,
      created_at: new Date().toISOString(),
    });

  if (insertError) {
    console.error('Assignment Insert Error:', insertError);
    // Although earnings were distributed, we should let the user know saving failed.
    // This is a state that may require manual correction, so logging is vital.
    return { error: 'Failed to save your approved assignment, but your earnings have been processed.', aiFeedback: aiResult.reason, isApproved: true };
  }
  
  revalidatePath('/assignments');
  revalidatePath('/dashboard');
  
  return { error: null, aiFeedback: aiResult.reason, isApproved: true };
}
