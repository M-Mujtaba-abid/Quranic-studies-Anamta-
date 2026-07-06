'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/auth/useAuth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-bg relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gold/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold font-display tracking-tight text-text">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to manage the Quranic Studies dashboard.
          </p>
        </div>

        <div className="bg-surface border border-border p-8 rounded-2xl shadow-xl shadow-primary/5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@anamtainstitute.com"
              {...register('email')}
              error={errors.email?.message}
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <div className="space-y-1.5">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
                leftIcon={<Lock className="h-4 w-4" />}
              />
              <div className="flex justify-end">
                <Link
                  href="/admin/forgot-password"
                  className="text-xs font-medium text-text-secondary hover:text-gold transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              isLoading={isLoggingIn}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In
            </Button>

            <p className="text-center text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link
                href="/admin/register"
                className="font-semibold text-gold hover:text-gold-light transition-colors"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
