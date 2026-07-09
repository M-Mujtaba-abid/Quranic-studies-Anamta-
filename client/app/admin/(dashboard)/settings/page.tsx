'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, KeyRound, Settings } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/auth/useAuth';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function AdminSettingsPage() {
  const { changePassword, isChangingPassword } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    const result = await changePassword(data.currentPassword, data.newPassword);
    if (result.success) {
      reset();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-text">Account Settings</h2>
          <p className="text-sm text-text-secondary mt-1">
            Manage your admin account security.
          </p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Settings size={20} />
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-surface border border-border p-6 sm:p-8 rounded-2xl shadow-sm max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
            <KeyRound size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-text">Change Password</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Update your password to keep your account secure.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Current Password *"
            type="password"
            placeholder="••••••••"
            {...register('currentPassword')}
            error={errors.currentPassword?.message}
            leftIcon={<Lock className="h-4 w-4" />}
          />

          <Input
            label="New Password *"
            type="password"
            placeholder="••••••••"
            {...register('newPassword')}
            error={errors.newPassword?.message}
            leftIcon={<Lock className="h-4 w-4" />}
          />

          <Input
            label="Confirm New Password *"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            leftIcon={<Lock className="h-4 w-4" />}
          />

          <Button
            type="submit"
            variant="gold"
            className="py-3 text-xs uppercase font-bold tracking-wider"
            isLoading={isChangingPassword}
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
