
'use server';

import { cookies } from 'next/headers';
import { MOCK_AUTH_COOKIE_NAME, MOCK_USER, MOCK_ADMIN_EMAIL } from './mock-data';

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(MOCK_AUTH_COOKIE_NAME);

  if (token) {
    // In a real app, you'd verify the token.
    // Here we just return the mock user based on the admin email or default user
    const email = token.value;
    if (email === MOCK_ADMIN_EMAIL) {
        return {
            ...MOCK_USER,
            email: MOCK_ADMIN_EMAIL,
            name: "Admin User",
        }
    }
    return {
        ...MOCK_USER,
        email: email,
    };
  }
  return null;
}
