
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(formData: z.infer<typeof loginSchema>) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    console.error('Login Error:', error.message);
    return { error: 'Invalid email or password.' };
  }
  
  if (data.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    revalidatePath('/admin', 'layout');
    redirect('/admin');
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function signup(formData: z.infer<typeof signupSchema>) {
  const supabase = createClient();

  // Auto-generate username from name
  const baseUsername = formData.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  const uniqueUsername = `${baseUsername}_${Date.now().toString().slice(-4)}`;


  // Check if username is already taken
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', uniqueUsername)
    .single();

  if (existingUser) {
    // This is highly unlikely due to the timestamp, but it's good practice
    return { error: 'A user with this generated username already exists. Please try again.', success: false };
  }
  
  const ownReferralCode = `${formData.name.toUpperCase().slice(0,4)}-REF-${Date.now().toString().slice(-4)}`;

  // Step 1: Sign up the new user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        name: formData.name,
        username: uniqueUsername,
        referral_code: ownReferralCode,
      },
    },
  });

  if (signUpError) {
    if (signUpError.message.includes('unique constraint')) {
       return { error: 'User with this email already exists.', success: false };
    }
    console.error('Signup Error:', signUpError.message);
    return { error: 'Could not create user. Please try again.', success: false };
  }
  
  // Since email confirmation is off, the user is created and their profile is available.
  // No need to link referrer in a separate step as it's handled by the `handle_new_user` trigger.

  return { error: null, success: true };
}


export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
