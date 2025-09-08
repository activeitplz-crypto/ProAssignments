
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }).regex(/^[a-z0-9_]+$/, { message: 'Username can only contain lowercase letters, numbers, and underscores.' }),
  avatar_url: z.string().url({ message: 'Please enter a valid URL.' }).nullable().or(z.literal('')),
});

export async function updateProfile(formData: z.infer<typeof updateProfileSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to update your profile.' };
  }

  // Check if username is already taken by another user
  const { data: existingUser, error: existingUserError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', formData.username)
    .not('id', 'eq', user.id)
    .single();

  if (existingUser) {
    return { error: 'Username is already taken.' };
  }
   if (existingUserError && existingUserError.code !== 'PGRST116') { // Ignore 'No rows found' error
    console.error('Error checking username:', existingUserError);
    return { error: 'Could not validate username.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ 
      name: formData.name,
      username: formData.username,
      avatar_url: formData.avatar_url,
    })
    .eq('id', user.id);

  if (error) {
    console.error('Update Profile Error:', error);
    return { error: 'Could not update profile.' };
  }

  revalidatePath('/profile');
  revalidatePath('/(app)', 'layout');
  revalidatePath('/dashboard');
  return { error: null };
}
