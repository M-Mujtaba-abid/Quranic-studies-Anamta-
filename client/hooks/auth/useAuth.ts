'use client';

import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  REGISTER_MUTATION,
  FORGOT_PASSWORD_MUTATION,
  RESET_PASSWORD_MUTATION,
  CHANGE_PASSWORD_MUTATION,
} from '../../graphql';
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

  const [registerMutation, { loading: isRegistering }] = useMutation<any, any>(
    REGISTER_MUTATION,
    { fetchPolicy: 'no-cache' }
  );

  const [forgotPasswordMutation, { loading: isSendingResetLink }] = useMutation<any, any>(
    FORGOT_PASSWORD_MUTATION,
    { fetchPolicy: 'no-cache' }
  );

  const [resetPasswordMutation, { loading: isResettingPassword }] = useMutation<any, any>(
    RESET_PASSWORD_MUTATION,
    { fetchPolicy: 'no-cache' }
  );

  const [changePasswordMutation, { loading: isChangingPassword }] = useMutation<any, any>(
    CHANGE_PASSWORD_MUTATION,
    { fetchPolicy: 'no-cache' }
  );

  const login = async (variables: any) => {
    try {
      const response = await loginMutation({ variables });
      const loginData = response.data?.login;

      if (loginData) {
        const { token, user } = loginData;

        if (!token) {
          AuthService.handleAuthError({
            message: 'Login Failed',
            extensions: {
              originalError: {
                message: 'No session token was returned. Please try again.',
              },
            },
          });
          return { success: false };
        }

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

  const register = async (variables: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      await registerMutation({ variables });
      toast.success('Account created', {
        description: 'Your account has been created. An administrator needs to grant it dashboard access before you can sign in.',
      });
      return { success: true };
    } catch (err: any) {
      AuthService.handleAuthError(err);
      return { success: false, error: err };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await forgotPasswordMutation({ variables: { email } });
      toast.success('Reset link sent', {
        description: 'If an account exists for that email, a password reset link has been sent.',
      });
      return { success: true };
    } catch (err: any) {
      AuthService.handleAuthError(err);
      return { success: false, error: err };
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await resetPasswordMutation({ variables: { token, newPassword } });
      toast.success('Password reset', {
        description: 'Your password has been updated. Please sign in.',
      });
      return { success: true };
    } catch (err: any) {
      AuthService.handleAuthError(err);
      return { success: false, error: err };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await changePasswordMutation({ variables: { currentPassword, newPassword } });
      toast.success('Password updated', {
        description: 'Your password has been changed successfully.',
      });
      return { success: true };
    } catch (err: any) {
      AuthService.handleAuthError(err);
      return { success: false, error: err };
    }
  };

  return {
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    isLoggingIn,
    isLoggingOut,
    isRegistering,
    isSendingResetLink,
    isResettingPassword,
    isChangingPassword,
    loginError,
  };
}
