/**
 * Utility for reading, writing, and deleting cookies.
 * Compatible with both Next.js server context (Server Components / Actions) and client context.
 */

const isBrowser = typeof window !== 'undefined';

export async function getCookie(name: string): Promise<string | undefined> {
  if (isBrowser) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  } else {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      return cookieStore.get(name)?.value;
    } catch {
      return undefined;
    }
  }
}

export async function setCookie(
  name: string,
  value: string,
  options: { maxAge?: number; secure?: boolean; sameSite?: 'lax' | 'strict' | 'none' } = {}
): Promise<void> {
  if (isBrowser) {
    let cookieString = `${name}=${encodeURIComponent(value)}; path=/`;
    if (options.maxAge) cookieString += `; max-age=${options.maxAge}`;
    if (options.secure) cookieString += '; secure';
    if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;
    document.cookie = cookieString;
  } else {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      cookieStore.set(name, value, {
        path: '/',
        maxAge: options.maxAge,
        secure: options.secure,
        sameSite: options.sameSite,
        httpOnly: true,
      });
    } catch (e) {
      console.warn('Failed to set cookie on server:', e);
    }
  }
}

export async function deleteCookie(name: string): Promise<void> {
  if (isBrowser) {
    document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  } else {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      cookieStore.delete(name);
    } catch (e) {
      console.warn('Failed to delete cookie on server:', e);
    }
  }
}
