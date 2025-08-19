
import { type NextRequest, NextResponse } from 'next/server';
import { MOCK_ADMIN_EMAIL } from './lib/mock-data';
import { getSession } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const session = await getSession();

  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.includes(pathname);
  
  const protectedRoutes = ['/dashboard', '/plans', '/withdraw', '/referrals', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  const isAdminRoute = pathname.startsWith('/admin');

  // If user is logged in and tries to access login/signup, redirect to dashboard
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If user is not logged in and tries to access a protected route, redirect to login
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the route is an admin route
  if (isAdminRoute) {
    // If user is not logged in OR the logged-in user is not the admin, redirect
    if (!session || session.email !== MOCK_ADMIN_EMAIL) {
       return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .svg, .png, .jpg, .jpeg, .gif, .webp (image files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
