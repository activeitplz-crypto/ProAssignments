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
  const supabase = await createClient();

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
  const supabase = await createClient();

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
  
  return { error: null, success: true };
}


export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

/**
 * Resets the daily earning for the logged-in user to 0.
 * This is intended to be called at the start of a new day.
 */
export async function resetDailyEarnings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;

  const { error } = await supabase
    .from('profiles')
    .update({ today_earning: 0 })
    .eq('id', user.id);

  if (error) {
    console.error('Failed to reset daily earnings:', error);
  } else {
    revalidatePath('/dashboard');
  }
}
