
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2),
});

export async function updateProfile(formData: z.infer<typeof updateProfileSchema>) {
  // This is a mock action. In a real app, you would update the database.
  console.log(`Mock Update: User profile updated with name: ${formData.name}`);

  // You might want to update the mock data here if you want it to persist across reloads
  // but for this example, we will just log it.

  revalidatePath('/profile');
  revalidatePath('/(app)', 'layout'); // Revalidate the layout to update user name in header
  return { error: null };
}
