import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from './context/AuthContext'
import { Header } from '@/app/components/layout/Header'
import { Footer } from '@/app/components/layout/Footer'
import { Providers } from '@/app/providers'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Painel para Neurodivergentes',
  description: 'Um painel personalizado com ferramentas para ajudar pessoas neurodivergentes no dia a dia',
  // Atualizar para usar o novo logo como ícone principal
  icons: {
    icon: [
      // Usar o novo logo PNG como ícone principal
      { url: '/images/stayfocus_logo.png', type: 'image/png' }
    ],
    // Manter o logo SVG para Apple touch icon por enquanto, ou podemos mudar se preferir
    apple: '/images/logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            <div className="flex h-screen overflow-hidden">
              <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4">
                  {children}
                  <Footer />
                </main>
              </div>
            </div>
          </Providers>
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
