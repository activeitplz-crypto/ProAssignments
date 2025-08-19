
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2),
});

export async function updateProfile(formData: z.infer<typeof updateProfileSchema>) {
  const supabase = createClient();

   const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to update your profile.' };
  }

  const { error } = await supabase.auth.updateUser({
      data: {
          name: formData.name,
      }
  })

  if (error) {
    return { error: error.message };
  }

  // Also update the public users table
   const { error: profileError } = await supabase.from('users').update({
       name: formData.name
   }).eq('id', user.id);

    if (profileError) {
        return { error: `Profile update failed: ${profileError.message}` };
    }


  revalidatePath('/profile');
  revalidatePath('/(app)', 'layout'); // Revalidate the layout to update user name in header
  return { error: null };
}
