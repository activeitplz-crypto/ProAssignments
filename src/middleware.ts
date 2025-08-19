
import { type NextRequest, NextResponse } from 'next/server';
import { MOCK_AUTH_COOKIE_NAME } from './lib/mock-data';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoggedIn = request.cookies.has(MOCK_AUTH_COOKIE_NAME);

  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.includes(pathname);
  
  const protectedRoutes = ['/dashboard', '/plans', '/withdraw', '/referrals', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
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
