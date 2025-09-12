
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
  referral_code: z.string().optional(),
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

  let referrerId: string | null = null;
  if (formData.referral_code && formData.referral_code.trim() !== '') {
      const { data: referrer, error: referrerError } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', formData.referral_code.trim())
          .single();
      
      if (referrer) {
          referrerId = referrer.id;
      } else {
        return { error: 'Invalid referral code provided.', success: false };
      }
  }
  
  const ownReferralCode = `${formData.name.toUpperCase().slice(0,4)}-REF-${Date.now().toString().slice(-4)}`;
  const origin = process.env.NEXT_PUBLIC_BASE_URL;

  // Step 1: Sign up the new user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        name: formData.name,
        username: uniqueUsername,
        referral_code: ownReferralCode,
        // We will set referred_by in a separate update call after the user profile is created.
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

  // Step 2: If signup was successful and there's a referrer, update the new user's profile
  if (signUpData.user && referrerId) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ referred_by: referrerId })
        .eq('id', signUpData.user.id);
        
      if (updateError) {
          console.error('Failed to link referrer:', updateError);
          // This is not a critical failure for the user, so we don't return an error.
          // The user is created, just not linked. We log it for debugging.
      }
  }

  return { error: null, success: true };
}


export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
