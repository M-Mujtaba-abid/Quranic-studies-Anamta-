import { deleteCookie, setCookie } from '../../lib/cookies';
import { toast } from 'sonner';

export class AuthService {
  /**
   * Persists the token in cookies securely and redirects
   */
  static async handleLoginSuccess(
    token: string,
    user: { firstName: string; lastName: string; role: string }
  ): Promise<void> {
    const isProd = process.env.NODE_ENV === 'production';

    await setCookie('token', token, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    });

    toast.success(`Welcome back, ${user.firstName}!`, {
      description: 'Logged in successfully.',
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/admin/dashboard';
    }
  }

  /**
   * Cleans session and cookie, then redirects to login
   */
  static async handleLogout(): Promise<void> {
    await deleteCookie('token');

    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }

    toast.info('Logged out', {
      description: 'You have been signed out.',
    });

    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  }

  /**
   * Handles and parses GraphQL/Network Errors to present user-friendly Sonner toast messages
   */
  static handleAuthError(error: any): void {
    console.error('Authentication Error:', error);

    const rootMessage = error?.message || 'An unexpected error occurred.';
    const extensions = error?.extensions || error?.graphQLErrors?.[0]?.extensions;
    const originalError = extensions?.originalError || extensions?.response;

    let detailedMessage = '';
    if (originalError && originalError.message) {
      detailedMessage = Array.isArray(originalError.message)
        ? originalError.message.join(', ')
        : originalError.message;
    }

    toast.error(
      rootMessage === 'Bad Request Exception' && detailedMessage
        ? 'Validation Failed'
        : 'Error',
      {
        description: detailedMessage || rootMessage,
      }
    );
  }
}
