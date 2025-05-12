import './globals.css'
import type { Metadata } from 'next'
// Removemos o import da fonte Inter do next/font/google para evitar conflitos com o Babel
import { AuthProvider } from './components/auth/AuthProvider'
import { Header } from '@/app/components/layout/Header'
import { Footer } from '@/app/components/layout/Footer'
import { Providers } from '@/app/providers'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Definimos a classe diretamente, em vez de usar a fonte Inter do next/font
// A fonte Inter será carregada via globals.css usando @import ou link no head

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
      <body className="font-sans">
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
