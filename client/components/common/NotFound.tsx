'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ShieldQuestion } from 'lucide-react';
import { Button } from '../ui/Button';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <div className="max-w-md w-full text-center space-y-6 bg-surface border border-border p-8 rounded-2xl shadow-xl">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
          <ShieldQuestion className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-display text-text">404</h1>
          <h2 className="text-xl font-semibold text-text">Page Not Found</h2>
          <p className="text-text-secondary text-sm">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link href="/" passHref className="block w-full">
          <Button
            variant="primary"
            className="w-full"
            leftIcon={<Home className="h-4 w-4" />}
          >
            Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
