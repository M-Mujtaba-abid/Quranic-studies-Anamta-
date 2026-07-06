import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwt(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Restore base64 padding — JWT segments are unpadded and some base64 decoders
    // (unlike browser atob) require length to be a multiple of 4.
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
    console.error('[proxy] Failed to decode JWT:', err);
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = decodeJwt(token);

    if (!payload || payload.role !== 'ADMIN') {
      const reason = !payload
        ? 'decode-failed'
        : `role=${String(payload.role)}`;

      console.error('[proxy] Rejecting admin request:', {
        pathname,
        hasPayload: !!payload,
        role: payload?.role,
      });

      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'unauthorized');
      // TEMPORARY diagnostic — remove once the prod redirect issue is confirmed fixed.
      loginUrl.searchParams.set('reason', reason);

      const response = NextResponse.redirect(loginUrl);
      // Clear token since it is invalid or unauthorized
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
