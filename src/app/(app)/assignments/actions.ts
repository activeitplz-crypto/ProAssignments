
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const assignmentSchema = z.object({
  taskId: z.string().uuid('Invalid Task ID.'),
  title: z.string().min(1, 'Title is required.'),
  url1: z.string().url({ message: 'URL 1 must be a valid URL.' }),
  url2: z.string().url().optional().or(z.literal('')),
  url3: z.string().url().optional().or(z.literal('')),
  url4: z.string().url().optional().or(z.literal('')),
});

export async function submitAssignment(formData: z.infer<typeof assignmentSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to submit an assignment.' };
  }
  
  // 1. Verify user has an active plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_plan')
    .eq('id', user.id)
    .single();
  
  if (!profile || !profile.current_plan) {
    return { error: 'You must have an active plan to submit assignments.' };
  }
  
  // 2. Check if the user has already submitted this specific task today
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const { count: existingSubmissionCount, error: countError } = await supabase
    .from('assignments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('task_id', formData.taskId)
    .gte('created_at', today.toISOString());

  if (countError) {
    console.error('Server-side count error:', countError);
    return { error: 'Could not verify your submission status.' };
  }
  
  if (existingSubmissionCount !== null && existingSubmissionCount > 0) {
    return { error: 'You have already submitted proof for this task today.' };
  }

  // 3. Insert the new assignment
  const urls = [formData.url1, formData.url2, formData.url3, formData.url4].filter(url => url);

  const { error } = await supabase
    .from('assignments')
    .insert({
      user_id: user.id,
      task_id: formData.taskId,
      title: formData.title,
      urls: urls,
      status: 'pending',
    });

  if (error) {
    console.error('Assignment Submission Error:', error);
    return { error: 'Failed to submit your assignment. Please try again.' };
  }
  
  revalidatePath('/assignments');
  revalidatePath('/admin');
  return { error: null };
}
