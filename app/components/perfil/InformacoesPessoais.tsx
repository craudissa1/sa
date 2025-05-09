'use client'

import { useState, useEffect } from 'react' // Adicionado useEffect
import { usePerfilStore } from '../../stores/perfilStore' // Verifique se este caminho está correto
import { Save, User, Edit } from 'lucide-react'

export function InformacoesPessoais() {
  const perfilStore = usePerfilStore()
  // ATUALIZAÇÃO: Usar 'nome_completo' para ler do store
  const nomeAtualDoStore = perfilStore.perfil?.nome_completo || ''
  
  // Estado local para o campo de edição
  const [novoNome, setNovoNome] = useState(nomeAtualDoStore)
  const [editando, setEditando] = useState(false)

  // ATUALIZAÇÃO: Sincronizar 'novoNome' se o valor no store mudar externamente
  useEffect(() => {
    setNovoNome(perfilStore.perfil?.nome_completo || '')
  }, [perfilStore.perfil?.nome_completo])
  
  const iniciarEdicao = () => {
    // Ao iniciar a edição, carrega o valor mais recente do store
    setNovoNome(perfilStore.perfil?.nome_completo || '')
    setEditando(true)
  }
  
  const salvarAlteracoes = () => {
    if (novoNome.trim()) {
      // ATUALIZAÇÃO: Enviar 'nome_completo' no objeto de atualização
      perfilStore.updatePerfil({ nome_completo: novoNome.trim() })
    }
    setEditando(false)
  }
  
  // Caso o perfil ainda não tenha sido carregado do Supabase
  if (!perfilStore.perfil) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-perfil-primary" />
                Informações Básicas
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Carregando informações...</p>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <User className="h-5 w-5 mr-2 text-perfil-primary" />
        Informações Básicas
      </h2>
      
      <div className="space-y-4">
        {/* Nome do usuário */}
        <div>
          <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome Completo
          </label>
          
          {editando ? (
            <div className="flex items-center">
              <input
                type="text"
                id="nomeCompleto" // Atualizado id
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-perfil-primary focus:border-perfil-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Seu nome completo"
                maxLength={70} // Ajuste o maxLength conforme necessário para nome completo
                required
              />
              
              <button
                onClick={salvarAlteracoes}
                className="ml-2 p-2 text-white bg-perfil-primary rounded-md hover:bg-perfil-secondary focus:outline-none focus:ring-2 focus:ring-perfil-primary"
                aria-label="Salvar nome"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {/* ATUALIZAÇÃO: Exibir 'nome_completo' do store */}
              <p className="text-gray-800 dark:text-white text-lg">
                {perfilStore.perfil?.nome_completo || 'Não informado'}
              </p>
              
              <button
                onClick={iniciarEdicao}
                className="p-2 text-gray-500 hover:text-perfil-primary focus:outline-none focus:ring-2 focus:ring-perfil-primary rounded-md"
                aria-label="Editar nome"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Seu nome é usado para personalizar a experiência no Painel ND. 
            {/* Pequena alteração na mensagem, pois agora os dados são sincronizados com Supabase
            As informações de perfil são sincronizadas com sua conta.
            */}
            As informações de perfil são sincronizadas com sua conta.
          </p>
        </div>
      </div>
    </div>
  )
}