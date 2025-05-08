import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // Ajuste o caminho se necessário
import { User } from "@supabase/supabase-js";

// Tipos (adaptados para Supabase)
export type NotaAutoconhecimento = {
  id?: string; // Gerenciado pelo Supabase
  user_id?: string;
  titulo: string;
  conteudo: string;
  secao: "quem-sou" | "meus-porques" | "meus-padroes";
  tags: string[]; // Supabase pode armazenar arrays de texto
  dataCriacao?: string; // Supabase gerencia created_at
  dataAtualizacao?: string; // Supabase gerencia updated_at
  imagemUrl?: string | null;
  created_at?: string;
  updated_at?: string;
};

// O modo refúgio é uma configuração de UI, pode permanecer local ou ser sincronizado se necessário.
// Por simplicidade, vamos mantê-lo local na store, mas não será persistido no Supabase diretamente nesta store.
// Se precisar ser sincronizado, seria parte de uma tabela de configurações do usuário.

interface AutoconhecimentoState {
  notas: NotaAutoconhecimento[];
  modoRefugio: boolean; // Mantido localmente por enquanto
  currentUser: User | null;

  setCurrentUser: (user: User | null) => void;
  fetchNotasAutoconhecimento: (userId: string) => Promise<void>;

  adicionarNota: (nota: Omit<NotaAutoconhecimento, "id" | "user_id" | "created_at" | "updated_at" | "dataCriacao" | "dataAtualizacao">) => Promise<string | undefined>;
  atualizarNota: (id: string, updates: Partial<Omit<NotaAutoconhecimento, "id" | "user_id" | "created_at" | "updated_at" | "dataCriacao" | "dataAtualizacao">>) => Promise<void>;
  removerNota: (id: string) => Promise<void>;
  // Tags e imagem são parte do objeto Nota, atualizados via atualizarNota.

  alternarModoRefugio: () => void;
  // buscarNotas: (termo: string) => NotaAutoconhecimento[]; // A busca pode ser feita no cliente ou com query no Supabase
}

const NOME_TABELA_NOTAS_AUTOCONHECIMENTO = "self_knowledge_notes";

export const useAutoconhecimentoStore = create<AutoconhecimentoState>()((set, get) => ({
  notas: [],
  modoRefugio: false,
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchNotasAutoconhecimento: async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from(NOME_TABELA_NOTAS_AUTOCONHECIMENTO)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notas de autoconhecimento:", error.message);
        throw error;
      }
      set({ notas: data || [] });
    } catch (error) {
      console.error("Error in fetchNotasAutoconhecimento:", error);
      set({ notas: [] });
    }
  },

  adicionarNota: async (nota) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase
      .from(NOME_TABELA_NOTAS_AUTOCONHECIMENTO)
      .insert([{ ...nota, user_id: user.id }])
      .select()
      .single(); // Espera um único objeto de nota retornado
    if (error) {
      console.error("Error adding nota de autoconhecimento:", error.message);
      throw error;
    }
    if (data) {
      set((state) => ({ notas: [data, ...state.notas] })); // Adiciona no início para visualização mais recente
      return data.id; // Retorna o ID da nota criada
    }
    return undefined;
  },

  atualizarNota: async (id, updates) => {
    const { data, error } = await supabase
      .from(NOME_TABELA_NOTAS_AUTOCONHECIMENTO)
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Error updating nota de autoconhecimento:", error.message);
      throw error;
    }
    if (data) {
      set((state) => ({
        notas: state.notas.map((n) => (n.id === id ? data : n)),
      }));
    }
  },

  removerNota: async (id) => {
    const { error } = await supabase
      .from(NOME_TABELA_NOTAS_AUTOCONHECIMENTO)
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error removing nota de autoconhecimento:", error.message);
      throw error;
    }
    set((state) => ({ notas: state.notas.filter((n) => n.id !== id) }));
  },

  alternarModoRefugio: () => set((state) => ({ modoRefugio: !state.modoRefugio })),

  // A função buscarNotas pode ser implementada no lado do cliente filtrando o estado `notas`
  // ou, para datasets maiores, fazendo uma query específica ao Supabase com `like` ou `ilike` ou full-text search.
  // Exemplo cliente-side:
  // buscarNotas: (termo: string) => {
  //   const notas = get().notas;
  //   if (!termo.trim()) return notas;
  //   const termoBusca = termo.toLowerCase();
  //   return notas.filter(nota => 
  //     nota.titulo.toLowerCase().includes(termoBusca) ||
  //     nota.conteudo.toLowerCase().includes(termoBusca) ||
  //     (nota.tags && nota.tags.some(tag => tag.toLowerCase().includes(termoBusca)))
  //   );
  // }
}));

// As Realtime subscriptions para esta tabela devem ser configuradas no StoreInitializer.tsx
// Exemplo para NOME_TABELA_NOTAS_AUTOCONHECIMENTO:
// setupSubscription(NOME_TABELA_NOTAS_AUTOCONHECIMENTO, (payload) => {
//   const { eventType, new: newRecord, old: oldRecord } = payload;
//   const store = useAutoconhecimentoStore.getState();
//   if (eventType === "INSERT") store.fetchNotasAutoconhecimento(store.currentUser.id); // Ou adicionar diretamente
//   if (eventType === "UPDATE") store.fetchNotasAutoconhecimento(store.currentUser.id); // Ou atualizar diretamente
//   if (eventType === "DELETE") store.fetchNotasAutoconhecimento(store.currentUser.id); // Ou remover diretamente
// });

