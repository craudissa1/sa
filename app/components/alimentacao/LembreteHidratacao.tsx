"use client";

import { Droplet, PlusCircle, MinusCircle, Loader2 } from "lucide-react";
import { useAlimentacaoStore } from "@/app/stores/alimentacaoStore";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/Button"; // Importação adicionada

export function LembreteHidratacao() {
  const { user } = useAuth();
  const {
    hidratacaoConfig,
    registroHidratacaoHoje,
    ajustarMetaDiariaCopos,
    registrarCopoBebido,
    removerCopoBebido,
    fetchAlimentacaoData,
  } = useAlimentacaoStore();

  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (user && (!hidratacaoConfig || !registroHidratacaoHoje)) {
      const hoje = new Date().toISOString().split("T")[0];
      fetchAlimentacaoData(user.id, hoje);
    }
  }, [user, hidratacaoConfig, registroHidratacaoHoje, fetchAlimentacaoData]);

  const coposBebidos = registroHidratacaoHoje?.copos_bebidos ?? 0;
  const metaDiaria = hidratacaoConfig?.meta_diaria_copos ?? 8;

  const progresso = metaDiaria > 0 ? Math.min((coposBebidos / metaDiaria) * 100, 100) : 0;

  const handleAjustarMeta = async (ajuste: number) => {
    if (!user || !hidratacaoConfig) return;
    const novaMeta = hidratacaoConfig.meta_diaria_copos + ajuste;
    if (novaMeta >= 1 && novaMeta <= 20) {
      setLoadingAction(true);
      try {
        await ajustarMetaDiariaCopos(novaMeta);
      } catch (error) {
        console.error("Erro ao ajustar meta de hidratação:", error);
      }
      setLoadingAction(false);
    }
  };

  const handleRegistrarCopo = async () => {
    if (!user) return;
    setLoadingAction(true);
    try {
      await registrarCopoBebido();
    } catch (error) {
      console.error("Erro ao registrar copo:", error);
    }
    setLoadingAction(false);
  };

  const handleRemoverCopo = async () => {
    if (!user || coposBebidos <= 0) return;
    setLoadingAction(true);
    try {
      await removerCopoBebido();
    } catch (error) {
      console.error("Erro ao remover copo:", error);
    }
    setLoadingAction(false);
  };

  if (!user || !hidratacaoConfig || !registroHidratacaoHoje) {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-card text-card-foreground">
        <div className="flex items-center justify-center text-muted-foreground">
          <Loader2 className="animate-spin mr-2" />
          Carregando dados de hidratação...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card text-card-foreground">
      {loadingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <Loader2 className="animate-spin text-white" size={48} />
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-medium mb-1">
            Acompanhamento de Hidratação
          </h3>
          <p className="text-sm text-muted-foreground">
            Registre os copos de água que você bebe durante o dia.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAjustarMeta(-1)}
            aria-label="Diminuir meta diária"
            disabled={metaDiaria <= 1 || loadingAction}
          >
            <MinusCircle className="h-6 w-6" />
          </Button>

          <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Meta: {metaDiaria} copos
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAjustarMeta(1)}
            aria-label="Aumentar meta diária"
            disabled={metaDiaria >= 20 || loadingAction}
          >
            <PlusCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${progresso}%` }}
          role="progressbar"
          aria-valuenow={coposBebidos}
          aria-valuemin={0}
          aria-valuemax={metaDiaria}
        ></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {coposBebidos} de {metaDiaria} copos
        </div>
        <div className="text-blue-600 dark:text-blue-400">
          {progresso.toFixed(0)}%
        </div>
      </div>

      <div className="flex flex-wrap gap-2 my-4 justify-center">
        {Array.from({ length: metaDiaria }).map((_, index) => (
          <div
            key={index}
            className={`w-12 h-16 flex items-center justify-center rounded-b-lg border border-t-0 ${
              index < coposBebidos
                ? "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700"
                : "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
            }`}
            aria-label={index < coposBebidos ? "Copo bebido" : "Copo não bebido"}
          >
            <Droplet
              className={`h-8 w-8 ${
                index < coposBebidos
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={handleRegistrarCopo}
          disabled={coposBebidos >= metaDiaria || loadingAction}
          aria-label="Registrar um copo de água"
        >
          Registrar Copo
        </Button>

        <Button
          variant="outline"
          onClick={handleRemoverCopo}
          disabled={coposBebidos <= 0 || loadingAction}
          aria-label="Remover um copo de água"
        >
          Remover Copo
        </Button>
      </div>

      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300">
        <h4 className="font-medium mb-1">Dicas de Hidratação:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Mantenha uma garrafa de água sempre visível.</li>
          <li>Beba um copo ao acordar e antes de cada refeição.</li>
          <li>Configure lembretes no celular a cada 1-2 horas.</li>
        </ul>
      </div>
    </div>
  );
}

