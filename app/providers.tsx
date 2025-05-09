'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { AuthProvider } from './components/auth/AuthProvider';
import StoreInitializer from './components/utils/StoreInitializer';

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
      {...props}
    >
      <AuthProvider>
        <StoreInitializer />
        <div suppressHydrationWarning>
          {children}
        </div>
      </AuthProvider>
    </NextThemesProvider>
  );
}

