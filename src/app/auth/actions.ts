
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
  username: z.string().min(3).regex(/^[a-z0-9_]+$/, { message: 'Username can only contain lowercase letters, numbers, and underscores.'}),
  email: z.string().email(),
  password: z.string().min(6),
  referral_code: z.string().optional(),
});

export async function signup(formData: z.infer<typeof signupSchema>) {
  const supabase = createClient();

  // Check if username is already taken
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', formData.username)
    .single();

  if (existingUser) {
    return { error: 'Username is already taken.', success: false };
  }

  let referrerId: string | null = null;
  if (formData.referral_code) {
      const { data: referrer, error: referrerError } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', formData.referral_code)
          .single();
      
      if (referrer) {
          referrerId = referrer.id;
      }
  }
  
  const referral_code = `${formData.name.toUpperCase().slice(0,4)}-REF-${Date.now().toString().slice(-4)}`;

  const origin = process.env.NEXT_PUBLIC_BASE_URL;

  // Explicitly set the redirect URL for the confirmation email.
  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        name: formData.name,
        username: formData.username,
        referral_code: referral_code,
        referred_by: referrerId,
      },
    },
  });

  if (error) {
    if (error.message.includes('unique constraint')) {
       return { error: 'User with this email already exists.', success: false };
    }
    console.error('Signup Error:', error.message);
    return { error: 'Could not create user. Please try again.', success: false };
  }

  return { error: null, success: true };
}


export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
