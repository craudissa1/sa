'use client'

import { useState, useEffect } from 'react'
import { Settings, Eye, EyeOff, Type, Moon, Sun, BellRing, BellOff, Clock } from 'lucide-react' // Sun não estava sendo usado, mas mantive
import { Button } from '@/app/components/ui/Button'
import { Modal } from '@/app/components/ui/Modal'
import { usePerfilStore, PerfilUsuario, PreferenciasVisuais as TipoPreferenciasVisuais } from '@/app/stores/perfilStore' // Importar tipos

export function PreferencesButton() {
  const [isOpen, setIsOpen] = useState(false)
  const perfilStore = usePerfilStore()
  
  // Usa o perfil do store. Se for null, a UI do modal pode mostrar um estado de loading
  // ou os botões dentro do modal podem ser desabilitados/não renderizados.
  const perfil: PerfilUsuario | null = perfilStore.perfil

  // Valores default seguros para leitura e exibição na UI, derivados do perfil
  // Estes serão usados para renderizar o estado atual dos botões no modal
  const preferenciasAtuais: TipoPreferenciasVisuais = perfil?.preferenciasVisuais || {
    altoContraste: false,
    reducaoEstimulos: false,
    textoGrande: false,
  };
  const notificacoesAtivasAtuais: boolean = perfil?.notificacoesAtivas ?? true;
  const pausasAtivasAtuais: boolean = perfil?.pausasAtivas ?? true;

  // Efeito para aplicar classes globais com base nas preferências
  useEffect(() => {
    if (!perfil) return; // Não faz nada se o perfil não estiver carregado

    const currentPrefs = perfil.preferenciasVisuais || { altoContraste: false, reducaoEstimulos: false, textoGrande: false };

    if (currentPrefs.altoContraste) document.documentElement.classList.add('alto-contraste');
    else document.documentElement.classList.remove('alto-contraste');

    if (currentPrefs.reducaoEstimulos) document.documentElement.classList.add('reducao-estimulos');
    else document.documentElement.classList.remove('reducao-estimulos');

    if (currentPrefs.textoGrande) document.documentElement.classList.add('texto-grande');
    else document.documentElement.classList.remove('texto-grande');
    
  }, [perfil, perfil?.preferenciasVisuais]); // Re-executa quando perfil ou preferenciasVisuais do perfil do store mudar

  function toggleModal() {
    setIsOpen(!isOpen)
  }
  
  const toggleAltoContraste = () => {
    if (!perfil) return; // Guarda para o caso do perfil não estar carregado

    const basePreferencias = perfil.preferenciasVisuais || {
      altoContraste: false,
      reducaoEstimulos: false,
      textoGrande: false,
    };

    const novasPreferencias: TipoPreferenciasVisuais = {
      ...basePreferencias,
      altoContraste: !basePreferencias.altoContraste,
    };

    perfilStore.updatePerfil({
      preferenciasVisuais: novasPreferencias
    });
  }
  
  const toggleReducaoEstimulos = () => {
    if (!perfil) return;

    const basePreferencias = perfil.preferenciasVisuais || {
      altoContraste: false,
      reducaoEstimulos: false,
      textoGrande: false,
    };
    
    const novasPreferencias: TipoPreferenciasVisuais = {
      ...basePreferencias,
      reducaoEstimulos: !basePreferencias.reducaoEstimulos,
    };

    perfilStore.updatePerfil({
      preferenciasVisuais: novasPreferencias
    });
  }
  
  const toggleTextoGrande = () => {
    if (!perfil) return;
    
    const basePreferencias = perfil.preferenciasVisuais || {
      altoContraste: false,
      reducaoEstimulos: false,
      textoGrande: false,
    };

    const novasPreferencias: TipoPreferenciasVisuais = {
      ...basePreferencias,
      textoGrande: !basePreferencias.textoGrande,
    };
    
    perfilStore.updatePerfil({
      preferenciasVisuais: novasPreferencias
    });
  }
  
  const toggleNotificacoes = () => {
    if (!perfil) return;
    // Para booleanos de nível superior, a atualização parcial simples funciona
    perfilStore.updatePerfil({
      notificacoesAtivas: !notificacoesAtivasAtuais // Usa o valor derivado atual para inverter
    });
  }
  
  const togglePausas = () => {
    if (!perfil) return;
    perfilStore.updatePerfil({
      pausasAtivas: !pausasAtivasAtuais // Usa o valor derivado atual para inverter
    });
  }

  // Se o perfil ainda não carregou, pode-se desabilitar o botão ou não fazer nada
  // if (!perfil) {
  //   return (
  //     <Button variant="outline" size="sm" className="flex items-center gap-2" disabled>
  //       <Settings className="h-4 w-4" />
  //       <span className="hidden sm:inline">Preferências</span>
  //     </Button>
  //   );
  // }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleModal}
        className="flex items-center gap-2"
        aria-label="Preferências de visualização"
        disabled={!perfil} // Desabilita o botão se o perfil não estiver carregado
      >
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">Preferências</span>
      </Button>

      {isOpen && perfil && ( // Só renderiza o Modal se isOpen e perfil existirem
        <Modal
          isOpen={isOpen}
          title="Preferências de Interface"
          onClose={toggleModal}
          className="max-w-md"
        >
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Acessibilidade Visual
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={toggleAltoContraste}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    preferenciasAtuais.altoContraste // Usa valor derivado
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                      : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  }`}
                  aria-pressed={preferenciasAtuais.altoContraste} // Usa valor derivado
                  tabIndex={0}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-md ${
                      preferenciasAtuais.altoContraste // Usa valor derivado
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      <Eye className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Alto Contraste
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Aumenta o contraste entre elementos
                      </p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full ${
                    preferenciasAtuais.altoContraste // Usa valor derivado
                      ? 'bg-blue-500'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    {preferenciasAtuais.altoContraste && ( // Usa valor derivado
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Repetir o padrão de usar 'preferenciasAtuais' para Redução de Estímulos e Texto Grande */}
                <button
                  onClick={toggleReducaoEstimulos}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    preferenciasAtuais.reducaoEstimulos
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                      : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  }`}
                  aria-pressed={preferenciasAtuais.reducaoEstimulos}
                  tabIndex={0}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-md ${
                      preferenciasAtuais.reducaoEstimulos
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      <EyeOff className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Redução de Estímulos
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Remove animações e reduz elementos visuais
                      </p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full ${
                    preferenciasAtuais.reducaoEstimulos
                      ? 'bg-blue-500'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    {preferenciasAtuais.reducaoEstimulos && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>

                <button
                  onClick={toggleTextoGrande}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    preferenciasAtuais.textoGrande
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                      : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  }`}
                  aria-pressed={preferenciasAtuais.textoGrande}
                  tabIndex={0}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-md ${
                      preferenciasAtuais.textoGrande
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      <Type className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Texto Grande
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Aumenta o tamanho do texto para melhor legibilidade
                      </p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full ${
                    preferenciasAtuais.textoGrande
                      ? 'bg-blue-500'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    {preferenciasAtuais.textoGrande && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Notificações e Lembretes
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={toggleNotificacoes}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    notificacoesAtivasAtuais // Usa valor derivado
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                      : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  }`}
                  aria-pressed={notificacoesAtivasAtuais} // Usa valor derivado
                  tabIndex={0}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-md ${
                      notificacoesAtivasAtuais // Usa valor derivado
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {notificacoesAtivasAtuais ? <BellRing className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Notificações
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {notificacoesAtivasAtuais ? 'Notificações ativadas' : 'Notificações desativadas'}
                      </p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full ${
                    notificacoesAtivasAtuais // Usa valor derivado
                      ? 'bg-blue-500'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    {notificacoesAtivasAtuais && ( // Usa valor derivado
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>

                <button
                  onClick={togglePausas}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    pausasAtivasAtuais // Usa valor derivado
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                      : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  }`}
                  aria-pressed={pausasAtivasAtuais} // Usa valor derivado
                  tabIndex={0}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-md ${
                      pausasAtivasAtuais // Usa valor derivado
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Lembretes de Pausas
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {pausasAtivasAtuais ? 'Lembretes ativados' : 'Lembretes desativados'}
                      </p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full ${
                    pausasAtivasAtuais // Usa valor derivado
                      ? 'bg-blue-500'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    {pausasAtivasAtuais && ( // Usa valor derivado
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-700"> {/* Adicionado mt-6 para mais espaço */}
            <Button 
              onClick={toggleModal}
              className="w-full"
              variant="primary" // Sugestão: Usar variant="primary" para o botão principal do modal
            >
              Salvar e Fechar
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}