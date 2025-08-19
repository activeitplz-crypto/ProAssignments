
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MOCK_AUTH_COOKIE_NAME, MOCK_USER } from '@/lib/mock-data';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(formData: z.infer<typeof loginSchema>) {
  // In a real app, you'd validate against a database.
  // Here, we'll just check against our mock user.
  if (formData.email !== MOCK_USER.email) {
    return { error: 'Invalid email or password.' };
  }
  
  // Never check passwords like this in a real app!
  if (formData.password !== 'password123') {
     return { error: 'Invalid email or password.' };
  }

  // Set a mock auth cookie
  cookies().set(MOCK_AUTH_COOKIE_NAME, 'mock-token-12345', {
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
  // This is a mock signup. In a real app, you would create a new user.
  // We'll just log them in as the mock user for demonstration.
  console.log('Mock signup with:', formData.name, formData.email);

  // Set the mock auth cookie as if they've signed up and are now logged in
  cookies().set(MOCK_AUTH_COOKIE_NAME, 'mock-token-12345', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return { error: null };
}

export async function logout() {
  cookies().delete(MOCK_AUTH_COOKIE_NAME);
  redirect('/login');
}
