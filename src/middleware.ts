import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { verifyToken } from './lib/auth-utils';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // 1. Check NextAuth Token
  const nextAuthToken = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // 2. Check Custom JWT Token
  const customToken = req.cookies.get('token')?.value;
  const customUser = customToken ? await verifyToken(customToken) : null;

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  const isOrdersList = pathname === '/orders';
  const isProtectedRoute = isOrdersList || isAdminRoute;

  if (!isProtectedRoute) return NextResponse.next();

  // If no valid auth in either system, redirect to login
  if (!nextAuthToken && !customUser) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Check admin privileges in either system
  if (isAdminRoute) {
    const isAdmin = (nextAuthToken as any)?.role === 'admin' || customUser?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/orders', '/admin/:path*', '/api/admin/:path*'],
};