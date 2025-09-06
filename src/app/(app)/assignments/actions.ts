
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const assignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  url1: z.string().url('Please provide a valid URL.'),
  url2: z.string().url().optional().or(z.literal('')),
  url3: z.string().url().optional().or(z.literal('')),
  url4: z.string().url().optional().or(z.literal('')),
  url5: z.string().url().optional().or(z.literal('')),
});

export async function submitAssignment(formData: z.infer<typeof assignmentSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to submit an assignment.' };
  }

  const urls = [
    formData.url1,
    formData.url2,
    formData.url3,
    formData.url4,
    formData.url5,
  ].filter(url => url); // Filter out empty strings

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
