
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.includes(pathname);
  
  const protectedRoutes = ['/dashboard', '/plans', '/withdraw', '/referrals', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  const isAdminRoute = pathname.startsWith('/admin');

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminRoute) {
    if (!session || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
       return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
