import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // Ajuste o caminho se necessário
import { User } from "@supabase/supabase-js";

// Tipos (adaptados para Supabase)
export interface AlternativaQuestao { // Mantido como AlternativaQuestao, o import no componente será ajustado
  id: string; // UUID gerado no cliente ou um identificador simples se não precisar de FK
  texto: string;
  correta: boolean;
}

export interface Questao {
  id?: string; // Gerenciado pelo Supabase
  user_id?: string;
  concurso_id?: string | null; // FK para a tabela de concursos (user_contests)
  disciplina: string;
  topico: string;
  enunciado: string;
  alternativas: AlternativaQuestao[]; // Armazenado como JSONB no Supabase
  resposta_correta_id: string; // ID da alternativa correta (deve corresponder a um id em `alternativas`)
  justificativa?: string | null;
  nivel_dificuldade?: "facil" | "medio" | "dificil" | null;
  ano?: number | null;
  banca?: string | null;
  tags?: string[] | null; // Array de texto
  created_at?: string;
  updated_at?: string;
  respostaUsuario?: string; // Adicionado para o modo revisão no QuestaoCard
}

// Para respostas do usuário em simulados ou estudos
export interface RespostaUsuarioQuestao {
    id?: string; // PK
    user_id?: string; // FK
    questao_id: string; // FK para a tabela de questoes
    simulado_id?: string | null; // FK para um simulado específico, se aplicável
    alternativa_escolhida_id: string; // ID da alternativa que o usuário marcou
    acertou: boolean;
    timestamp: string; // ISO string
    created_at?: string;
}

interface QuestoesState {
  questoes: Questao[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  fetchQuestoes: (userId: string, concursoId?: string) => Promise<void>;
  adicionarQuestao: (questao: Omit<Questao, "id" | "user_id" | "created_at" | "updated_at">) => Promise<string | undefined>;
  atualizarQuestao: (id: string, updates: Partial<Omit<Questao, "id" | "user_id" | "created_at" | "updated_at">>) => Promise<void>;
  removerQuestao: (id: string) => Promise<void>;
  importarQuestoes: (novasQuestoes: Array<Omit<Questao, "id" | "user_id" | "created_at" | "updated_at"> & { concurso_id?: string }>) => Promise<void>;
}

const NOME_TABELA_QUESTOES = "exam_questions";

export const useQuestoesStore = create<QuestoesState>()((set, get) => ({
  questoes: [],
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  fetchQuestoes: async (userId, concursoId) => {
    if (!userId) return;
    try {
      let query = supabase.from(NOME_TABELA_QUESTOES).select("*").eq("user_id", userId);
      if (concursoId) {
        query = query.eq("concurso_id", concursoId);
      }
      query = query.order("created_at", { ascending: false });
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching questoes:", error.message);
        throw error;
      }
      set({ questoes: data || [] });
    } catch (error) {
      console.error("Error in fetchQuestoes:", error);
      set({ questoes: [] });
    }
  },
  adicionarQuestao: async (questao) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    const alternativasComId = questao.alternativas.map(alt => ({ ...alt, id: alt.id || crypto.randomUUID() }));
    const questaoParaSalvar = { ...questao, alternativas: alternativasComId, user_id: user.id };
    const { data, error } = await supabase.from(NOME_TABELA_QUESTOES).insert([questaoParaSalvar]).select().single();
    if (error) {
      console.error("Error adding questao:", error.message);
      throw error;
    }
    if (data) {
      set((state) => ({ questoes: [data, ...state.questoes] }));
      return data.id;
    }
    return undefined;
  },
  atualizarQuestao: async (id, updates) => {
    if (updates.alternativas) {
        updates.alternativas = updates.alternativas.map(alt => ({ ...alt, id: alt.id || crypto.randomUUID() }));
    }
    const { data, error } = await supabase.from(NOME_TABELA_QUESTOES).update(updates).eq("id", id).select().single();
    if (error) {
      console.error("Error updating questao:", error.message);
      throw error;
    }
    if (data) {
      set((state) => ({
        questoes: state.questoes.map((q) => (q.id === id ? data : q)),
      }));
    }
  },
  removerQuestao: async (id) => {
    const { error } = await supabase.from(NOME_TABELA_QUESTOES).delete().eq("id", id);
    if (error) {
      console.error("Error removing questao:", error.message);
      throw error;
    }
    set((state) => ({ questoes: state.questoes.filter((q) => q.id !== id) }));
  },
  importarQuestoes: async (novasQuestoes) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    const questoesParaSalvar = novasQuestoes.map(q => {
      const alternativasComId = q.alternativas.map(alt => ({ ...alt, id: alt.id || crypto.randomUUID() }));
      return { ...q, alternativas: alternativasComId, user_id: user.id };
    });
    if (questoesParaSalvar.length === 0) return;
    const { data, error } = await supabase.from(NOME_TABELA_QUESTOES).insert(questoesParaSalvar).select();
    if (error) {
      console.error("Error importing questoes:", error.message);
      throw error;
    }
    if (data) {
      get().fetchQuestoes(user.id);
    }
  },
}));

