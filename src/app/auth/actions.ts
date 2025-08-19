
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(formData: z.infer<typeof loginSchema>) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  // Redirect is handled client-side on success
  return { error: null };
}

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function signup(formData: z.infer<typeof signupSchema>) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        name: formData.name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }
  
  if (data.user) {
    // Also create a profile in our public table
    const { error: profileError } = await supabase.from('users').insert({ 
      id: data.user.id, 
      name: formData.name,
      email: formData.email,
    });
    if (profileError) {
      // If profile creation fails, we should probably handle this case,
      // maybe by deleting the auth user or logging the error.
      // For now, we'll return the profile error.
      return { error: profileError.message };
    }
  }

  return { error: null };
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
