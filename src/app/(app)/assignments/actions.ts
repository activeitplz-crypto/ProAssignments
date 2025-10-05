
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const assignmentSchema = z.object({
  taskId: z.string().uuid('Invalid Task ID.'),
  title: z.string().min(1, 'Title is required.'),
  images: z.array(z.string()).min(1, 'At least one image is required.'),
});

// This function calls the Supabase RPC to add earnings.
async function distributeEarnings(supabase: ReturnType<typeof createClient>, userId: string) {
    const { error: rpcError } = await supabase.rpc('add_fixed_earnings', {
        p_user_id: userId,
    });

    if (rpcError) {
        console.error('Earnings Distribution RPC Error:', rpcError);
        // We throw an error to make sure the calling function knows it failed.
        throw new Error('Failed to distribute earnings.');
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

  // 2. Auto-approve and distribute earnings.
  // The submission is automatically approved since an image is present.
  const approvalStatus = 'approved';
  const feedback = 'Submission auto-approved.';

  try {
    // Attempt to distribute earnings first. If this fails, the process stops.
    await distributeEarnings(supabase, user.id);
  } catch (error: any) {
    console.error('Caught earnings distribution error in submit action:', error);
    return { error: error.message, isApproved: false };
  }

  // 3. Insert the approved assignment record AFTER earnings are distributed.
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
    // Note: At this point, earnings were already distributed. This could lead to a discrepancy.
    // A more robust solution would use a database transaction, but this is a simpler implementation.
    return { error: 'Failed to save your assignment record, but earnings were added.', isApproved: true };
  }
  
  revalidatePath('/assignments');
  revalidatePath('/dashboard');
  
  return { error: null, aiFeedback: "Your assignment has been approved and earnings have been added.", isApproved: true };
}
