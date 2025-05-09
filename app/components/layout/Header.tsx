'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon, HelpCircle, Anchor, LogIn, LogOut, UserPlus } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Sidebar } from './Sidebar'
import Link from 'next/link'
import { useAuth } from '../auth/AuthProvider'
import { useRouter } from 'next/navigation'

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user, signOut, isLoading } = useAuth()
  const router = useRouter()
  
  // Garantir que o componente foi montado no cliente antes de renderizar ícones dinâmicos
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Função para abrir o sidebar
  const openSidebar = () => {
    setSidebarOpen(true)
  }

  // Função para fechar o sidebar
  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <>
      {/* Sidebar controlável */}
      {sidebarOpen && (
        <Sidebar onClose={closeSidebar} />
      )}
      
      {/* Header fixo no topo */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo e menu button */}
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={openSidebar}
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="ml-3 flex items-center">
              <span className="sr-only">StayFocus</span>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center space-x-3">
            {/* Botões de autenticação ou controles de usuário logado */}
            {!isLoading && (
              <>
                {!user ? (
                  <div className="flex items-center space-x-2">
                    <Link href="/auth/login">
                      <button
                        className="flex items-center px-3 py-1.5 rounded text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        aria-label="Fazer login"
                      >
                        {mounted ? (
                          <>
                            <LogIn className="h-4 w-4 mr-1" aria-hidden="true" />
                            <span className="text-sm">Login</span>
                          </>
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </button>
                    </Link>
                    
                    <Link href="/register">
                      <button
                        className="flex items-center px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        aria-label="Criar conta"
                      >
                        {mounted ? (
                          <>
                            <UserPlus className="h-4 w-4 mr-1" aria-hidden="true" />
                            <span className="text-sm">Registrar</span>
                          </>
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Ícone Zzz para Sono */}
                    <Link href="/sono">
                      <button
                        className="p-2 rounded-full text-sono-primary hover:bg-sono-light focus:outline-none focus:ring-2 focus:ring-sono-primary"
                        aria-label="Gestão do Sono"
                      >
                        {mounted ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className="h-5 w-5"
                            suppressHydrationWarning
                          >
                            <path d="M2 4v16"></path>
                            <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
                            <path d="M2 17h20"></path>
                            <path d="M6 8v9"></path>
                          </svg>
                        ) : (
                          <div className="h-5 w-5" />
                        )}
                      </button>
                    </Link>
                    
                    {/* Ícone de Âncora para Autoconhecimento */}
                    <Link href="/autoconhecimento">
                      <button
                        className="p-2 rounded-full text-autoconhecimento-primary hover:bg-autoconhecimento-light focus:outline-none focus:ring-2 focus:ring-autoconhecimento-primary"
                        aria-label="Notas de Autoconhecimento"
                      >
                        {mounted ? <Anchor className="h-5 w-5" aria-hidden="true" /> : <div className="h-5 w-5" />}
                      </button>
                    </Link>
                  </>
                )}
              </>
            )}
            
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              suppressHydrationWarning
            >
              {mounted && (
                theme === 'dark' ? (
                  <Sun className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Moon className="h-5 w-5" aria-hidden="true" />
                )
              )}
              {!mounted && <div className="h-5 w-5" />}
            </button>

            {/* Help button */}
            <Link href="/roadmap">
              <button
                className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Roadmap e Ajuda"
              >
                {mounted ? <HelpCircle className="h-5 w-5" aria-hidden="true" /> : <div className="h-5 w-5" />}
              </button>
            </Link>

            {user && (
              <>
                {/* User profile */}
                <div className="relative group">
                  <Link href="/perfil">
                    <button 
                      className="h-8 w-8 rounded-full bg-perfil-primary hover:bg-perfil-secondary text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-perfil-primary"
                      aria-label="Informações Pessoais"
                    >
                      <span className="text-sm font-medium">
                        {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </button>
                  </Link>
                  
                  {/* Menu dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                    <div className="px-4 py-2 border-b dark:border-gray-700">
                      <p className="text-sm font-semibold truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link href="/perfil">
                        <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          Meu Perfil
                        </span>
                      </Link>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                        onClick={async () => {
                          setIsLoggingOut(true);
                          try {
                            await signOut();
                            // O redirecionamento para /login já está na função signOut
                          } catch (error) {
                            console.error('Erro ao fazer logout:', error);
                          } finally {
                            setIsLoggingOut(false);
                          }
                        }}
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saindo...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
