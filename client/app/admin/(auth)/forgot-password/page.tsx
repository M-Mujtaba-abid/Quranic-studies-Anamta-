'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Mail, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/auth/useAuth';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function AdminForgotPasswordPage() {
  const { forgotPassword, isSendingResetLink } = useAuth();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    const result = await forgotPassword(data.email);
    if (result.success) {
      setSent(true);
    }
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
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Enter your admin email and we'll send you a reset link.
          </p>
        </div>

        <div className="bg-surface border border-border p-8 rounded-2xl shadow-xl shadow-primary/5">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm text-text-secondary">
                If an account exists for that email, a password reset link has been sent. Check
                your inbox and spam folder — the link is valid for 1 hour.
              </p>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-light transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@anamtainstitute.com"
                {...register('email')}
                error={errors.email?.message}
                leftIcon={<Mail className="h-4 w-4" />}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3"
                isLoading={isSendingResetLink}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Send Reset Link
              </Button>

              <Link
                href="/admin/login"
                className="flex items-center justify-center gap-1.5 text-sm font-medium text-text-secondary hover:text-gold transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
