'use client'

import { usePerfilStore, PreferenciasVisuais as TipoPreferenciasVisuais, PerfilUsuario } from '../../stores/perfilStore' // Importar o tipo PerfilUsuario também
import { Eye, BarChart2, Type, Bell, Coffee, Moon } from 'lucide-react'
import { useEffect, useMemo } from 'react' // Importar useEffect e useMemo para aplicar classes na montagem

export function PreferenciasVisuais() {
  const perfilStore = usePerfilStore()
  
  // Usamos o perfil do store diretamente. Se for null, os componentes podem mostrar um estado de loading ou desabilitado.
  // Ou podemos ter um estado de carregamento mais explícito se o perfil ainda não foi buscado.
  const perfil: PerfilUsuario | null = perfilStore.perfil

  // Valores default para preferenciasVisuais, caso perfil ou perfil.preferenciasVisuais seja null
  const preferenciasAtuais: TipoPreferenciasVisuais = useMemo(() => perfil?.preferenciasVisuais || {
    altoContraste: false,
    reducaoEstimulos: false,
    textoGrande: false,
  }, [perfil?.preferenciasVisuais]);

  // Valores default para notificacoesAtivas e pausasAtivas
  const notificacoesAtivasAtuais: boolean = perfil?.notificacoesAtivas ?? true; // Usa true como default se null/undefined
  const pausasAtivasAtuais: boolean = perfil?.pausasAtivas ?? true; // Usa true como default se null/undefined

  // Aplicar classes ao documento na montagem e quando as preferências mudarem
  useEffect(() => {
    if (preferenciasAtuais.altoContraste) {
      document.documentElement.classList.add('alto-contraste')
    } else {
      document.documentElement.classList.remove('alto-contraste')
    }
    if (preferenciasAtuais.reducaoEstimulos) {
      document.documentElement.classList.add('reducao-estimulos')
    } else {
      document.documentElement.classList.remove('reducao-estimulos')
    }
    if (preferenciasAtuais.textoGrande) {
      document.documentElement.classList.add('texto-grande')
    } else {
      document.documentElement.classList.remove('texto-grande')
    }
  }, [preferenciasAtuais]);


  const toggleAltoContraste = () => {
    if (!perfil) return; // Não fazer nada se o perfil não estiver carregado

    // Cria o objeto completo para 'preferenciasVisuais'
    const novasPreferencias: TipoPreferenciasVisuais = {
      // Usa os valores atuais como base ou um default se preferenciasVisuais for null
      ...(perfil.preferenciasVisuais || { altoContraste: false, reducaoEstimulos: false, textoGrande: false }),
      altoContraste: !preferenciasAtuais.altoContraste,
      // Mantém os outros valores
      reducaoEstimulos: preferenciasAtuais.reducaoEstimulos,
      textoGrande: preferenciasAtuais.textoGrande,
    }
    perfilStore.updatePerfil({ 
      preferenciasVisuais: novasPreferencias
    })
    // A lógica de aplicar classes agora está no useEffect
  }
  
  const toggleReducaoEstimulos = () => {
    if (!perfil) return;

    const novasPreferencias: TipoPreferenciasVisuais = {
      ...(perfil.preferenciasVisuais || { altoContraste: false, reducaoEstimulos: false, textoGrande: false }),
      reducaoEstimulos: !preferenciasAtuais.reducaoEstimulos,
      // Mantém os outros valores
      altoContraste: preferenciasAtuais.altoContraste,
      textoGrande: preferenciasAtuais.textoGrande,
    }
    perfilStore.updatePerfil({ 
      preferenciasVisuais: novasPreferencias
    })
    // A lógica de aplicar classes agora está no useEffect
  }
  
  const toggleTextoGrande = () => {
    if (!perfil) return;
    
    const novasPreferencias: TipoPreferenciasVisuais = {
      ...(perfil.preferenciasVisuais || { altoContraste: false, reducaoEstimulos: false, textoGrande: false }),
      textoGrande: !preferenciasAtuais.textoGrande,
      // Mantém os outros valores
      altoContraste: preferenciasAtuais.altoContraste,
      reducaoEstimulos: preferenciasAtuais.reducaoEstimulos,
    }
    perfilStore.updatePerfil({ 
      preferenciasVisuais: novasPreferencias
    })
    // A lógica de aplicar classes agora está no useEffect
  }
  
  const alternarNotificacoes = () => {
    if (!perfil) return;
    perfilStore.updatePerfil({ notificacoesAtivas: !notificacoesAtivasAtuais })
  }
  
  const alternarPausas = () => {
    if (!perfil) return;
    perfilStore.updatePerfil({ pausasAtivas: !pausasAtivasAtuais })
  }

  // Adicionar um estado de carregamento se o perfil ainda não foi carregado
  if (!perfil) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <Eye className="h-5 w-5 mr-2 text-perfil-primary" />
          Preferências de Acessibilidade
        </h2>
        <p>Carregando preferências...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <Eye className="h-5 w-5 mr-2 text-perfil-primary" />
        Preferências de Acessibilidade
      </h2>
      
      <div className="space-y-5">
        {/* Modos visuais */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Modos Visuais
          </h3>
          
          <div className="space-y-3">
            {/* Alto contraste */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mr-3">
                  <BarChart2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    Alto Contraste
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Aumenta o contraste para melhor legibilidade
                  </p>
                </div>
              </div>
              
              <button
                role="switch"
                aria-checked={preferenciasAtuais.altoContraste} // Usa preferenciasAtuais
                onClick={toggleAltoContraste}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-perfil-primary ${
                  preferenciasAtuais.altoContraste ? 'bg-perfil-primary' : 'bg-gray-200 dark:bg-gray-700' // Usa preferenciasAtuais
                }`}
              >
                <span className="sr-only">Ativar alto contraste</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferenciasAtuais.altoContraste ? 'translate-x-6' : 'translate-x-1' // Usa preferenciasAtuais
                  }`}
                />
              </button>
            </div>
            
            {/* Redução de estímulos */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center mr-3">
                  <Moon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    Redução de Estímulos
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Remove animações e reduz cores intensas
                  </p>
                </div>
              </div>
              
              <button
                role="switch"
                aria-checked={preferenciasAtuais.reducaoEstimulos} // Usa preferenciasAtuais
                onClick={toggleReducaoEstimulos}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-perfil-primary ${
                  preferenciasAtuais.reducaoEstimulos ? 'bg-perfil-primary' : 'bg-gray-200 dark:bg-gray-700' // Usa preferenciasAtuais
                }`}
              >
                <span className="sr-only">Ativar redução de estímulos</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferenciasAtuais.reducaoEstimulos ? 'translate-x-6' : 'translate-x-1' // Usa preferenciasAtuais
                  }`}
                />
              </button>
            </div>
            
            {/* Texto grande */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                  <Type className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    Texto Grande
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Aumenta o tamanho do texto em toda a aplicação
                  </p>
                </div>
              </div>
              
              <button
                role="switch"
                aria-checked={preferenciasAtuais.textoGrande} // Usa preferenciasAtuais
                onClick={toggleTextoGrande}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-perfil-primary ${
                  preferenciasAtuais.textoGrande ? 'bg-perfil-primary' : 'bg-gray-200 dark:bg-gray-700' // Usa preferenciasAtuais
                }`}
              >
                <span className="sr-only">Ativar texto grande</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferenciasAtuais.textoGrande ? 'translate-x-6' : 'translate-x-1' // Usa preferenciasAtuais
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
        
        {/* Preferências gerais */}
        <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Preferências Gerais
          </h3>
          
          <div className="space-y-3">
            {/* Notificações */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-3">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    Lembretes
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Exibir lembretes visuais no painel
                  </p>
                </div>
              </div>
              
              <button
                role="switch"
                aria-checked={notificacoesAtivasAtuais} // Usa notificacoesAtivasAtuais
                onClick={alternarNotificacoes}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-perfil-primary ${
                  notificacoesAtivasAtuais ? 'bg-perfil-primary' : 'bg-gray-200 dark:bg-gray-700' // Usa notificacoesAtivasAtuais
                }`}
              >
                <span className="sr-only">Ativar notificações</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificacoesAtivasAtuais ? 'translate-x-6' : 'translate-x-1' // Usa notificacoesAtivasAtuais
                  }`}
                />
              </button>
            </div>
            
            {/* Pausas */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                  <Coffee className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    Pausas Programadas
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Exibir lembretes para fazer pausas
                  </p>
                </div>
              </div>
              
              <button
                role="switch"
                aria-checked={pausasAtivasAtuais} // Usa pausasAtivasAtuais
                onClick={alternarPausas}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-perfil-primary ${
                  pausasAtivasAtuais ? 'bg-perfil-primary' : 'bg-gray-200 dark:bg-gray-700' // Usa pausasAtivasAtuais
                }`}
              >
                <span className="sr-only">Ativar pausas programadas</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pausasAtivasAtuais ? 'translate-x-6' : 'translate-x-1' // Usa pausasAtivasAtuais
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          As preferências visuais são aplicadas imediatamente e salvas automaticamente para uso futuro.
        </p>
      </div>
    </div>
  )
}