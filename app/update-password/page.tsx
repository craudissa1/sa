import { Metadata } from 'next';
import UpdatePasswordForm from '../components/auth/UpdatePasswordForm';

export const metadata: Metadata = {
  title: 'Atualizar Senha | Painel Neurodivergentes',
  description: 'Crie uma nova senha para sua conta',
};

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Atualize sua senha
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Crie uma nova senha para sua conta
          </p>
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
} 