"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../auth/AuthProvider'; // Import do nosso novo hook useAuth
import { Mail, Lock, AlertCircle, Github, ExternalLink } from 'lucide-react';

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [migrationMessage, setMigrationMessage] = useState<string | null>(null);
  
  // Usando o hook useAuth para acessar as funções de autenticação
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  
  // Verificar se o usuário já está autenticado
  useEffect(() => {
    if (user) {
      // Determinar para onde redirecionar após login
      const redirectTo = searchParams?.get('redirect') || '/';
      router.push(redirectTo);
    }
  }, [user, router, searchParams]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Usando a função signIn do hook useAuth
      const { error, success } = await signIn(email, password);
      
      if (error) throw error;
      
      if (success) {
        setMigrationMessage('Login realizado! Migrando dados locais para o Supabase...');
        // O redirecionamento será feito automaticamente pelo useEffect quando o user estiver disponível
      }
      
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      
      if (error.message && error.message.includes('Invalid login')) {
        setError('Email ou senha inválidos. Verifique suas credenciais.');
      } else {
        setError(error.message || 'Ocorreu um erro durante o login. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (provider === 'google') {
        // Usar a nova função signInWithGoogle do AuthProvider
        const { error, success } = await signInWithGoogle();
        
        if (error) {
          throw error;
        }
        
        // Sucesso - o redirecionamento será tratado pela função do Supabase
        setMigrationMessage('Login com Google iniciado...');
      } else {
        // Adicionar suporte para outros provedores no futuro
        setError(`Login com ${provider} será implementado em breve.`);
      }
    } catch (error: any) {
      console.error(`Erro ao fazer login com ${provider}:`, error);
      setError(`Erro ao conectar com ${provider}. ${error.message || 'Tente novamente.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              required
              className="bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border border-gray-300 rounded-md py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Senha
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border border-gray-300 rounded-md py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Lembrar-me
            </label>
          </div>
          
          <div className="text-sm">
            <Link 
              href="/reset-password"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
      
      {migrationMessage && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-4">
          <div className="flex items-center">
            <p className="text-sm text-blue-700">{migrationMessage}</p>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Ou continue com
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="ml-2">Entrar com Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <svg className="h-5 w-5 text-gray-700 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 0 1-6.031-6.024 6.033 6.033 0 0 1 6.031-6.024c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2a9.949 9.949 0 0 0-9.95 9.95 9.949 9.949 0 0 0 9.95 9.95c4.963 0 9.236-3.108 10.9-7.87.28-.816.459-1.69.511-2.614h-11.4v3.378z" />
            </svg>
            <span className="ml-2">Google</span>
          </button>
        </div>
      </div>
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{' '}
          <Link 
            href="/register" 
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 