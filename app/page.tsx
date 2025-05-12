'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle, LogIn, UserPlus, ChevronRight, Activity, Brain, Clock, Target } from 'lucide-react'
import { DashboardCard } from '@/app/components/ui/DashboardCard'
import { DashboardSection } from '@/app/components/ui/DashboardSection'
import { DashboardHeader } from '@/app/components/ui/DashboardHeader'
import { DashboardSummary } from '@/app/components/ui/DashboardSummary'
import { SuspenseWrapper } from '@/app/components/ui/SuspenseWrapper'
import { PreferencesButton } from '@/app/components/ui/PreferencesButton'
import { Button, buttonVariants } from '@/app/components/ui/Button'
import { PainelDia } from '@/app/components/inicio/PainelDia'
import { ListaPrioridades } from '@/app/components/inicio/ListaPrioridades'
import { LembretePausas } from '@/app/components/inicio/LembretePausas'
import { ChecklistMedicamentos } from '@/app/components/inicio/ChecklistMedicamentos'
import { ProximaProvaCard } from '@/app/components/inicio/ProximaProvaCard'
import { useDashboard } from '@/app/hooks/useDashboard'
import { useAuthStore } from '@/app/stores/authStore'
import { cn } from '@/app/lib/utils'

// Componentes de placeholder para Suspense
const PainelDiaPlaceholder = () => (
  <div className="md:col-span-2">
    <DashboardCard isLoading title="Painel do Dia">
      Carregando...
    </DashboardCard>
  </div>
)

const ListaPrioridadesPlaceholder = () => (
  <div>
    <DashboardCard isLoading title="Prioridades do Dia">
      Carregando...
    </DashboardCard>
  </div>
)

const LembretePausasPlaceholder = () => (
  <div className="h-40 bg-white dark:bg-gray-800 rounded-xl shadow-md animate-pulse"></div>
)

const ProximaProvaPlaceholder = () => (
  <div className="h-32 bg-white dark:bg-gray-800 rounded-xl shadow-md animate-pulse"></div>
)

export default function HomePage() {
  // Estado de autenticação do usuário
  const user = useAuthStore(state => state.user)
  const isAuthLoading = useAuthStore(state => state.isLoading)
  const [userName, setUserName] = useState('')
  
  // Usar o hook personalizado para carregar os dados do dashboard
  const {
    blocosDia,
    prioridadesDia,
    proximosCompromissos,
    prioridadesPendentes,
    prioridadesConcluidas,
    metasPausas,
    mostrarPausas,
    nomeUsuario,
    preferenciasVisuais,
    isLoading
  } = useDashboard()

  // Extrair nome do usuário para personalização
  useEffect(() => {
    if (user) {
      // Priorizar nome do metadata, depois nome do email, depois email completo
      const fullName = user.user_metadata?.full_name
      const emailName = user.email?.split('@')[0]
      
      setUserName(fullName || emailName || user.email || '')
    }
  }, [user])
  
  // Aplicar preferências visuais se estiverem definidas
  useEffect(() => {
    if (preferenciasVisuais) {
      // Aplicar texto grande
      if (preferenciasVisuais.textoGrande) {
        document.documentElement.classList.add('text-lg')
      } else {
        document.documentElement.classList.remove('text-lg')
      }
      
      // Aplicar alto contraste
      if (preferenciasVisuais.altoContraste) {
        document.documentElement.classList.add('high-contrast')
      } else {
        document.documentElement.classList.remove('high-contrast')
      }
      
      // Aplicar redução de estímulos
      if (preferenciasVisuais.reducaoEstimulos) {
        document.documentElement.classList.add('reduce-motion')
      } else {
        document.documentElement.classList.remove('reduce-motion')
      }
    }
  }, [preferenciasVisuais])

  // Decidir qual conteúdo exibir com base no estado de autenticação
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }
  
  // Se o usuário não estiver autenticado, mostrar uma landing page
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero section */}
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Organize seu cérebro único
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ferramentas personalizadas para ajudar pessoas neurodivergentes a organizar estudos, monitorar saúde e aumentar produtividade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/login">
              <Button className="min-w-[200px] text-lg py-6" size="lg">
                <LogIn className="mr-2 h-5 w-5" />
                Acessar conta
              </Button>
            </Link>
            <Link href="/register">
              <Button className="min-w-[200px] text-lg py-6" variant="outline" size="lg">
                <UserPlus className="mr-2 h-5 w-5" />
                Criar conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 w-12 h-12 flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Monitoramento de Saúde</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Acompanhe medicamentos, ciclos de sono e outros aspectos importantes para seu bem-estar.</p>
            <Link href="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center">
              <span>Comece já</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 w-12 h-12 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Estudos Personalizados</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Ferramentas adaptadas para diferentes estilos de aprendizagem e necessidades específicas.</p>
            <Link href="/register" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 inline-flex items-center">
              <span>Explore recursos</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 w-12 h-12 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Gerenciamento de Hiperfocos</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Transforme seus interesses intensos em projetos produtivos e bem organizados.</p>
            <Link href="/register" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 inline-flex items-center">
              <span>Saiba mais</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
        
        {/* Testimonials or additional info could go here */}
      </div>
    )
  }

  // Conteúdo para usuários autenticados (o dashboard existente)
  return (
    <div className={`container mx-auto px-4 space-y-6 ${isLoading ? 'opacity-80' : ''}`}>
      <DashboardHeader
        title="Início"
        userName={userName || nomeUsuario}
        description={`Bem-vindo(a) de volta! Aqui está seu progresso e tarefas para hoje.`}
        actions={<PreferencesButton />}
      />
      
      {/* Resumo rápido */}
      <DashboardSummary
        prioridadesPendentes={prioridadesPendentes}
        prioridadesConcluidas={prioridadesConcluidas}
        proximosCompromissos={proximosCompromissos?.length || 0}
        className="mb-8"
      />
      
      <main className="pb-8">
        <DashboardSection id="painel-principal" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Painel Visual do Dia */}
          <SuspenseWrapper fallback={<PainelDiaPlaceholder />}>
            <div className="md:col-span-2">
              <DashboardCard title="Painel do Dia">
                <PainelDia />
              </DashboardCard>
            </div>
          </SuspenseWrapper>
          
          {/* Lista de Prioridades */}
          <SuspenseWrapper fallback={<ListaPrioridadesPlaceholder />}>
            <div>
              <DashboardCard 
                title="Prioridades do Dia"
                className="h-full"
              >
                <div className="space-y-6">
                  <ListaPrioridades />
                  
                  {/* Separador */}
                  <div 
                    role="separator" 
                    className="border-t border-gray-200 dark:border-gray-700 my-2" 
                    aria-hidden="true"
                  ></div>
                  
                  {/* Checklist de Medicamentos Diários */}
                  <ChecklistMedicamentos />
                </div>
              </DashboardCard>
            </div>
          </SuspenseWrapper>
        </DashboardSection>
        
        {/* Lembretes de Pausas e Próximas Provas */}
        {mostrarPausas && (
          <DashboardSection id="pausas-provas" className="mt-8 space-y-6">
            <SuspenseWrapper fallback={<LembretePausasPlaceholder />}>
              <LembretePausas />
            </SuspenseWrapper>

            <SuspenseWrapper fallback={<ProximaProvaPlaceholder />}>
              <ProximaProvaCard />
            </SuspenseWrapper>
          </DashboardSection>
        )}
        
        {/* Links Rápidos */}
        <DashboardSection id="links-rapidos" title="Acesso Rápido" className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/estudos" className={cn(
              buttonVariants({ variant: "outline" }),
              "flex flex-col items-center justify-center h-24 p-4 text-estudos-primary hover:bg-estudos-light hover:border-estudos-primary"
            )}>
              <span className="text-sm font-medium">Estudos</span>
              <span className="text-xs mt-1 text-gray-500">Materiais e Técnicas</span>
            </Link>
            
            <Link href="/saude" className={cn(
              buttonVariants({ variant: "outline" }),
              "flex flex-col items-center justify-center h-24 p-4 text-saude-primary hover:bg-saude-light hover:border-saude-primary"
            )}>
              <span className="text-sm font-medium">Saúde</span>
              <span className="text-xs mt-1 text-gray-500">Medicamentos e Bem-estar</span>
            </Link>
            
            <Link href="/hiperfocos" className={cn(
              buttonVariants({ variant: "outline" }),
              "flex flex-col items-center justify-center h-24 p-4 text-hiperfocos-primary hover:bg-hiperfocos-light hover:border-hiperfocos-primary"
            )}>
              <span className="text-sm font-medium">Hiperfocos</span>
              <span className="text-xs mt-1 text-gray-500">Projetos e Interesses</span>
            </Link>
            
            <Link href="/lazer" className={cn(
              buttonVariants({ variant: "outline" }),
              "flex flex-col items-center justify-center h-24 p-4 text-lazer-primary hover:bg-lazer-light hover:border-lazer-primary"
            )}>
              <span className="text-sm font-medium">Lazer</span>
              <span className="text-xs mt-1 text-gray-500">Atividades e Descanso</span>
            </Link>
          </div>
        </DashboardSection>
      </main>
    </div>
  )
}
