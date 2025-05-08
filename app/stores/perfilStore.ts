import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // Ajuste o caminho se necessário
import { User } from "@supabase/supabase-js";

// Tipos para Supabase (aninhados dentro de um perfil de usuário)
export type PreferenciasVisuais = {
  altoContraste: boolean;
  reducaoEstimulos: boolean;
  textoGrande: boolean;
};

export type MetasDiarias = {
  horasSono: number;
  tarefasPrioritarias: number;
  coposAgua: number;
  pausasProgramadas: number;
};

export type PerfilUsuario = {
  id?: string; // user_id do Supabase Auth, será a PK
  user_id?: string; // Redundante se id é o user_id, mas útil para clareza
  nome: string;
  preferenciasVisuais: PreferenciasVisuais; // JSONB no Supabase
  metasDiarias: MetasDiarias; // JSONB no Supabase
  notificacoesAtivas: boolean;
  pausasAtivas: boolean;
  created_at?: string;
  updated_at?: string;
};

interface PerfilState {
  perfil: PerfilUsuario | null;
  currentUser: User | null;

  setCurrentUser: (user: User | null) => void;
  fetchPerfil: (userId: string) => Promise<void>;
  updatePerfil: (updates: Partial<Omit<PerfilUsuario, "id" | "user_id" | "created_at" | "updated_at">>) => Promise<void>;
  // Ações específicas como atualizarNome, etc., serão cobertas por updatePerfil
  resetarPerfilLocal: () => void; // Reseta o estado local para o default, o DB terá o seu próprio default ou será criado na primeira vez
}

const NOME_TABELA_PERFIS = "user_profiles";

const defaultLocalState: PerfilUsuario = {
  nome: "Usuário",
  preferenciasVisuais: {
    altoContraste: false,
    reducaoEstimulos: false,
    textoGrande: false,
  },
  metasDiarias: {
    horasSono: 8,
    tarefasPrioritarias: 3,
    coposAgua: 8,
    pausasProgramadas: 4,
  },
  notificacoesAtivas: true,
  pausasAtivas: true,
};

export const usePerfilStore = create<PerfilState>()((set, get) => ({
  perfil: null, // Inicia como null até ser carregado
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchPerfil: async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from(NOME_TABELA_PERFIS)
        .select("*")
        .eq("user_id", userId) // Assumindo que user_id é a PK ou uma coluna única
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116: single row not found
        console.error("Error fetching perfil:", error.message);
        throw error;
      }

      if (data) {
        set({ perfil: data });
      } else {
        // Perfil não encontrado, criar um com valores padrão
        const perfilPadraoParaSalvar: Omit<PerfilUsuario, "id" | "created_at" | "updated_at"> = {
          user_id: userId,
          ...defaultLocalState,
        };
        const { data: novoPerfil, error: insertError } = await supabase
          .from(NOME_TABELA_PERFIS)
          .insert(perfilPadraoParaSalvar)
          .select()
          .single();
        if (insertError) {
          console.error("Error creating default perfil:", insertError.message);
          set({ perfil: { ...defaultLocalState, user_id: userId } }); // Fallback para estado local padrão
          throw insertError;
        }
        set({ perfil: novoPerfil });
      }
    } catch (error) {
      console.error("Error in fetchPerfil or creating default:", error);
      // Em caso de erro grave, pode-se setar um perfil local padrão para a UI não quebrar
      set({ perfil: { ...defaultLocalState, user_id: userId } });
    }
  },

  updatePerfil: async (updates) => {
    const user = get().currentUser;
    const currentPerfil = get().perfil;
    if (!user || !currentPerfil) throw new Error("User or perfil not available for update");

    // Assegurar que o user_id não seja sobrescrito se estiver no updates, e que ele exista.
    const payload = { ...updates, user_id: currentPerfil.user_id || user.id };
    // A operação delete foi removida pois a propriedade 'id' não existe no tipo de payload
    // e está causando erro de tipagem

    const { data, error } = await supabase
      .from(NOME_TABELA_PERFIS)
      .update(payload)
      .eq("user_id", currentPerfil.user_id || user.id) // Condição de atualização
      .select()
      .single();

    if (error) {
      console.error("Error updating perfil:", error.message);
      // Tentar inserir se a atualização falhou por não existir (upsert manual)
      if (error.code === "PGRST116" || (error.details && error.details.includes("0 rows"))) {
        const perfilParaSalvar: Omit<PerfilUsuario, "id" | "created_at" | "updated_at"> = {
            user_id: user.id,
            nome: updates.nome || defaultLocalState.nome,
            preferenciasVisuais: updates.preferenciasVisuais || defaultLocalState.preferenciasVisuais,
            metasDiarias: updates.metasDiarias || defaultLocalState.metasDiarias,
            notificacoesAtivas: typeof updates.notificacoesAtivas === "boolean" ? updates.notificacoesAtivas : defaultLocalState.notificacoesAtivas,
            pausasAtivas: typeof updates.pausasAtivas === "boolean" ? updates.pausasAtivas : defaultLocalState.pausasAtivas,
        };
        const { data: novoPerfil, error: insertError } = await supabase
            .from(NOME_TABELA_PERFIS)
            .insert(perfilParaSalvar)
            .select()
            .single();
        if (insertError) {
            console.error("Error inserting perfil after failed update:", insertError.message);
            throw insertError;
        }
        set({ perfil: novoPerfil });
        return;
      }
      throw error;
    }
    if (data) set({ perfil: data });
  },

  resetarPerfilLocal: () => {
    const user = get().currentUser;
    // Esta função apenas reseta o estado local. Para resetar no DB, seria uma chamada `updatePerfil` com os defaults.
    set({ perfil: user ? { ...defaultLocalState, user_id: user.id } : null });
    // Para efetivamente resetar no banco, você chamaria:
    // if (user) get().updatePerfil(defaultLocalState);
  },
}));

// Realtime subscriptions para NOME_TABELA_PERFIS
// devem ser configuradas no StoreInitializer.tsx.
// Exemplo:
// setupSubscription(NOME_TABELA_PERFIS, (payload) => {
//   const { eventType, new: newRecord, old: oldRecord, table } = payload;
//   const store = usePerfilStore.getState();
//   if (store.currentUser && newRecord.user_id === store.currentUser.id) {
//     if (eventType === "INSERT" || eventType === "UPDATE") {
//       store.fetchPerfil(store.currentUser.id); // Ou setar diretamente: set({ perfil: newRecord as PerfilUsuario })
//     }
//   }
// });

