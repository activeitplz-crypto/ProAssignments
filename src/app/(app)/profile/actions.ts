
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Profile } from '@/lib/types';

const updateProfileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  avatar_url: z.string().url().nullable(),
});

export async function updateProfile(formData: z.infer<typeof updateProfileSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to update your profile.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ 
      name: formData.name,
      avatar_url: formData.avatar_url,
    })
    .eq('id', user.id);

  if (error) {
    console.error('Update Profile Error:', error);
    return { error: 'Could not update profile.' };
  }

  revalidatePath('/profile');
  revalidatePath('/(app)', 'layout');
  return { error: null };
}

export async function uploadAvatar(file: File): Promise<{ publicUrl: string | null; error: string | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { publicUrl: null, error: 'User not authenticated' };
  }

  const fileExt = file.name.split('.').pop();
  const filePath = `${user.id}-${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Avatar Upload Error:', uploadError);
    return { publicUrl: null, error: 'Failed to upload avatar.' };
  }

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);
  
  return { publicUrl: data.publicUrl, error: null };
}
