"use client";

import { useEffect, useState } from "react";
import { useAppStore, BlocoTempo } from "@/app/store"; // Ajustado para useAppStore
import { usePerfilStore, PerfilUsuario, PreferenciasVisuais as TipoPreferenciasVisuais } from "@/app/stores/perfilStore"; // Adicionado PerfilUsuario e TipoPreferenciasVisuais
import { useAuth } from "@/app/context/AuthContext"; // Para obter o usuário atual
import { Prioridade, usePrioridadesStore } from "@/app/stores/prioridadesStore"; // Importando de prioridadesStore

export type DashboardData = {
  blocosDia: BlocoTempo[];
  prioridadesDia: Prioridade[];
  proximosCompromissos: BlocoTempo[];
  prioridadesPendentes: number;
  prioridadesConcluidas: number;
  metasPausas: number;
  mostrarPausas: boolean;
  metasPrioridades: number;
  nomeUsuario: string; // Mantido como string, o fallback garante isso
  preferenciasVisuais: TipoPreferenciasVisuais; // Usar o tipo importado
  isLoading: boolean;
};

const defaultDashboardData: DashboardData = {
  blocosDia: [],
  prioridadesDia: [],
  proximosCompromissos: [],
  prioridadesPendentes: 0,
  prioridadesConcluidas: 0,
  metasPausas: 4,
  mostrarPausas: true,
  metasPrioridades: 3,
  nomeUsuario: "Usuário",
  preferenciasVisuais: {
    altoContraste: false,
    reducaoEstimulos: false,
    textoGrande: false,
  },
  isLoading: true,
};

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData>(defaultDashboardData);
  const { user } = useAuth();

  const { blocosTempo } = useAppStore();
  const { perfil }: { perfil: PerfilUsuario | null } = usePerfilStore(); // Tipagem explícita para perfil
  const { prioridades } = usePrioridadesStore();

  useEffect(() => {
    if (!user) {
      setData((prev) => ({ ...prev, isLoading: false, nomeUsuario: "Usuário" })); // Garante nomeUsuario no logout
      return;
    }

    setData((prev) => ({ ...prev, isLoading: true })); // Define isLoading como true no início do processamento

    const hoje = new Date().toISOString().split('T')[0];

    const blocosDia = blocosTempo.filter((bloco) => bloco.data === hoje);

    const prioridadesDia = prioridades.filter((p: Prioridade) => p.data === hoje);
    
    const prioridadesPendentes = prioridadesDia.filter((p: Prioridade) => !p.concluida).length;
    const prioridadesConcluidas = prioridadesDia.filter((p: Prioridade) => p.concluida).length;

    const agora = new Date();
    const horaAtual = agora.getHours();
    const minutoAtual = agora.getMinutes();
    
    const proximosCompromissos = blocosDia
      .filter((bloco) => {
        const [hora, minuto] = bloco.hora.split(':').map(Number);
        return hora > horaAtual || (hora === horaAtual && minuto > minutoAtual);
      })
      .sort((a, b) => {
        const [horaA, minutoA] = a.hora.split(':').map(Number);
        const [horaB, minutoB] = b.hora.split(':').map(Number);
        return horaA - horaB || minutoA - minutoB;
      })
      .slice(0, 3);

    // ATUALIZAÇÃO: Usar 'nome_completo' em vez de 'nome'
    const nomeUsuario = perfil?.nome_completo || "Usuário";
    
    // Valores default seguros para metas e preferências, mesmo que perfil ou suas subpropriedades sejam null
    const metasPausas = perfil?.metasDiarias?.pausasProgramadas ?? defaultDashboardData.metasPausas;
    const metasPrioridades = perfil?.metasDiarias?.tarefasPrioritarias ?? defaultDashboardData.metasPrioridades;
    const mostrarPausas = perfil?.pausasAtivas ?? defaultDashboardData.mostrarPausas;
    
    const preferenciasVisuais = perfil?.preferenciasVisuais || defaultDashboardData.preferenciasVisuais;

    setData({
      blocosDia,
      prioridadesDia,
      proximosCompromissos,
      prioridadesPendentes,
      prioridadesConcluidas,
      metasPausas,
      mostrarPausas,
      metasPrioridades,
      nomeUsuario,
      preferenciasVisuais,
      isLoading: false,
    });

  }, [user, blocosTempo, prioridades, perfil]);

  return { ...data };
};