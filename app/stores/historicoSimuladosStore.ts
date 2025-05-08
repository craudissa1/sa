import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // Ajuste o caminho se necessário
import { User } from "@supabase/supabase-js";

// --- Tipos (adaptados para Supabase) ---
export interface TentativaSimulado {
  id?: string; // Gerenciado pelo Supabase
  simulado_meta_id?: string; // FK para simulated_exams_meta
  user_id?: string;
  timestamp: string; // ISO string
  acertos: number;
  percentual: number;
  created_at?: string;
}

export interface SimuladoMeta {
  id?: string; // Gerenciado pelo Supabase
  user_id?: string;
  identificador: string; // Ex: "Simulado X|40", único por usuário
  titulo: string;
  totalQuestoes: number;
  created_at?: string;
  updated_at?: string;
}

// Estrutura do estado local para facilitar a UI, se necessário manter similar
export interface SimuladoHistoricoEntry {
  idMeta?: string; // ID da tabela simulated_exams_meta
  titulo: string;
  totalQuestoes: number;
  tentativas: TentativaSimulado[];
}

// O estado principal será um objeto onde a chave é o identificador único (Ex: "Simulado X|40")
type HistoricoSimuladosStateData = Record<string, SimuladoHistoricoEntry>;

interface HistoricoSimuladosState {
  historico: HistoricoSimuladosStateData;
  currentUser: User | null;

  setCurrentUser: (user: User | null) => void;
  fetchHistoricoSimulados: (userId: string) => Promise<void>;
  adicionarTentativa: (
    identificador: string, // "Simulado X|40"
    titulo: string,
    totalQuestoes: number,
    acertos: number,
    percentual: number
  ) => Promise<void>;
}

const TABELA_SIMULADOS_META = "simulated_exams_meta";
const TABELA_SIMULADOS_TENTATIVAS = "simulated_exam_attempts";

export const useHistoricoSimuladosStore = create<HistoricoSimuladosState>()((set, get) => ({
  historico: {},
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchHistoricoSimulados: async (userId) => {
    if (!userId) return;
    try {
      const { data: metasData, error: metasError } = await supabase
        .from(TABELA_SIMULADOS_META)
        .select("*")
        .eq("user_id", userId);

      if (metasError) throw metasError;

      const { data: tentativasData, error: tentativasError } = await supabase
        .from(TABELA_SIMULADOS_TENTATIVAS)
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: true });

      if (tentativasError) throw tentativasError;

      const novoHistorico: HistoricoSimuladosStateData = {};
      if (metasData) {
        for (const meta of metasData) {
          novoHistorico[meta.identificador] = {
            idMeta: meta.id,
            titulo: meta.titulo,
            totalQuestoes: meta.totalQuestoes,
            tentativas: (tentativasData || []).filter(t => t.simulado_meta_id === meta.id)
          };
        }
      }
      set({ historico: novoHistorico });

    } catch (error) {
      console.error("Error fetching historico de simulados:", error);
      set({ historico: {} });
    }
  },

  adicionarTentativa: async (identificador, titulo, totalQuestoes, acertos, percentual) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");

    let metaId = get().historico[identificador]?.idMeta;

    // Se a meta do simulado não existe, cria primeiro
    if (!metaId) {
      const { data: novaMetaData, error: metaError } = await supabase
        .from(TABELA_SIMULADOS_META)
        .insert({
          user_id: user.id,
          identificador,
          titulo,
          totalQuestoes,
        })
        .select()
        .single();
      
      if (metaError) throw metaError;
      if (!novaMetaData) throw new Error("Failed to create simualted exam meta entry");
      metaId = novaMetaData.id;

      // Atualiza o estado local com a nova meta (sem tentativas ainda)
      set(state => ({
        historico: {
          ...state.historico,
          [identificador]: {
            idMeta: metaId,
            titulo,
            totalQuestoes,
            tentativas: []
          }
        }
      }));
    }

    // Adiciona a nova tentativa
    const novaTentativaPayload = {
      user_id: user.id,
      simulado_meta_id: metaId,
      timestamp: new Date().toISOString(),
      acertos,
      percentual,
    };

    const { data: novaTentativaData, error: tentativaError } = await supabase
      .from(TABELA_SIMULADOS_TENTATIVAS)
      .insert(novaTentativaPayload)
      .select()
      .single();

    if (tentativaError) throw tentativaError;
    if (!novaTentativaData) throw new Error("Failed to save exam attempt");

    // Atualiza o estado local com a nova tentativa
    set((state) => {
      const historicoAtualizado = { ...state.historico };
      if (historicoAtualizado[identificador]) {
        historicoAtualizado[identificador] = {
          ...historicoAtualizado[identificador],
          tentativas: [...historicoAtualizado[identificador].tentativas, novaTentativaData],
        };
      } else {
        // Isso não deveria acontecer se a meta foi criada acima, mas como fallback:
        historicoAtualizado[identificador] = {
          idMeta: metaId,
          titulo,
          totalQuestoes,
          tentativas: [novaTentativaData],
        };
      }
      return { historico: historicoAtualizado };
    });
  },
}));

// Helper para criar o identificador (pode ser mantido se a UI o utiliza)
export const criarIdentificadorSimulado = (titulo: string, totalQuestoes: number): string => {
  return `${titulo}|${totalQuestoes}`;
};

// Realtime subscriptions for TABELA_SIMULADOS_META and TABELA_SIMULADOS_TENTATIVAS
// should be configured in StoreInitializer.tsx.
// On changes, it might be simpler to call get().fetchHistoricoSimulados(userId)
// or implement more complex granular updates to the nested historico state.

