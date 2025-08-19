
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MOCK_AUTH_COOKIE_NAME, MOCK_USERS } from '@/lib/mock-data';
import type { UserProfile } from '@/lib/types';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(formData: z.infer<typeof loginSchema>) {
  // Find user in our mock database
  const user = MOCK_USERS.find(u => u.email === formData.email);

  if (!user) {
    return { error: 'Invalid email or password.' };
  }
  
  // Never check passwords like this in a real app!
  if (formData.password !== 'password123') {
     return { error: 'Invalid email or password.' };
  }

  // Set auth cookie with user's email to simulate a session
  cookies().set(MOCK_AUTH_COOKIE_NAME, user.email!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return { error: null };
}

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function signup(formData: z.infer<typeof signupSchema>) {
  // Check if user already exists
  if (MOCK_USERS.some(u => u.email === formData.email)) {
    return { error: 'An account with this email already exists.' };
  }

  // Create a new user object
  const newUser: UserProfile = {
    id: `mock-user-${Date.now()}`,
    name: formData.name,
    email: formData.email,
    current_plan: null,
    plan_start: null,
    plan_end: null,
    total_earning: 0,
    today_earning: 0,
    referral_count: 0,
    referral_bonus: 0,
    current_balance: 0,
    referral_code: `${formData.name.toUpperCase().slice(0,4)}-REF-${Date.now().toString().slice(-4)}`,
    avatarUrl: null,
  };

  // Add the new user to our mock "database"
  MOCK_USERS.push(newUser);
  console.log(`New user created: ${formData.email}. Total users: ${MOCK_USERS.length}`);

  // Set the mock auth cookie as if they've signed up and are now logged in
  cookies().set(MOCK_AUTH_COOKIE_NAME, newUser.email!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  // Also save their profile to local storage immediately
  // This is a bit of a hack for the mock setup
  // In a real app, this would be read from the DB on the next page load
  if (newUser.email) {
    const profileData = { name: newUser.name, avatarUrl: newUser.avatarUrl };
    // This part is tricky as we are on the server. We'll rely on the client to fetch.
  }

  return { error: null };
}

export async function logout() {
  cookies().delete(MOCK_AUTH_COOKIE_NAME);
  redirect('/login');
}
