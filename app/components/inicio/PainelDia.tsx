
'use client'

import { useState, useEffect } from 'react';
import { Edit2, Check, X, Trash2, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { useAppStore, BlocoTempo } from '@/app/store'; // Importar de useAppStore
import { useAuth } from '@/app/context/AuthContext'; // Para obter o usuário atual

export function PainelDia() {
  const { user } = useAuth();
  const { 
    blocosTempo, 
    adicionarBlocoTempo, 
    atualizarBlocoTempo, 
    removerBlocoTempo, 
    fetchInitialData 
  } = useAppStore();
  
  const [blocoEditando, setBlocoEditando] = useState<string | null>(null);
  const [atividadeEditando, setAtividadeEditando] = useState('');
  const [categoriaEditando, setCategoriaEditando] = useState<BlocoTempo['categoria']>('nenhuma');
  const [novoBloco, setNovoBloco] = useState(false);
  const [novaHora, setNovaHora] = useState('');
  const [novaAtividade, setNovaAtividade] = useState('');
  const [dataAtual, setDataAtual] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [loading, setLoading] = useState(false);

  // Filtra blocos de tempo para a data atual
  const blocosDoDia = blocosTempo.filter(bloco => bloco.data === dataAtual);

  const getBgColor = (categoria: BlocoTempo['categoria']) => {
    switch (categoria) {
      case 'inicio': return 'bg-opacity-40 bg-inicio-light border-inicio-primary';
      case 'alimentacao': return 'bg-opacity-40 bg-alimentacao-light border-alimentacao-primary';
      case 'estudos': return 'bg-opacity-40 bg-estudos-light border-estudos-primary';
      case 'saude': return 'bg-opacity-40 bg-saude-light border-saude-primary';
      case 'lazer': return 'bg-opacity-40 bg-lazer-light border-lazer-primary';
      default: return 'bg-gray-100 bg-opacity-40 border-gray-300 dark:bg-gray-700 dark:border-gray-600';
    }
  };

  const iniciarEdicao = (bloco: BlocoTempo) => {
    setBlocoEditando(bloco.id!);
    setAtividadeEditando(bloco.atividade);
    setCategoriaEditando(bloco.categoria);
  };

  const salvarEdicao = async () => {
    if (blocoEditando && user) {
      setLoading(true);
      try {
        await atualizarBlocoTempo(blocoEditando, { atividade: atividadeEditando, categoria: categoriaEditando });
      } catch (error) {
        console.error("Erro ao salvar edição do bloco de tempo:", error);
        // Adicionar feedback para o usuário aqui, se necessário
      }
      cancelarEdicao();
      setLoading(false);
    }
  };

  const cancelarEdicao = () => {
    setBlocoEditando(null);
    setAtividadeEditando('');
    setCategoriaEditando('nenhuma');
  };

  const mostrarNovoBloco = () => {
    setNovoBloco(true);
    setNovaHora('');
    setNovaAtividade('');
  };

  const adicionarNovoBlocoHandler = async () => {
    if (novaHora && novaAtividade && user) {
      setLoading(true);
      try {
        await adicionarBlocoTempo({
          hora: novaHora,
          atividade: novaAtividade,
          categoria: 'nenhuma', // Categoria padrão para novos blocos
          data: dataAtual,
        });
      } catch (error) {
        console.error("Erro ao adicionar novo bloco de tempo:", error);
        // Adicionar feedback para o usuário aqui, se necessário
      }
      setNovoBloco(false);
      setNovaHora('');
      setNovaAtividade('');
      setLoading(false);
    }
  };
  
  const removerBlocoHandler = async (id: string) => {
    if (user && id) {
        setLoading(true);
        try {
            await removerBlocoTempo(id);
        } catch (error) {
            console.error("Erro ao remover bloco de tempo:", error);
        }
        setLoading(false);
    }
  }

  const cancelarNovoBloco = () => {
    setNovoBloco(false);
    setNovaHora('');
    setNovaAtividade('');
  };

  const blocosOrdenados = [...blocosDoDia].sort((a, b) => {
    const horaA = a.hora.split(':').map(Number);
    const horaB = b.hora.split(':').map(Number);
    if (horaA[0] !== horaB[0]) return horaA[0] - horaB[0];
    return horaA[1] - horaB[1];
  });

  // useEffect para carregar dados iniciais se o usuário estiver logado
  // O StoreInitializer já deve estar fazendo isso, mas podemos garantir aqui para este componente específico
  // ou se precisarmos de lógica adicional ao carregar os blocos de tempo.
  // Por ora, vamos assumir que StoreInitializer cuida do fetch inicial.

  return (
    <div className="space-y-3">
      {loading && <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'><Loader2 className='animate-spin text-white' size={48}/></div>}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Painel do Dia ({new Date(dataAtual + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })})</h3>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={mostrarNovoBloco}
          className="flex items-center gap-1"
          aria-label="Adicionar novo horário"
        >
          <Plus className="h-4 w-4" /> Adicionar Horário
        </Button>
      </div>

      {novoBloco && (
        <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <Input
                type="time"
                value={novaHora}
                onChange={(e) => setNovaHora(e.target.value)}
                className="w-24"
                placeholder="Hora"
                aria-label="Nova hora"
              />
              <Input
                value={novaAtividade}
                onChange={(e) => setNovaAtividade(e.target.value)}
                className="flex-1"
                placeholder="O que você planeja fazer neste horário?"
                aria-label="Nova atividade"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={cancelarNovoBloco}>Cancelar</Button>
              <Button size="sm" onClick={adicionarNovoBlocoHandler} disabled={!novaHora || !novaAtividade || loading}>Adicionar</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2">
        {blocosOrdenados.length === 0 && !novoBloco && (
            <p className='text-sm text-muted-foreground text-center py-4'>Nenhum bloco de tempo para hoje ainda. Adicione um!</p>
        )}
        {blocosOrdenados.map((bloco) => (
          <div
            key={bloco.id}
            className={`p-3 rounded-lg border-l-4 ${getBgColor(bloco.categoria)} transition-all duration-200 backdrop-blur-sm group`}
          >
            <div className="flex items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300 w-16">
                {bloco.hora}
              </span>
              
              {blocoEditando === bloco.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={atividadeEditando}
                    onChange={(e) => setAtividadeEditando(e.target.value)}
                    className="flex-1"
                    placeholder="O que você planeja fazer neste horário?"
                    aria-label="Editar atividade"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={salvarEdicao} aria-label="Salvar edição" disabled={loading}><Check className="h-4 w-4 text-green-500" /></Button>
                    <Button size="sm" variant="ghost" onClick={cancelarEdicao} aria-label="Cancelar edição" disabled={loading}><X className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-gray-900 dark:text-white">
                    {bloco.atividade}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                    <Button size="sm" variant="ghost" onClick={() => iniciarEdicao(bloco)} aria-label="Editar este horário"><Edit2 className="h-4 w-4 text-gray-500" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => removerBlocoHandler(bloco.id!)} aria-label="Remover este horário" disabled={loading}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </>
              )}
            </div>
            
            {blocoEditando === bloco.id && (
              <div className="mt-2 flex flex-wrap gap-1 items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                  Categoria:
                </span>
                <div className="flex flex-wrap gap-1">
                  {(['alimentacao', 'estudos', 'saude', 'lazer', 'nenhuma'] as BlocoTempo['categoria'][]).map(cat => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={categoriaEditando === cat ? 'default' : 'outline'}
                      className={`py-0 px-2 h-6 text-xs ${getBgColor(cat).replace('bg-opacity-40', '')}`}
                      onClick={() => setCategoriaEditando(cat)}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

