'use client';

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

// ATUALIZAÇÃO: Verifique se esta estrutura corresponde EXATAMENTE à tabela 'profiles' do schema SQL
export type PerfilUsuario = {
  id: string; // user_id do Supabase Auth, é a PK e FK para auth.users.id
  // user_id?: string; // Removido para evitar redundância, 'id' já é o user_id
  username?: string | null; // Adicionado do schema SQL, pode ser null
  nome_completo?: string | null; // Alterado de 'nome' para 'nome_completo', pode ser null
  data_nascimento?: string | null; // Tipo string para datas do Supabase (ISO 8601), pode ser null
  genero?: string | null; // Pode ser null
  idioma?: string | null; // Pode ser null
  tema_visual?: string | null; // Pode ser null
  meta_calorias_diarias?: number | null; // Pode ser null
  meta_hidratacao_ml?: number | null; // Pode ser null
  meta_tempo_estudo_minutos?: number | null; // Pode ser null
  meta_tempo_lazer_minutos?: number | null; // Pode ser null
  preferenciasVisuais?: PreferenciasVisuais | null; // Pode ser null, JSONB
  metasDiarias?: MetasDiarias | null; // Pode ser null, JSONB
  notificacoesAtivas?: boolean | null; // Pode ser null
  pausasAtivas?: boolean | null; // Pode ser null
  created_at?: string;
  updated_at?: string;
};

interface PerfilState {
  perfil: PerfilUsuario | null;
  currentUser: User | null;

  setCurrentUser: (user: User | null) => void;
  fetchPerfil: (userId: string) => Promise<void>;
  updatePerfil: (updates: Partial<Omit<PerfilUsuario, "id" | "created_at" | "updated_at">>) => Promise<void>;
  resetarPerfilLocal: () => void;
}

// ATUALIZAÇÃO: Nome da tabela alterado
const NOME_TABELA_PERFIS = "profiles";

// ATUALIZAÇÃO: Estrutura do defaultLocalState para corresponder ao PerfilUsuario
// Os campos que podem ser null no DB não precisam necessariamente estar no defaultLocalState
// se a UI ou a lógica de criação souber lidar com a ausência inicial.
// Mas para consistência, podemos definir valores padrão onde fizer sentido.
const defaultLocalStateForCreation: Omit<PerfilUsuario, "id" | "created_at" | "updated_at"> = {
  username: null,
  nome_completo: "Usuário", // Mantido como 'Usuário' para nome
  data_nascimento: null,
  genero: null,
  idioma: 'pt-BR',
  tema_visual: 'system',
  meta_calorias_diarias: null,
  meta_hidratacao_ml: null,
  meta_tempo_estudo_minutos: null,
  meta_tempo_lazer_minutos: null,
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
  perfil: null,
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchPerfil: async (userId) => {
    if (!userId) {
        console.warn("fetchPerfil chamado sem userId");
        return;
    }
    try {
      // ATUALIZAÇÃO: A coluna de correspondência com auth.users.id na tabela 'profiles' é 'id'
      const { data, error } = await supabase
        .from(NOME_TABELA_PERFIS)
        .select("*")
        .eq("id", userId) // A coluna 'id' na tabela 'profiles' é a FK para auth.users.id
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching perfil:", error.message, error.details);
        // Não lançar erro aqui para permitir fallback para criação
      }

      if (data) {
        set({ perfil: data as PerfilUsuario });
      } else {
        console.log(`Perfil não encontrado para user_id: ${userId}. Criando perfil padrão.`);
        // Perfil não encontrado, criar um com valores padrão
        // ATUALIZAÇÃO: O payload para insert deve ter 'id' como o userId
        const perfilPadraoParaSalvar: Omit<PerfilUsuario, "created_at" | "updated_at"> = {
          id: userId, // 'id' da tabela profiles é o user_id
          ...defaultLocalStateForCreation, // Usar o default atualizado
        };
        // Remover campos que não devem ser enviados no insert se forem opcionais e null
        // (Supabase pode lidar com isso se a coluna permitir null e não tiver default)

        const { data: novoPerfil, error: insertError } = await supabase
          .from(NOME_TABELA_PERFIS)
          .insert(perfilPadraoParaSalvar)
          .select()
          .single();

        if (insertError) {
          console.error("Error creating default perfil:", insertError.message, insertError.details);
          // Fallback para estado local padrão em caso de falha na criação
          set({ perfil: { id: userId, ...defaultLocalStateForCreation } as PerfilUsuario });
          // Não lançar erro aqui para a UI poder usar o fallback
          return;
        }
        set({ perfil: novoPerfil as PerfilUsuario });
      }
    } catch (error: any) {
      console.error("Catch geral em fetchPerfil ou creating default:", error.message);
      // Em caso de erro grave, pode-se setar um perfil local padrão para a UI não quebrar
      set({ perfil: { id: userId, ...defaultLocalStateForCreation } as PerfilUsuario });
    }
  },

  updatePerfil: async (updates) => {
    const user = get().currentUser;
    const currentPerfil = get().perfil;

    if (!user || !currentPerfil || !currentPerfil.id) {
        console.error("User ou perfil (ou perfil.id) não disponível para updatePerfil.");
        throw new Error("User or perfil not available for update");
    }
    
    // ATUALIZAÇÃO: O payload não deve conter 'id', pois é a chave primária e não deve ser alterada.
    // O user.id ou currentPerfil.id será usado na cláusula .eq()
    // Criar um novo objeto para o payload do Supabase com mapeamento explícito quando necessário
    const payloadParaSupabase: any = {};
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        if (key === 'metasDiarias') {
          // Mapear explicitamente metasDiarias para metas_diarias
          payloadParaSupabase['metas_diarias'] = (updates as any)[key];
        } else if (key === 'preferenciasVisuais') {
          // Mapear explicitamente preferenciasVisuais para preferencias_visuais se necessário
          payloadParaSupabase['preferencias_visuais'] = (updates as any)[key];
        } else {
          // Para outros campos, manter a chave original (o SDK deveria fazer o mapeamento)
          payloadParaSupabase[key] = (updates as any)[key];
        }
      }
    }

    const { data, error } = await supabase
      .from(NOME_TABELA_PERFIS)
      .update(payloadParaSupabase) // Usar o payload com chaves mapeadas
      .eq("id", currentPerfil.id) // Condição de atualização é na coluna 'id'
      .select()
      .single();

    if (error) {
      console.error("Error updating perfil:", error.message, error.details);
      // Tentar inserir se a atualização falhou por não existir (upsert manual)
      // PGRST116 significa "0 rows in result" para single()
      if (error.code === "PGRST116" || (error.details && error.details.includes("0 rows"))) {
        console.log("Perfil não encontrado para update, tentando inserir como novo (upsert manual)...");
        // ATUALIZAÇÃO: payload para insert
        // Criar um objeto para enviar ao Supabase com mapeamento explícito de campos
        const perfilParaSalvar: any = {
            id: currentPerfil.id, // 'id' da tabela profiles é o user_id
            username: updates.username !== undefined ? updates.username : defaultLocalStateForCreation.username,
            nome_completo: updates.nome_completo !== undefined ? updates.nome_completo : defaultLocalStateForCreation.nome_completo,
            data_nascimento: updates.data_nascimento !== undefined ? updates.data_nascimento : defaultLocalStateForCreation.data_nascimento,
            genero: updates.genero !== undefined ? updates.genero : defaultLocalStateForCreation.genero,
            idioma: updates.idioma !== undefined ? updates.idioma : defaultLocalStateForCreation.idioma,
            tema_visual: updates.tema_visual !== undefined ? updates.tema_visual : defaultLocalStateForCreation.tema_visual,
            meta_calorias_diarias: updates.meta_calorias_diarias !== undefined ? updates.meta_calorias_diarias : defaultLocalStateForCreation.meta_calorias_diarias,
            meta_hidratacao_ml: updates.meta_hidratacao_ml !== undefined ? updates.meta_hidratacao_ml : defaultLocalStateForCreation.meta_hidratacao_ml,
            meta_tempo_estudo_minutos: updates.meta_tempo_estudo_minutos !== undefined ? updates.meta_tempo_estudo_minutos : defaultLocalStateForCreation.meta_tempo_estudo_minutos,
            meta_tempo_lazer_minutos: updates.meta_tempo_lazer_minutos !== undefined ? updates.meta_tempo_lazer_minutos : defaultLocalStateForCreation.meta_tempo_lazer_minutos,
            // Mapear explicitamente preferenciasVisuais para preferencias_visuais
            preferencias_visuais: updates.preferenciasVisuais !== undefined ? updates.preferenciasVisuais : defaultLocalStateForCreation.preferenciasVisuais,
            // Mapear explicitamente metasDiarias para metas_diarias
            metas_diarias: updates.metasDiarias !== undefined ? updates.metasDiarias : defaultLocalStateForCreation.metasDiarias,
            notificacoesAtivas: typeof updates.notificacoesAtivas === "boolean" ? updates.notificacoesAtivas : defaultLocalStateForCreation.notificacoesAtivas,
            pausasAtivas: typeof updates.pausasAtivas === "boolean" ? updates.pausasAtivas : defaultLocalStateForCreation.pausasAtivas,
        };
        const { data: novoPerfil, error: insertError } = await supabase
            .from(NOME_TABELA_PERFIS)
            .insert(perfilParaSalvar)
            .select()
            .single();
        if (insertError) {
            console.error("Error inserting perfil after failed update:", insertError.message, insertError.details);
            throw insertError; // Relançar o erro de inserção se falhar
        }
        set({ perfil: novoPerfil as PerfilUsuario });
        return;
      }
      throw error; // Relançar outros erros de atualização
    }
    if (data) set({ perfil: data as PerfilUsuario });
  },

  resetarPerfilLocal: () => {
    const user = get().currentUser;
    // ATUALIZAÇÃO: o perfil resetado deve ter `id` como user.id
    set({ perfil: user ? { id: user.id, ...defaultLocalStateForCreation } as PerfilUsuario : null });
    // Para efetivamente resetar no banco, você chamaria:
    // if (user) get().updatePerfil(defaultLocalStateForCreation); // Passar o objeto completo
  },
}));

// Realtime subscriptions para NOME_TABELA_PERFIS
// devem ser configuradas no StoreInitializer.tsx.
// Exemplo:
// setupSubscription(NOME_TABELA_PERFIS, (payload) => {
//   const { eventType, new: newRecord, old: oldRecord, table } = payload;
//   const store = usePerfilStore.getState();
//   if (store.currentUser && newRecord.id === store.currentUser.id) { // ATUALIZAÇÃO: Checar newRecord.id
//     if (eventType === "INSERT" || eventType === "UPDATE") {
//       store.fetchPerfil(store.currentUser.id); 
//     }
//   }
// });