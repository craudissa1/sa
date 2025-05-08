import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // Ajuste o caminho se necessário
import { User } from "@supabase/supabase-js";

// Tipos
interface ConfiguracaoPomodoro {
  user_id?: string; // FK, e possivelmente PK
  tempoFoco: number;        // em minutos
  tempoPausa: number;       // em minutos
  tempoLongapausa: number;  // em minutos
  ciclosAntesLongapausa: number;
  created_at?: string;
  updated_at?: string;
}

interface PomodoroState {
  configuracao: ConfiguracaoPomodoro | null; // Carregado do Supabase
  atualizarConfiguracao: (config: Partial<Omit<ConfiguracaoPomodoro, "user_id" | "created_at" | "updated_at">>) => Promise<void>;
  fetchConfiguracao: (userId: string) => Promise<void>;

  // Estatísticas locais (não sincronizadas com Supabase nesta versão, mantendo comportamento original)
  ciclosCompletos: number;
  incrementarCiclosCompletos: () => void;
  resetarCiclosCompletos: () => void;
  
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const NOME_TABELA_CONFIG_POMODORO = "pomodoro_configurations";

const defaultConfigValues: Omit<ConfiguracaoPomodoro, "user_id" | "created_at" | "updated_at"> = {
  tempoFoco: 25,
  tempoPausa: 5,
  tempoLongapausa: 15,
  ciclosAntesLongapausa: 4,
};

export const usePomodoroStore = create<PomodoroState>()((set, get) => ({
  configuracao: null, // Inicia como null até ser carregado
  ciclosCompletos: 0,
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchConfiguracao: async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from(NOME_TABELA_CONFIG_POMODORO)
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116: single row not found
        console.error("Error fetching pomodoro configuration:", error.message);
        throw error;
      }

      if (data) {
        set({ configuracao: data });
      } else {
        // Configuração não encontrada, criar uma com valores padrão
        const configParaSalvar: ConfiguracaoPomodoro = {
          user_id: userId,
          ...defaultConfigValues,
        };
        const { data: novaConfig, error: insertError } = await supabase
          .from(NOME_TABELA_CONFIG_POMODORO)
          .insert(configParaSalvar)
          .select()
          .single();
        if (insertError) {
          console.error("Error creating default pomodoro configuration:", insertError.message);
          set({ configuracao: { user_id: userId, ...defaultConfigValues } }); // Fallback para estado local padrão
          throw insertError;
        }
        set({ configuracao: novaConfig });
      }
    } catch (error) {
      console.error("Error in fetchConfiguracao or creating default:", error);
      set({ configuracao: { user_id: userId, ...defaultConfigValues } }); // Fallback em caso de erro grave
    }
  },

  atualizarConfiguracao: async (configUpdates) => {
    const user = get().currentUser;
    const currentConfig = get().configuracao;
    if (!user || !currentConfig || !currentConfig.user_id) throw new Error("User or configuration not available for update");

    const payload = { ...configUpdates };

    const { data, error } = await supabase
      .from(NOME_TABELA_CONFIG_POMODORO)
      .update(payload)
      .eq("user_id", currentConfig.user_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating pomodoro configuration:", error.message);
      // Se a atualização falhar porque não existe (PGRST116), tentar inserir.
      // Isso pode acontecer se o fetch inicial falhou e o estado local foi setado com um fallback.
      if (error.code === "PGRST116" || (error.details && error.details.includes("0 rows"))) {
        const configParaSalvar: ConfiguracaoPomodoro = {
            user_id: user.id,
            tempoFoco: configUpdates.tempoFoco ?? defaultConfigValues.tempoFoco,
            tempoPausa: configUpdates.tempoPausa ?? defaultConfigValues.tempoPausa,
            tempoLongapausa: configUpdates.tempoLongapausa ?? defaultConfigValues.tempoLongapausa,
            ciclosAntesLongapausa: configUpdates.ciclosAntesLongapausa ?? defaultConfigValues.ciclosAntesLongapausa,
        };
        const { data: novaConfig, error: insertError } = await supabase
            .from(NOME_TABELA_CONFIG_POMODORO)
            .insert(configParaSalvar)
            .select()
            .single();
        if (insertError) {
            console.error("Error inserting pomodoro config after failed update:", insertError.message);
            throw insertError;
        }
        set({ configuracao: novaConfig });
        return;
      }
      throw error;
    }
    if (data) set({ configuracao: data });
  },

  // Estatísticas locais
  incrementarCiclosCompletos: () => set((state) => ({
    ciclosCompletos: state.ciclosCompletos + 1
  })),

  resetarCiclosCompletos: () => set({
    ciclosCompletos: 0
  }),
}));

// Realtime subscriptions para NOME_TABELA_CONFIG_POMODORO
// devem ser configuradas no StoreInitializer.tsx.
// Exemplo:
// setupSubscription(NOME_TABELA_CONFIG_POMODORO, (payload) => {
//   const { eventType, new: newRecord } = payload;
//   const store = usePomodoroStore.getState();
//   if (store.currentUser && newRecord.user_id === store.currentUser.id) {
//     if (eventType === "INSERT" || eventType === "UPDATE") {
//       store.fetchConfiguracao(store.currentUser.id); // Ou setar diretamente: set({ configuracao: newRecord as ConfiguracaoPomodoro })
//     }
//   }
// });

