'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { AuthProvider } from './context/AuthContext';
import StoreInitializer from './components/utils/StoreInitializer'; // Import StoreInitializer

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
        <StoreInitializer /> {/* Add StoreInitializer here */}
        <div suppressHydrationWarning>
          {children}
        </div>
      </AuthProvider>
    </NextThemesProvider>
  );
}

