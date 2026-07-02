'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

export function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <div className="max-w-md w-full text-center space-y-6 bg-surface border border-border p-8 rounded-2xl shadow-xl">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400">
          <Lock className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-text">403 - Access Denied</h1>
          <p className="text-text-secondary text-sm">
            You do not have the required permissions to access this page. Please log in with an authorized account.
          </p>
        </div>
        <Link href="/admin/login" passHref className="block w-full">
          <Button
            variant="primary"
            className="w-full"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Go to Admin Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
