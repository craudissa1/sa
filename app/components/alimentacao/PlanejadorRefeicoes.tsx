"use client";

import { useState, useEffect } from "react";
import { Clock, Plus, Save, Trash2, Edit3, XCircle, Loader2 } from "lucide-react";
import { useAlimentacaoStore, RefeicaoPlanejada } from "@/app/stores/alimentacaoStore";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

export function PlanejadorRefeicoes() {
  const { user } = useAuth();
  const {
    refeicoesPlanejadas,
    adicionarRefeicaoPlanejada,
    atualizarRefeicaoPlanejada,
    removerRefeicaoPlanejada,
    fetchAlimentacaoData,
  } = useAlimentacaoStore();

  const [novaRefeicao, setNovaRefeicao] = useState<{ horario: string; descricao: string }>({ horario: "", descricao: "" });
  const [editando, setEditando] = useState<RefeicaoPlanejada | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const hoje = new Date().toISOString().split("T")[0];
      fetchAlimentacaoData(user.id, hoje); // Garante que os dados são carregados
    }
  }, [user, fetchAlimentacaoData]);

  const handleAdicionarRefeicao = async () => {
    if (!novaRefeicao.horario || !novaRefeicao.descricao || !user) return;
    setLoading(true);
    try {
      await adicionarRefeicaoPlanejada({ horario: novaRefeicao.horario, descricao: novaRefeicao.descricao });
      setNovaRefeicao({ horario: "", descricao: "" });
    } catch (error) {
      console.error("Erro ao adicionar refeição planejada:", error);
      // Adicionar feedback para o usuário
    }
    setLoading(false);
  };

  const iniciarEdicao = (refeicao: RefeicaoPlanejada) => {
    setEditando(refeicao);
    setNovaRefeicao({ horario: refeicao.horario, descricao: refeicao.descricao });
  };

  const salvarEdicao = async () => {
    if (!editando || !novaRefeicao.horario || !novaRefeicao.descricao || !user) return;
    setLoading(true);
    try {
      await atualizarRefeicaoPlanejada(editando.id!, { horario: novaRefeicao.horario, descricao: novaRefeicao.descricao });
      setEditando(null);
      setNovaRefeicao({ horario: "", descricao: "" });
    } catch (error) {
      console.error("Erro ao atualizar refeição planejada:", error);
    }
    setLoading(false);
  };

  const handleRemoverRefeicao = async (id: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await removerRefeicaoPlanejada(id);
    } catch (error) {
      console.error("Erro ao remover refeição planejada:", error);
    }
    setLoading(false);
  };

  const cancelarEdicao = () => {
    setEditando(null);
    setNovaRefeicao({ horario: "", descricao: "" });
  };

  if (!user) {
    return <p className="text-muted-foreground">Faça login para ver e gerenciar suas refeições planejadas.</p>;
  }

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card text-card-foreground">
      {loading && <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"><Loader2 className="animate-spin text-white" size={48}/></div>}
      <h3 className="text-xl font-semibold mb-4">Planejador de Refeições</h3>
      
      <div className="space-y-3">
        {refeicoesPlanejadas.length === 0 && !loading && (
          <p className="text-muted-foreground">Nenhuma refeição planejada ainda. Adicione uma abaixo!</p>
        )}
        {refeicoesPlanejadas.map((refeicao) => (
          <div
            key={refeicao.id}
            className="flex items-center p-3 bg-background rounded-lg border shadow-sm"
          >
            <Clock className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
            {editando?.id === refeicao.id ? (
              <form onSubmit={(e) => { e.preventDefault(); salvarEdicao(); }} className="flex-grow flex items-center gap-2">
                <Input
                  type="time"
                  value={novaRefeicao.horario}
                  onChange={(e) => setNovaRefeicao({ ...novaRefeicao, horario: e.target.value })}
                  className="w-28"
                  required
                />
                <Input
                  type="text"
                  value={novaRefeicao.descricao}
                  onChange={(e) => setNovaRefeicao({ ...novaRefeicao, descricao: e.target.value })}
                  className="flex-grow"
                  placeholder="Descrição da refeição"
                  required
                />
                <Button type="submit" size="icon" variant="ghost" className="text-green-600 hover:text-green-700" aria-label="Salvar edição">
                  <Save className="h-5 w-5" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={cancelarEdicao} className="text-red-600 hover:text-red-700" aria-label="Cancelar edição">
                  <XCircle className="h-5 w-5" />
                </Button>
              </form>
            ) : (
              <>
                <div className="flex-grow">
                  <span className="font-medium text-card-foreground w-16 block sm:inline">
                    {refeicao.horario}
                  </span>
                  <span className="text-card-foreground ml-0 sm:ml-2">
                    {refeicao.descricao}
                  </span>
                </div>
                <Button size="icon" variant="ghost" onClick={() => iniciarEdicao(refeicao)} className="text-blue-600 hover:text-blue-700" aria-label="Editar refeição">
                  <Edit3 className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleRemoverRefeicao(refeicao.id!)} className="text-red-600 hover:text-red-700" aria-label="Remover refeição">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <h4 className="text-lg font-medium text-card-foreground mb-2">
          Adicionar Nova Refeição
        </h4>
        <form onSubmit={(e) => { e.preventDefault(); handleAdicionarRefeicao();}} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="time"
            value={novaRefeicao.horario}
            onChange={(e) => setNovaRefeicao({ ...novaRefeicao, horario: e.target.value })}
            className="w-full sm:w-32"
            required
          />
          <Input
            type="text"
            value={novaRefeicao.descricao}
            onChange={(e) => setNovaRefeicao({ ...novaRefeicao, descricao: e.target.value })}
            className="flex-grow"
            placeholder="Ex: Café da manhã, Lanche da tarde"
            required
          />
          <Button
            type="submit"
            disabled={!novaRefeicao.horario || !novaRefeicao.descricao || loading}
            className="w-full sm:w-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar
          </Button>
        </form>
      </div>
    </div>
  );
}

