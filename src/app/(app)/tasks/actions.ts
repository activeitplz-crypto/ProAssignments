
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const singleTaskSchema = z.object({
  proof_url: z.string().url({ message: 'The proof must be a valid URL.' }),
  task_id: z.string(),
  task_title: z.string(),
});

export async function submitSingleTask(formData: z.infer<typeof singleTaskSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to submit an assignment.' };
  }

  // Server-side check for daily submission limit
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_plan')
    .eq('id', user.id)
    .single();
  
  if (!profile || !profile.current_plan) {
    return { error: 'You must have an active plan to submit assignments.' };
  }
  
  const { data: plan } = await supabase
    .from('plans')
    .select('daily_assignments')
    .eq('name', profile.current_plan)
    .single();

  if (!plan) {
    return { error: 'Could not find your plan details.' };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const { count, error: countError } = await supabase
    .from('assignments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', today.toISOString());

  if (countError) {
    console.error('Server-side count error:', countError);
    return { error: 'Could not verify your submission limit.' };
  }
  
  if (count !== null && count >= plan.daily_assignments) {
    return { error: 'You have reached your daily submission limit for this plan.' };
  }
  
  // Check if this specific task has already been submitted today
  const { data: existingSubmission, error: existingError } = await supabase
    .from('assignments')
    .select('id')
    .eq('user_id', user.id)
    .eq('task_id', formData.task_id)
    .gte('created_at', today.toISOString())
    .single();

  if (existingError && existingError.code !== 'PGRST116') { // Ignore 'no rows found'
      console.error('Error checking for existing submission:', existingError);
      return { error: 'Server error. Please try again.' };
  }
  if (existingSubmission) {
      return { error: 'You have already submitted this task today.' };
  }

  const { error } = await supabase
    .from('assignments')
    .insert({
      user_id: user.id,
      task_id: formData.task_id,
      title: formData.task_title, // Keep title for admin UI
      urls: [formData.proof_url], // Store single URL in array for consistency
      status: 'pending',
    });

  if (error) {
    console.error('Assignment Submission Error:', error);
    return { error: 'Failed to submit your assignment. Please try again.' };
  }
  
  revalidatePath('/tasks');
  revalidatePath('/admin');
  return { error: null };
}
