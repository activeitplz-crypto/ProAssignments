
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  
  // Routes accessible only when logged out
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.includes(pathname);

  // User-specific routes (inside the /app directory group)
  const isAppRoute = pathname.startsWith('/dashboard') || 
                   pathname.startsWith('/plans') ||
                   pathname.startsWith('/withdraw') ||
                   pathname.startsWith('/tasks') ||
                   pathname.startsWith('/assignments') ||
                   pathname.startsWith('/referrals') ||
                   pathname.startsWith('/profile') ||
                   pathname.startsWith('/watch') ||
                   pathname.startsWith('/feedbacks') ||
                   pathname.startsWith('/social');


  // Admin route
  const isAdminRoute = pathname.startsWith('/admin');

  // If a logged-in user (including admin) is on an auth page, redirect them
  if (session && isAuthRoute) {
    const url = isAdmin ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(url, request.url));
  }

  // If a logged-out user tries to access protected content, redirect to login
  if (!session && (isAppRoute || isAdminRoute)) {
     return NextResponse.redirect(new URL('/login', request.url));
  }

  // If a logged-in user tries to access the admin panel, but is not an admin, redirect to dashboard
  if (session && isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the admin tries to access a regular user page, redirect them to the admin panel
  if (session && isAppRoute && isAdmin) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
