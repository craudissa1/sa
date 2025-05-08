
'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient'; // Ajuste o caminho se necessário
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/Card';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        // Options for email confirmation, if desired
        // options: {
        //   emailRedirectTo: `${window.location.origin}/auth/callback`,
        // },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        // This case might indicate that email confirmation is required but the user object is returned without an email yet.
        // Supabase might have changed this behavior. Typically, if email confirmation is on, data.user might be null until confirmed.
        // Or data.session might be null.
        setMessage('Usuário registrado. Verifique seu e-mail para confirmação, se aplicável, antes de fazer login.');
        // router.push('/auth/login'); // Optionally redirect to login or a confirmation pending page
      } else if (data.user) {
        setMessage('Cadastro realizado com sucesso! Você pode fazer login agora.');
        // If auto-login after signup or if email confirmation is off:
        // router.push('/'); // Redirect to home or dashboard
        // router.refresh();
        // For now, let's just show a message and let them login manually.
        router.push('/auth/login?message=signup_successful');
      } else {
        // Fallback message if user is null but no error, which can happen if email confirmation is required.
        setMessage('Cadastro enviado. Por favor, verifique seu e-mail para confirmar sua conta.');
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
          <CardDescription className="text-center">Junte-se ao StayFocus</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6} // Supabase default minimum password length
                className="mt-1 block w-full"
                placeholder="Crie uma senha (mínimo 6 caracteres)"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Senha</label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full"
                placeholder="Confirme sua senha"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <a href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Faça login
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

