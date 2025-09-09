
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const assignmentSchema = z.object({
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

  const urls = [formData.url1, formData.url2, formData.url3, formData.url4].filter(url => url);

  const { error } = await supabase
    .from('assignments')
    .insert({
      user_id: user.id,
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
