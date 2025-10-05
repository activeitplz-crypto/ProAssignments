
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const assignmentSchema = z.object({
  taskId: z.string().uuid('Invalid Task ID.'),
  title: z.string().min(1, 'Title is required.'),
  images: z.array(z.string()).min(1, 'At least one image is required.'),
});

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
  
  // 2. Auto-approve the submission. Earnings will be distributed by an admin.
  const aiResult = { isApproved: true, reason: "Submission auto-approved." };

  // 3. Insert the approved assignment record.
  const { error: insertError } = await supabase
    .from('assignments')
    .insert({
      user_id: user.id,
      task_id: formData.taskId,
      title: formData.title,
      urls: [], 
      status: 'approved', // Set status to approved directly
      feedback: aiResult.reason,
      created_at: new Date().toISOString(),
    });

  if (insertError) {
    console.error('Assignment Insert Error:', insertError);
    return { error: 'Failed to save your assignment.', aiFeedback: aiResult.reason, isApproved: false };
  }
  
  // Note: Earnings are no longer distributed here to prevent errors.
  // Admin must approve from the admin panel to distribute earnings.
  
  revalidatePath('/assignments');
  revalidatePath('/dashboard');
  
  return { error: null, aiFeedback: "Your assignment has been submitted and is pending final review.", isApproved: true };
}
