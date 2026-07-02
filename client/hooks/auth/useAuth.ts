'use client';

import { useMutation } from '@apollo/client/react';
import { LOGIN_MUTATION, LOGOUT_MUTATION } from '../../graphql';
import { AuthService } from '../../services/auth/auth.service';

export function useAuth() {
  const [loginMutation, { loading: isLoggingIn, error: loginError }] = useMutation<any, any>(
    LOGIN_MUTATION,
    {
      fetchPolicy: 'no-cache',
    }
  );

  const [logoutMutation, { loading: isLoggingOut }] = useMutation<any, any>(LOGOUT_MUTATION, {
    fetchPolicy: 'no-cache',
  });

  const login = async (variables: any) => {
    try {
      const response = await loginMutation({ variables });
      const loginData = response.data?.login;

      if (loginData) {
        const { token, user } = loginData;

        if (user.role !== 'ADMIN') {
          AuthService.handleAuthError({
            message: 'Access Denied',
            extensions: {
              originalError: {
                message: 'You do not have administrator privileges.',
              },
            },
          });
          await logoutMutation();
          return { success: false };
        }

        await AuthService.handleLoginSuccess(token, user);
        return { success: true };
      }

      return { success: false };
    } catch (err: any) {
      AuthService.handleAuthError(err);
      return { success: false, error: err };
    }
  };

  const logout = async () => {
    try {
      await logoutMutation();
      await AuthService.handleLogout();
    } catch (err) {
      await AuthService.handleLogout();
    }
  };

  return {
    login,
    logout,
    isLoggingIn,
    isLoggingOut,
    loginError,
  };
}
