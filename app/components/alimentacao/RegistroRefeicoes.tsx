"use client";

import { useState, useEffect } from "react";
import { Camera, Plus, X, Loader2 } from "lucide-react";
import { useAlimentacaoStore, RegistroRefeicao } from "@/app/stores/alimentacaoStore";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import Image from "next/image";

// Ícones simples para tipos de refeição
const tiposRefeicao = [
  { id: "cafe", emoji: "☕", nome: "Café" },
  { id: "fruta", emoji: "🍎", nome: "Fruta" },
  { id: "salada", emoji: "🥗", nome: "Salada" },
  { id: "proteina", emoji: "🍗", nome: "Proteína" },
  { id: "carboidrato", emoji: "🍚", nome: "Carboidrato" },
  { id: "sobremesa", emoji: "🍰", nome: "Sobremesa" },
  { id: "agua", emoji: "💧", nome: "Água" },
];

interface NovoRegistroState {
  horario: string;
  descricao: string;
  tipoIcone: string | null;
  foto_url: string | null; // Alterado de foto para foto_url
}

export function RegistroRefeicoes() {
  const { user } = useAuth();
  const {
    registrosRefeicao, // Corrigido
    adicionarRegistroRefeicao, // Corrigido
    removerRegistroRefeicao, // Corrigido
    fetchAlimentacaoData,
  } = useAlimentacaoStore();

  const [novoRegistro, setNovoRegistro] = useState<NovoRegistroState>({
    horario: "",
    descricao: "",
    tipoIcone: null,
    foto_url: null,
  });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const hoje = new Date().toISOString().split("T")[0];
      fetchAlimentacaoData(user.id, hoje); // Garante que os dados são carregados
    }
  }, [user, fetchAlimentacaoData]);

  const handleAdicionarRegistro = async () => {
    if (!novoRegistro.horario || !novoRegistro.descricao || !user) return;
    setLoading(true);
    try {
      // A data é definida como a data atual no formato YYYY-MM-DD
      const dataAtual = new Date().toISOString().split("T")[0];
      await adicionarRegistroRefeicao({
        data: dataAtual,
        horario: novoRegistro.horario,
        descricao: novoRegistro.descricao,
        tipoIcone: novoRegistro.tipoIcone,
        foto_url: novoRegistro.foto_url,
      });
      setNovoRegistro({ horario: "", descricao: "", tipoIcone: null, foto_url: null });
      setMostrarForm(false);
    } catch (error) {
      console.error("Erro ao adicionar registro de refeição:", error);
      // Adicionar feedback ao usuário
    }
    setLoading(false);
  };

  const selecionarTipoIcone = (tipo: string) => {
    setNovoRegistro({
      ...novoRegistro,
      tipoIcone: novoRegistro.tipoIcone === tipo ? null : tipo,
    });
  };

  const simularUploadFoto = () => {
    const fotoSimulada =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTQ5NDk0Ij5Gb3RvIGRhIHJlZmVpw6fDo288L3RleHQ+PC9zdmc+";
    setNovoRegistro({
      ...novoRegistro,
      foto_url: fotoSimulada, // Alterado para foto_url
    });
  };
  
  const handleRemoverRegistro = async (id: string) => {
    if(!user) return;
    setLoading(true);
    try {
        await removerRegistroRefeicao(id);
    } catch (error) {
        console.error("Erro ao remover registro de refeição:", error);
    }
    setLoading(false);
  }

  if (!user) {
    return <p className="text-muted-foreground">Faça login para ver e registrar suas refeições.</p>;
  }

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card text-card-foreground">
      {loading && <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"><Loader2 className="animate-spin text-white" size={48}/></div>}
      <h3 className="text-xl font-semibold mb-4">Registro de Refeições</h3>
      <div className="space-y-3">
        {registrosRefeicao.length === 0 && !loading && (
            <p className="text-muted-foreground">Nenhuma refeição registrada ainda. Adicione uma abaixo!</p>
        )}
        {registrosRefeicao.map((registro) => (
          <div
            key={registro.id}
            className="p-3 bg-background rounded-lg border shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <span className="font-medium text-muted-foreground mr-2">
                    {new Date(registro.data + "T" + registro.horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-card-foreground font-medium">
                    {registro.descricao}
                  </span>
                </div>
                {registro.tipoIcone && (
                  <div className="mb-2">
                    <span
                      className="text-2xl"
                      aria-label={`Tipo: ${tiposRefeicao.find((t) => t.id === registro.tipoIcone)?.nome || ""}`}
                    >
                      {tiposRefeicao.find((t) => t.id === registro.tipoIcone)?.emoji}
                    </span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoverRegistro(registro.id!)}
                className="text-red-600 hover:text-red-700"
                aria-label="Remover registro"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {registro.foto_url && (
              <div className="mt-2 relative w-full h-40">
                <Image
                  src={registro.foto_url}
                  alt="Foto da refeição"
                  fill
                  className="object-cover rounded-md border"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {mostrarForm ? (
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-medium text-card-foreground">
              Novo Registro
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMostrarForm(false)}
              aria-label="Fechar formulário"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleAdicionarRegistro(); }} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="time"
                value={novoRegistro.horario}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, horario: e.target.value })}
                className="w-full sm:w-auto"
                aria-label="Horário da refeição"
                required
              />
              <Input
                type="text"
                value={novoRegistro.descricao}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, descricao: e.target.value })}
                className="flex-grow"
                placeholder="Descrição da refeição"
                aria-label="Descrição da refeição"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Tipo (opcional)
              </label>
              <div className="flex flex-wrap gap-2">
                {tiposRefeicao.map((tipo) => (
                  <button
                    key={tipo.id}
                    type="button"
                    onClick={() => selecionarTipoIcone(tipo.id)}
                    className={`w-10 h-10 flex items-center justify-center text-xl rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                      novoRegistro.tipoIcone === tipo.id
                        ? "border-primary bg-primary/20"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                    aria-label={tipo.nome}
                    aria-pressed={novoRegistro.tipoIcone === tipo.id}
                  >
                    {tipo.emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={simularUploadFoto}
                aria-label="Adicionar foto da refeição"
              >
                <Camera className="h-5 w-5 mr-2" />
                Adicionar Foto (Simulado)
              </Button>
              {novoRegistro.foto_url && (
                <div className="mt-2 relative w-full max-w-xs h-32">
                  <Image
                    src={novoRegistro.foto_url}
                    alt="Prévia da foto"
                    fill
                    className="object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => setNovoRegistro({ ...novoRegistro, foto_url: null })}
                    className="absolute top-1 right-1 h-7 w-7"
                    aria-label="Remover foto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!novoRegistro.horario || !novoRegistro.descricao || loading}
                aria-label="Salvar registro"
              >
                Salvar Registro
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          onClick={() => setMostrarForm(true)}
          variant="outline"
          className="w-full py-3"
          aria-label="Adicionar novo registro de refeição"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Registro de Refeição
        </Button>
      )}
    </div>
  );
}

