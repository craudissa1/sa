"use client";

import { useEffect, useState } from "react";
import { useAppStore, BlocoTempo } from "@/app/store"; // Ajustado para useAppStore
import { usePerfilStore } from "@/app/stores/perfilStore"; // Mantido, pois é uma store de perfil válida
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
  nomeUsuario: string;
  preferenciasVisuais: {
    altoContraste: boolean;
    reducaoEstimulos: boolean;
    textoGrande: boolean;
  };
  isLoading: boolean;
};

const defaultDashboardData: DashboardData = {
  blocosDia: [],
  prioridadesDia: [],
  proximosCompromissos: [],
  prioridadesPendentes: 0,
  prioridadesConcluidas: 0,
  metasPausas: 4, // Valor padrão
  mostrarPausas: true,
  metasPrioridades: 3, // Valor padrão
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
  const { user } = useAuth(); // Usando o contexto de autenticação

  // Hooks para accese às stores
  const { blocosTempo } = useAppStore();
  const { perfil } = usePerfilStore();
  const { prioridades } = usePrioridadesStore();

  useEffect(() => {
    // Executar apenas se o usuário estiver autenticado
    if (!user) {
      setData((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    // Dados do dia atual
    const hoje = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    // Filtrar blocos de tempo para o dia de hoje
    const blocosDia = blocosTempo.filter((bloco) => bloco.data === hoje);

    // Prioridades do dia
    const prioridadesDia = prioridades.filter((p: Prioridade) => p.data === hoje);
    
    // Estatísticas de prioridades
    const prioridadesPendentes = prioridadesDia.filter((p: Prioridade) => !p.concluida).length;
    const prioridadesConcluidas = prioridadesDia.filter((p: Prioridade) => p.concluida).length;

    // Próximos compromissos (ordenados por hora)
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
      .slice(0, 3); // Apenas os próximos 3

    // Dados de perfil do usuário (se disponível)
    const metasPausas = perfil?.metasDiarias?.pausasProgramadas || 4;
    const metasPrioridades = perfil?.metasDiarias?.tarefasPrioritarias || 3;
    const nomeUsuario = perfil?.nome || "Usuário";
    const mostrarPausas = perfil?.pausasAtivas !== undefined ? perfil.pausasAtivas : true;
    
    // Preferências visuais
    const preferenciasVisuais = perfil?.preferenciasVisuais || {
      altoContraste: false,
      reducaoEstimulos: false,
      textoGrande: false,
    };

    // Atualizar o estado
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
