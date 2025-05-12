'use client';

import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// Tipos Adaptados para Supabase
interface Ingrediente {
  nome: string;
  quantidade: number; // Mantido como número para armazenamento, mas a UI pode usar string
  unidade: string;
}

export interface Receita {
  id?: string; // Gerenciado pelo Supabase (UUID)
  user_id?: string;
  nome: string;
  descricao?: string;
  categorias?: string[]; // text[] no Supabase
  tags?: string[]; // text[] no Supabase
  tempoPreparo?: number; // int4 no Supabase
  porcoes?: number; // int4 no Supabase
  calorias?: string; // text no Supabase
  imagem?: string | null; // text (URL) no Supabase
  ingredientes?: Ingrediente[]; // jsonb no Supabase
  passos?: string[]; // jsonb ou text[] no Supabase
  created_at?: string;
  updated_at?: string;
}

interface FavoriteRecipe {
  id?: number; // PK simples
  user_id: string;
  recipe_id: string; // FK para recipes.id
  created_at?: string;
}


interface ReceitasState {
  receitas: Receita[];
  favoritos: string[]; // Array de IDs das receitas favoritas
  currentUser: User | null;

  setCurrentUser: (user: User | null) => void;
  fetchReceitasData: (userId: string) => Promise<void>;

  adicionarReceita: (receita: Omit<Receita, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<string | undefined>;
  atualizarReceita: (id: string, updates: Partial<Omit<Receita, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  removerReceita: (id: string) => Promise<void>;
  obterReceitaPorId: (id: string) => Receita | undefined; // Mantém a lógica local
  alternarFavorito: (recipeId: string) => Promise<void>;
}

const NOME_TABELA_RECEITAS = "recipes";
const NOME_TABELA_FAVORITOS = "favorite_recipes";

export const useReceitasStore = create<ReceitasState>()((set, get) => ({
  receitas: [],
  favoritos: [],
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchReceitasData: async (userId) => {
    if (!userId) return;
    try {
      const { data: receitasData, error: receitasError } = await supabase
        .from(NOME_TABELA_RECEITAS)
        .select('*')
        .eq('user_id', userId);

      if (receitasError) throw receitasError;

      const { data: favoritosData, error: favoritosError } = await supabase
        .from(NOME_TABELA_FAVORITOS)
        .select('recipe_id')
        .eq('user_id', userId);

      if (favoritosError) throw favoritosError;

      set({
        receitas: receitasData || [],
        favoritos: favoritosData?.map((f: { recipe_id: string }) => f.recipe_id) || []
      });
    } catch (error) {
      console.error("Error fetching receitas data:", error);
      set({ receitas: [], favoritos: [] });
    }
  },

  adicionarReceita: async (receita) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase
      .from(NOME_TABELA_RECEITAS)
      .insert([{ ...receita, user_id: user.id }])
      .select()
      .single();
    if (error) {
      console.error("Error adding receita:", error.message);
      throw error;
    }
    if (data) {
      set((state) => ({ receitas: [...state.receitas, data] }));
      return data.id;
    }
    return undefined;
  },

  atualizarReceita: async (id, updates) => {
    const { data, error } = await supabase
      .from(NOME_TABELA_RECEITAS)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error("Error updating receita:", error.message);
      throw error;
    }
    if (data) {
      set((state) => ({
        receitas: state.receitas.map((r) => (r.id === id ? data : r)),
      }));
    }
  },

  removerReceita: async (id) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");

    // Remover também dos favoritos se existir
    await supabase
        .from(NOME_TABELA_FAVORITOS)
        .delete()
        .match({ user_id: user.id, recipe_id: id });

    const { error } = await supabase
      .from(NOME_TABELA_RECEITAS)
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error removing receita:", error.message);
      throw error;
    }
    set((state) => ({
      receitas: state.receitas.filter((r) => r.id !== id),
      favoritos: state.favoritos.filter((favId) => favId !== id) // Remove localmente também
    }));
  },

  obterReceitaPorId: (id) => {
    return get().receitas.find((r) => r.id === id);
  },

  alternarFavorito: async (recipeId) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    const { favoritos } = get();
    const isFavorito = favoritos.includes(recipeId);

    try {
      if (isFavorito) {
        // Remover dos favoritos
        const { error } = await supabase
          .from(NOME_TABELA_FAVORITOS)
          .delete()
          .match({ user_id: user.id, recipe_id: recipeId });
        if (error) throw error;
        set((state) => ({
          favoritos: state.favoritos.filter((id) => id !== recipeId),
        }));
      } else {
        // Adicionar aos favoritos
        const { error } = await supabase
          .from(NOME_TABELA_FAVORITOS)
          .insert({ user_id: user.id, recipe_id: recipeId });
        if (error) throw error;
        set((state) => ({
          favoritos: [...state.favoritos, recipeId],
        }));
      }
    } catch (error) {
      console.error("Error toggling favorito:", error);
    }
  },
}));