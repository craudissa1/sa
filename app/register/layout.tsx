import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Criar Conta | Painel Neurodivergentes',
  description: 'Crie sua conta para acessar ferramentas personalizadas para neurodivergentes',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
