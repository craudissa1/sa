import { render, screen, act } from '@testing-library/react'
import HomePage from '@/app/page' // Ajuste o caminho se necessário
import '@testing-library/jest-dom'

// Mock para o hook useDashboard
jest.mock('@/app/hooks/useDashboard', () => ({
  useDashboard: jest.fn(() => ({
    blocosDia: [],
    prioridadesDia: [],
    proximosCompromissos: [],
    prioridadesPendentes: 3,
    prioridadesConcluidas: 2,
    metasPausas: { realizadas: 1, total: 3 },
    mostrarPausas: true,
    nomeUsuario: 'Usuário Teste',
    preferenciasVisuais: {
      textoGrande: false,
      altoContraste: false,
      reducaoEstimulos: false,
    },
    isLoading: false,
  })),
}))

// Mock para next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock para componentes UI e outros componentes complexos para focar no teste da HomePage
jest.mock('@/app/components/ui/DashboardCard', () => ({
  DashboardCard: jest.fn(({ title, children, isLoading }) => (
    <div data-testid="dashboard-card" data-loading={isLoading}>
      <h3>{title}</h3>
      {children}
    </div>
  )),
}))

jest.mock('@/app/components/ui/DashboardSection', () => ({
  DashboardSection: jest.fn(({ title, children, id }) => (
    <section data-testid="dashboard-section" aria-labelledby={id}>
      {title && <h2 id={id}>{title}</h2>}
      {children}
    </section>
  )),
}))

jest.mock('@/app/components/ui/DashboardHeader', () => ({
  DashboardHeader: jest.fn(({ title, userName, description, actions }) => (
    <header data-testid="dashboard-header">
      <h1>{title}</h1>
      <p>Olá, {userName}</p>
      <p>{description}</p>
      {actions}
    </header>
  )),
}))

jest.mock('@/app/components/ui/DashboardSummary', () => ({
  DashboardSummary: jest.fn(({ prioridadesPendentes, prioridadesConcluidas, proximosCompromissos }) => (
    <div data-testid="dashboard-summary">
      <p>Pendentes: {prioridadesPendentes}</p>
      <p>Concluídas: {prioridadesConcluidas}</p>
      <p>Compromissos: {proximosCompromissos}</p>
    </div>
  )),
}))

jest.mock('@/app/components/ui/SuspenseWrapper', () => ({
  SuspenseWrapper: jest.fn(({ children }) => <div data-testid="suspense-wrapper">{children}</div>),
}))

jest.mock('@/app/components/ui/PreferencesButton', () => ({
  PreferencesButton: jest.fn(() => <button data-testid="preferences-button">Preferências</button>),
}))

jest.mock('@/app/components/ui/Button', () => ({
  Button: jest.fn(({ children, ...props }) => <button {...props}>{children}</button>),
  buttonVariants: jest.fn(() => ''),
}))

jest.mock('@/app/components/inicio/PainelDia', () => ({
  PainelDia: jest.fn(() => <div data-testid="painel-dia">Painel do Dia Content</div>),
}))

jest.mock('@/app/components/inicio/ListaPrioridades', () => ({
  ListaPrioridades: jest.fn(() => <div data-testid="lista-prioridades">Lista de Prioridades Content</div>),
}))

jest.mock('@/app/components/inicio/LembretePausas', () => ({
  LembretePausas: jest.fn(() => <div data-testid="lembrete-pausas">Lembrete de Pausas Content</div>),
}))

jest.mock('@/app/components/inicio/ChecklistMedicamentos', () => ({
  ChecklistMedicamentos: jest.fn(() => <div data-testid="checklist-medicamentos">Checklist Medicamentos Content</div>),
}))

jest.mock('@/app/components/inicio/ProximaProvaCard', () => ({
  ProximaProvaCard: jest.fn(() => <div data-testid="proxima-prova-card">Próxima Prova Content</div>),
}))

// Mock para cn utility
jest.mock('@/app/lib/utils', () => ({
  cn: jest.fn((...inputs) => inputs.filter(Boolean).join(' ')),
}))

describe('HomePage', () => {
  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks()
    // Restaurar o mock de useDashboard para o valor padrão
    require('@/app/hooks/useDashboard').useDashboard.mockImplementation(() => ({
      blocosDia: [],
      prioridadesDia: [],
      proximosCompromissos: [],
      prioridadesPendentes: 3,
      prioridadesConcluidas: 2,
      metasPausas: { realizadas: 1, total: 3 },
      mostrarPausas: true,
      nomeUsuario: 'Usuário Teste',
      preferenciasVisuais: {
        textoGrande: false,
        altoContraste: false,
        reducaoEstimulos: false,
      },
      isLoading: false,
    }))
    // Limpar classes do documentElement
    document.documentElement.className = ''
  })

  it('renderiza o cabeçalho do dashboard com informações do usuário', () => {
    render(<HomePage />)
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument()
    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Olá, Usuário Teste')).toBeInTheDocument()
    expect(screen.getByText('Aqui está seu progresso e tarefas para hoje.')).toBeInTheDocument()
    expect(screen.getByTestId('preferences-button')).toBeInTheDocument()
  })

  it('renderiza o resumo do dashboard com dados mockados', () => {
    render(<HomePage />)
    expect(screen.getByTestId('dashboard-summary')).toBeInTheDocument()
    expect(screen.getByText('Pendentes: 3')).toBeInTheDocument()
    expect(screen.getByText('Concluídas: 2')).toBeInTheDocument()
    expect(screen.getByText('Compromissos: 0')).toBeInTheDocument() // Baseado no mock inicial de proximosCompromissos
  })

  it('renderiza a seção do painel principal com PainelDia e ListaPrioridades', () => {
    render(<HomePage />)
    // Verifica se a seção principal está presente
    const painelPrincipalSection = screen.getAllByTestId('dashboard-section').find(
      section => section.getAttribute('aria-labelledby') === 'painel-principal'
    )
    expect(painelPrincipalSection).toBeInTheDocument()

    // Verifica os cards dentro da seção
    expect(screen.getByTestId('painel-dia')).toBeInTheDocument()
    expect(screen.getByTestId('lista-prioridades')).toBeInTheDocument()
    expect(screen.getByTestId('checklist-medicamentos')).toBeInTheDocument()
  })

  it('renderiza a seção de pausas e provas quando mostrarPausas é true', () => {
    require('@/app/hooks/useDashboard').useDashboard.mockImplementation(() => ({
      // ...outros mocks
      mostrarPausas: true,
      nomeUsuario: 'Usuário Teste',
      preferenciasVisuais: {},
      isLoading: false,
      prioridadesPendentes: 0,
      prioridadesConcluidas: 0,
      proximosCompromissos: [],
    }))
    render(<HomePage />)
    const pausasProvasSection = screen.getAllByTestId('dashboard-section').find(
      section => section.getAttribute('aria-labelledby') === 'pausas-provas'
    )
    expect(pausasProvasSection).toBeInTheDocument()
    expect(screen.getByTestId('lembrete-pausas')).toBeInTheDocument()
    expect(screen.getByTestId('proxima-prova-card')).toBeInTheDocument()
  })

  it('NÃO renderiza a seção de pausas e provas quando mostrarPausas é false', () => {
    require('@/app/hooks/useDashboard').useDashboard.mockImplementation(() => ({
      // ...outros mocks
      mostrarPausas: false,
      nomeUsuario: 'Usuário Teste',
      preferenciasVisuais: {},
      isLoading: false,
      prioridadesPendentes: 0,
      prioridadesConcluidas: 0,
      proximosCompromissos: [],
    }))
    render(<HomePage />)
    const pausasProvasSection = screen.queryByRole('region', { name: /pausas e provas/i })
    expect(pausasProvasSection).not.toBeInTheDocument()
    expect(screen.queryByTestId('lembrete-pausas')).not.toBeInTheDocument()
    expect(screen.queryByTestId('proxima-prova-card')).not.toBeInTheDocument()
  })

  it('renderiza a seção de links rápidos com os links corretos', () => {
    render(<HomePage />)
    const linksRapidosSection = screen.getAllByTestId('dashboard-section').find(
      section => section.textContent?.includes('Acesso Rápido')
    )
    expect(linksRapidosSection).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Estudos/i })).toHaveAttribute('href', '/estudos')
    expect(screen.getByRole('link', { name: /Saúde/i })).toHaveAttribute('href', '/saude')
    expect(screen.getByRole('link', { name: /Hiperfocos/i })).toHaveAttribute('href', '/hiperfocos')
    expect(screen.getByRole('link', { name: /Lazer/i })).toHaveAttribute('href', '/lazer')
  })

  it('aplica classe de texto grande quando preferenciasVisuais.textoGrande é true', () => {
    require('@/app/hooks/useDashboard').useDashboard.mockImplementation(() => ({
      // ...outros mocks
      mostrarPausas: true,
      nomeUsuario: 'Usuário Teste',
      preferenciasVisuais: { textoGrande: true, altoContraste: false, reducaoEstimulos: false },
      isLoading: false,
      prioridadesPendentes: 0,
      prioridadesConcluidas: 0,
      proximosCompromissos: [],
    }))
    render(<HomePage />)
    expect(document.documentElement).toHaveClass('text-lg')
  })

  it('NÃO aplica classe de texto grande quando preferenciasVisuais.textoGrande é false', () => {
    require('@/app/hooks/useDashboard').useDashboard.mockImplementation(() => ({
      // ...outros mocks
      mostrarPausas: true,
      nomeUsuario: 'Usuário Teste',
      preferenciasVisuais: { textoGrande: false, altoContraste: false, reducaoEstimulos: false },
      isLoading: false,
      prioridadesPendentes: 0,
      prioridadesConcluidas: 0,
      proximosCompromissos: [],
    }))
    render(<HomePage />)
    expect(document.documentElement).not.toHaveClass('text-lg')
  })
  
  it('aplica classe de alto contraste quando preferenciasVisuais.altoContraste é true', () => {
    require('@/app/hooks/useDashboard').useDashboard.mockImplementation(() => ({
      // ...outros mocks
      mostrarPausas: true,
      nomeUsuario: 'Usuário Teste',
      preferenciasVisuais: { textoGrande: false, altoContraste: true, reducaoEstimulos: false },
      isLoading: false,
      prioridadesPendentes: 0,
      prioridadesConcluidas: 0,
      proximosCompromissos: [],
    }))
    render(<HomePage />)
    expect(document.documentElement).toHaveClass('high-contrast')
  })

  it('NÃO aplica classe de alto contraste quando preferenciasVisuais.altoContraste é false', () => {
    require('@/app/hooks/useDashboard').useDashboard.mockImplementation(() => ({
      // ...outros mocks
      mostrarPausas: true,
      nomeUsuario: 'Usuário Teste',
      preferenciasVisuais: { textoGrande: false, altoContraste: false, reducaoEstimulos: false },
      isLoading: false,
      prioridadesPendentes: 0,
      prioridadesConcluidas: 0,
      proximosCompromissos: [],
    }))
    render(<HomePage />)
    expect(document.documentElement).not.toHaveClass('high-contrast')
  })

  it('aplica classe de redução de estímulos quando preferenciasVisuais.reducaoEstimulos é true', () => {
    require('@/app/hooks/useDashboard').useDashboard.mockImplementation(() => ({
      // ...outros mocks
      mostrarPausas: true,
      nomeUsuario: 'Usuário Teste',
      preferenciasVisuais: { textoGrande: false, altoContraste: false, reducaoEstimulos: true },
      isLoading: false,
      prioridadesPendentes: 0,
      prioridadesConcluidas: 0,
      proximosCompromissos: [],
    }))
    render(<HomePage />)
    expect(document.documentElement).toHaveClass('reduce-motion')
  })

  it('NÃO aplica classe de redução de estímulos quando preferenciasVisuais.reducaoEstimulos é false', () => {
    require('@/app/hooks/useDashboard').useDashboard.mockImplementation(() => ({
      // ...outros mocks
      mostrarPausas: true,
      nomeUsuario: 'Usuário Teste',
      preferenciasVisuais: { textoGrande: false, altoContraste: false, reducaoEstimulos: false },
      isLoading: false,
      prioridadesPendentes: 0,
      prioridadesConcluidas: 0,
      proximosCompromissos: [],
    }))
    render(<HomePage />)
    expect(document.documentElement).not.toHaveClass('reduce-motion')
  })

  it('aplica classe de opacidade quando isLoading é true', () => {
    require('@/app/hooks/useDashboard').useDashboard.mockImplementation(() => ({
      // ...outros mocks
      mostrarPausas: true,
      nomeUsuario: 'Usuário Teste',
      preferenciasVisuais: {},
      isLoading: true, // <<--
      prioridadesPendentes: 0,
      prioridadesConcluidas: 0,
      proximosCompromissos: [],
    }))
    const { container } = render(<HomePage />)
    // O container principal da HomePage é o primeiro filho do body se não houver portais,
    // ou podemos pegar o div específico que tem a classe `opacity-80`
    expect(container.firstChild).toHaveClass('opacity-80')
  })

  it('NÃO aplica classe de opacidade quando isLoading é false', () => {
    require('@/app/hooks/useDashboard').useDashboard.mockImplementation(() => ({
      // ...outros mocks
      mostrarPausas: true,
      nomeUsuario: 'Usuário Teste',
      preferenciasVisuais: {},
      isLoading: false, // <<--
      prioridadesPendentes: 0,
      prioridadesConcluidas: 0,
      proximosCompromissos: [],
    }))
    const { container } = render(<HomePage />)
    expect(container.firstChild).not.toHaveClass('opacity-80')
  })
})