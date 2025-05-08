import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // Ajuste o caminho se necessário
import { User } from "@supabase/supabase-js";

// Tipos (adaptados para Supabase)
export type RefeicaoPlanejada = {
  id?: string; // Gerenciado pelo Supabase
  user_id?: string;
  horario: string; // HH:MM
  descricao: string;
  created_at?: string;
};

export type RegistroRefeicao = {
  id?: string;
  user_id?: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:MM
  descricao: string;
  tipoIcone: string | null;
  foto_url: string | null; // Armazenar URL da imagem do Supabase Storage
  created_at?: string;
};

// Para hidratação, vamos separar as configurações (meta) dos registros diários
export type HidratacaoConfig = {
  id?: string; // Chave primária, pode ser o user_id se for uma config por usuário
  user_id?: string;
  meta_diaria_copos: number;
  updated_at?: string;
};

export type RegistroHidratacao = {
  id?: string;
  user_id?: string;
  data: string; // YYYY-MM-DD
  copos_bebidos: number;
  // ultimo_registro_hora: string | null; // HH:MM, pode ser útil para UI
  created_at?: string;
  updated_at?: string;
};

interface AlimentacaoState {
  refeicoesPlanejadas: RefeicaoPlanejada[];
  registrosRefeicao: RegistroRefeicao[];
  hidratacaoConfig: HidratacaoConfig | null;
  registroHidratacaoHoje: RegistroHidratacao | null; // Registro do dia atual
  currentUser: User | null;

  setCurrentUser: (user: User | null) => void;
  fetchAlimentacaoData: (userId: string, dataHoje: string) => Promise<void>;

  // Planejador de Refeições
  adicionarRefeicaoPlanejada: (refeicao: Omit<RefeicaoPlanejada, "id" | "user_id" | "created_at">) => Promise<void>;
  atualizarRefeicaoPlanejada: (id: string, updates: Partial<Omit<RefeicaoPlanejada, "id" | "user_id" | "created_at">>) => Promise<void>;
  removerRefeicaoPlanejada: (id: string) => Promise<void>;

  // Registro de Refeições
  adicionarRegistroRefeicao: (registro: Omit<RegistroRefeicao, "id" | "user_id" | "created_at">) => Promise<void>;
  removerRegistroRefeicao: (id: string) => Promise<void>;
  // atualizarRegistroRefeicao: (id: string, updates: Partial<Omit<RegistroRefeicao, "id" | "user_id" | "created_at">>) => Promise<void>; // Adicionar se necessário

  // Hidratação
  ajustarMetaDiariaCopos: (novaMeta: number) => Promise<void>;
  registrarCopoBebido: () => Promise<void>; // Incrementa copos_bebidos no registro do dia
  removerCopoBebido: () => Promise<void>; // Decrementa copos_bebidos no registro do dia
}

const NOME_TABELA_REFEICOES_PLANEJADAS = "planned_meals";
const NOME_TABELA_REGISTROS_REFEICAO = "meal_logs";
const NOME_TABELA_HIDRATACAO_CONFIG = "hydration_config";
const NOME_TABELA_REGISTROS_HIDRATACAO = "hydration_logs";

export const useAlimentacaoStore = create<AlimentacaoState>()((set, get) => ({
  refeicoesPlanejadas: [],
  registrosRefeicao: [],
  hidratacaoConfig: null,
  registroHidratacaoHoje: null,
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchAlimentacaoData: async (userId, dataHoje) => {
    if (!userId) return;
    try {
      const [
        { data: refeicoesData, error: refeicoesError },
        { data: registrosData, error: registrosError },
        { data: configHidratacaoData, error: configHidratacaoError },
        { data: logHidratacaoHojeData, error: logHidratacaoHojeError },
      ] = await Promise.all([
        supabase.from(NOME_TABELA_REFEICOES_PLANEJADAS).select("*").eq("user_id", userId),
        supabase.from(NOME_TABELA_REGISTROS_REFEICAO).select("*").eq("user_id", userId).order("data", { ascending: false }).order("horario", { ascending: false }), // Ordenar para UI
        supabase.from(NOME_TABELA_HIDRATACAO_CONFIG).select("*").eq("user_id", userId).maybeSingle(),
        supabase.from(NOME_TABELA_REGISTROS_HIDRATACAO).select("*").eq("user_id", userId).eq("data", dataHoje).maybeSingle(),
      ]);

      if (refeicoesError) console.error("Error fetching refeicoes planejadas:", refeicoesError.message);
      if (registrosError) console.error("Error fetching registros de refeicao:", registrosError.message);
      if (configHidratacaoError) console.error("Error fetching config hidratacao:", configHidratacaoError.message);
      if (logHidratacaoHojeError) console.error("Error fetching log hidratacao hoje:", logHidratacaoHojeError.message);

      let finalConfigHidratacao = configHidratacaoData;
      if (!configHidratacaoData && userId) { // Se não existe config, cria uma padrão
        const { data: newConfig, error: newConfigError } = await supabase
          .from(NOME_TABELA_HIDRATACAO_CONFIG)
          .insert({ user_id: userId, meta_diaria_copos: 8 })
          .select()
          .single();
        if (newConfigError) console.error("Error creating default hydration config:", newConfigError.message);
        else finalConfigHidratacao = newConfig;
      }

      let finalLogHidratacaoHoje = logHidratacaoHojeData;
      if (!logHidratacaoHojeData && userId && dataHoje) { // Se não existe log para hoje, cria um
        const { data: newLog, error: newLogError } = await supabase
          .from(NOME_TABELA_REGISTROS_HIDRATACAO)
          .insert({ user_id: userId, data: dataHoje, copos_bebidos: 0 })
          .select()
          .single();
        if (newLogError) console.error("Error creating default hydration log for today:", newLogError.message);
        else finalLogHidratacaoHoje = newLog;
      }

      set({
        refeicoesPlanejadas: refeicoesData || [],
        registrosRefeicao: registrosData || [],
        hidratacaoConfig: finalConfigHidratacao || { user_id: userId, meta_diaria_copos: 8 },
        registroHidratacaoHoje: finalLogHidratacaoHoje || { user_id: userId, data: dataHoje, copos_bebidos: 0 },
      });

    } catch (error) {
      console.error("Error fetching alimentacao data:", error);
    }
  },

  // Planejador de Refeições
  adicionarRefeicaoPlanejada: async (refeicao) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from(NOME_TABELA_REFEICOES_PLANEJADAS).insert([{ ...refeicao, user_id: user.id }]).select();
    if (error) throw error;
    if (data) set((state) => ({ refeicoesPlanejadas: [...state.refeicoesPlanejadas, ...data] }));
  },
  atualizarRefeicaoPlanejada: async (id, updates) => {
    const { data, error } = await supabase.from(NOME_TABELA_REFEICOES_PLANEJADAS).update(updates).eq("id", id).select();
    if (error) throw error;
    if (data) set((state) => ({ refeicoesPlanejadas: state.refeicoesPlanejadas.map((r) => (r.id === id ? data[0] : r)) }));
  },
  removerRefeicaoPlanejada: async (id) => {
    const { error } = await supabase.from(NOME_TABELA_REFEICOES_PLANEJADAS).delete().eq("id", id);
    if (error) throw error;
    set((state) => ({ refeicoesPlanejadas: state.refeicoesPlanejadas.filter((r) => r.id !== id) }));
  },

  // Registro de Refeições
  adicionarRegistroRefeicao: async (registro) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    // Aqui, se `foto` for um File object, precisaria fazer upload para o Supabase Storage primeiro
    // e então salvar a `foto_url`. Por simplicidade, assumimos que `foto_url` já é uma string ou null.
    const { data, error } = await supabase.from(NOME_TABELA_REGISTROS_REFEICAO).insert([{ ...registro, user_id: user.id }]).select();
    if (error) throw error;
    if (data) set((state) => ({ registrosRefeicao: [...state.registrosRefeicao, ...data] }));
  },
  removerRegistroRefeicao: async (id) => {
    const { error } = await supabase.from(NOME_TABELA_REGISTROS_REFEICAO).delete().eq("id", id);
    if (error) throw error;
    set((state) => ({ registrosRefeicao: state.registrosRefeicao.filter((r) => r.id !== id) }));
  },

  // Hidratação
  ajustarMetaDiariaCopos: async (novaMeta) => {
    const user = get().currentUser;
    const currentConfig = get().hidratacaoConfig;
    if (!user || !currentConfig) throw new Error("User or hydration config not available");
    if (novaMeta < 1 || novaMeta > 20) throw new Error("Meta inválida"); // Exemplo de validação

    const { data, error } = await supabase
      .from(NOME_TABELA_HIDRATACAO_CONFIG)
      .update({ meta_diaria_copos: novaMeta })
      .eq("user_id", user.id) // Assume que user_id é a chave para config ou existe uma PK `id` e `user_id` para filtro
      .select()
      .single();
    if (error) throw error;
    if (data) set({ hidratacaoConfig: data });
  },

  registrarCopoBebido: async () => {
    const user = get().currentUser;
    const hoje = new Date().toISOString().split("T")[0];
    let logHoje = get().registroHidratacaoHoje;

    if (!user) throw new Error("User not authenticated");

    if (!logHoje || logHoje.data !== hoje) {
      // Se não há log para hoje, ou o log é de outro dia, busca/cria um novo
      const { data: existingLog, error: fetchError } = await supabase
        .from(NOME_TABELA_REGISTROS_HIDRATACAO)
        .select("*")
        .eq("user_id", user.id)
        .eq("data", hoje)
        .maybeSingle();
      if (fetchError) throw fetchError;
      logHoje = existingLog;
    }

    const novosCopos = (logHoje ? logHoje.copos_bebidos : 0) + 1;

    if (logHoje && logHoje.id) { // Atualiza existente
      const { data, error } = await supabase
        .from(NOME_TABELA_REGISTROS_HIDRATACAO)
        .update({ copos_bebidos: novosCopos })
        .eq("id", logHoje.id)
        .select()
        .single();
      if (error) throw error;
      if (data) set({ registroHidratacaoHoje: data });
    } else { // Cria novo log para hoje
      const { data, error } = await supabase
        .from(NOME_TABELA_REGISTROS_HIDRATACAO)
        .insert({ user_id: user.id, data: hoje, copos_bebidos: novosCopos })
        .select()
        .single();
      if (error) throw error;
      if (data) set({ registroHidratacaoHoje: data });
    }
  },

  removerCopoBebido: async () => {
    const user = get().currentUser;
    const hoje = new Date().toISOString().split("T")[0];
    let logHoje = get().registroHidratacaoHoje;

    if (!user || !logHoje || logHoje.data !== hoje || logHoje.copos_bebidos === 0) {
      // Não faz nada se não estiver logado, não houver log para hoje, ou copos já for 0
      return;
    }
    
    const novosCopos = Math.max(0, logHoje.copos_bebidos - 1);
    const { data, error } = await supabase
      .from(NOME_TABELA_REGISTROS_HIDRATACAO)
      .update({ copos_bebidos: novosCopos })
      .eq("id", logHoje.id)
      .select()
      .single();
    if (error) throw error;
    if (data) set({ registroHidratacaoHoje: data });
  },
}));

// As Realtime subscriptions para estas tabelas devem ser configuradas no StoreInitializer.tsx
// e devem chamar fetchAlimentacaoData ou atualizar o estado diretamente de forma granular.

