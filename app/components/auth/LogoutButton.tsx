"use client";

import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LogoutButtonProps {
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

const LogoutButton = ({ variant = 'full', className = '' }: LogoutButtonProps) => {
  const { signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  // Botão apenas com ícone
  if (variant === 'icon') {
    return (
      <button
        onClick={handleSignOut}
        disabled={loading}
        className={`p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-50 dark:hover:bg-gray-800 ${className}`}
        aria-label="Sair"
      >
        <LogOut className="h-5 w-5" />
      </button>
    );
  }

  // Botão apenas com texto
  if (variant === 'text') {
    return (
      <button
        onClick={handleSignOut}
        disabled={loading}
        className={`px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white ${className}`}
      >
        {loading ? 'Saindo...' : 'Sair'}
      </button>
    );
  }

  // Botão completo com ícone e texto
  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-700 ${className}`}
    >
      <LogOut className="h-4 w-4" />
      {loading ? 'Saindo...' : 'Sair da conta'}
    </button>
  );
};

export default LogoutButton; 