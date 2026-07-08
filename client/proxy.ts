import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwt(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes matched by the config (excludes login, register, etc.)
  const token = request.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = decodeJwt(token);

  if (!payload || payload.role !== 'ADMIN') {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('error', 'unauthorized');

    const response = NextResponse.redirect(loginUrl);
    // Clear token since it is invalid or unauthorized
    response.cookies.delete('token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all admin routes except the public ones:
     * - /admin/login
     * - /admin/register
     * - /admin/forgot-password
     * - /admin/reset-password
     */
    '/admin/((?!login|register|forgot-password|reset-password).*)',
  ],
};
