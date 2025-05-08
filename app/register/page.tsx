import { Metadata } from 'next';
import RegisterForm from '../components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Criar Conta | Painel Neurodivergentes',
  description: 'Crie sua conta para acessar ferramentas personalizadas para neurodivergentes',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Crie sua conta
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Comece sua jornada com ferramentas personalizadas para seu cérebro único
          </p>
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
} 