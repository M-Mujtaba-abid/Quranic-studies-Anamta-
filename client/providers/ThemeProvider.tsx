'use client';

import React from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { themeConfig } from '../config/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme={themeConfig.defaultTheme}
      enableSystem
      storageKey={themeConfig.storageKey}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
