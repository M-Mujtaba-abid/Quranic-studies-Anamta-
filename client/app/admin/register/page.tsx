'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/auth/useAuth';

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AdminRegisterPage() {
  const { register: registerUser, isRegistering } = useAuth();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const result = await registerUser({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    if (result.success) {
      setDone(true);
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
            Create Account
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Sign up for access to the Quranic Studies dashboard.
          </p>
        </div>

        <div className="bg-surface border border-border p-8 rounded-2xl shadow-xl shadow-primary/5">
          {done ? (
            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm text-text-secondary">
                Your account has been created. An administrator needs to grant it dashboard
                access before you can sign in.
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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="Mujtaba"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  leftIcon={<User className="h-4 w-4" />}
                />
                <Input
                  label="Last Name"
                  placeholder="Abid"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  leftIcon={<User className="h-4 w-4" />}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="you@anamtainstitute.com"
                {...register('email')}
                error={errors.email?.message}
                leftIcon={<Mail className="h-4 w-4" />}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
                leftIcon={<Lock className="h-4 w-4" />}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                leftIcon={<Lock className="h-4 w-4" />}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3"
                isLoading={isRegistering}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Create Account
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
