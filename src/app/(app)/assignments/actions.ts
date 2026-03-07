'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const assignmentSchema = z.object({
  taskId: z.string().uuid('Invalid Task ID.'),
  title: z.string().min(1, 'Title is required.'),
  images: z.array(z.string()).min(1, 'At least one image is required.'),
});

async function distributeEarnings(supabase: any, userId: string) {
    const { error: rpcError } = await supabase.rpc('add_fixed_earnings', {
        p_user_id: userId,
    });

    if (rpcError) {
        console.error('Earnings Distribution RPC Error:', rpcError);
        throw new Error('Failed to distribute earnings.');
    }
}

export async function submitAssignmentWithImages(formData: z.infer<typeof assignmentSchema>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to submit an assignment.' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); 
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

  const approvalStatus = 'approved';
  const feedback = 'Submission auto-approved.';

  try {
    await distributeEarnings(supabase, user.id);
  } catch (error: any) {
    console.error('Caught earnings distribution error in submit action:', error);
    return { error: error.message, isApproved: false };
  }

  const { error: insertError } = await supabase
    .from('assignments')
    .insert({
      user_id: user.id,
      task_id: formData.taskId,
      title: formData.title,
      urls: [], 
      status: approvalStatus,
      feedback: feedback,
      created_at: new Date().toISOString(),
    });

  if (insertError) {
    console.error('Assignment Insert Error:', insertError);
    return { error: 'Failed to save your assignment record, but earnings were added.', isApproved: true };
  }
  
  revalidatePath('/assignments');
  revalidatePath('/dashboard');
  
  return { error: null, aiFeedback: "Your assignment has been approved and earnings have been added.", isApproved: true };
}
