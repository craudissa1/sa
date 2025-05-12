import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Painel Neurodivergentes',
  description: 'Acesse sua conta para gerenciar seu painel personalizado',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
