import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient'; // Ajuste o caminho se necessário
import { User } from '@supabase/supabase-js';

// Tipos (adaptados para Supabase)
export type Categoria = {
  id?: string; // Gerenciado pelo Supabase
  user_id?: string;
  nome: string;
  cor: string;
  icone: string;
  created_at?: string;
};

export type Transacao = {
  id?: string;
  user_id?: string;
  data: string; // YYYY-MM-DD
  valor: number;
  descricao: string;
  categoriaId: string; // Deverá ser o ID da categoria no Supabase
  tipo: 'receita' | 'despesa';
  created_at?: string;
};

export type Envelope = {
  id?: string;
  user_id?: string;
  nome: string;
  cor: string;
  valorAlocado: number;
  valorUtilizado: number;
  created_at?: string;
};

export type PagamentoRecorrente = {
  id?: string;
  user_id?: string;
  descricao: string;
  valor: number;
  dataVencimento: string; // dia do mês (1-31)
  categoriaId: string;
  proximoPagamento: string | null; // YYYY-MM-DD
  pago: boolean;
  created_at?: string;
};

interface FinancasState {
  categorias: Categoria[];
  transacoes: Transacao[];
  envelopes: Envelope[];
  pagamentosRecorrentes: PagamentoRecorrente[];
  currentUser: User | null;

  setCurrentUser: (user: User | null) => void;
  fetchFinancasData: (userId: string) => Promise<void>;

  // Categorias
  adicionarCategoria: (categoria: Omit<Categoria, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  atualizarCategoria: (id: string, updates: Partial<Omit<Categoria, 'id' | 'user_id' | 'created_at'>>) => Promise<void>;
  removerCategoria: (id: string) => Promise<void>;

  // Transações
  adicionarTransacao: (transacao: Omit<Transacao, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  removerTransacao: (id: string) => Promise<void>;
  // atualizarTransacao: (id: string, updates: Partial<Omit<Transacao, 'id' | 'user_id' | 'created_at'>>) => Promise<void>; // Adicionar se necessário

  // Envelopes
  adicionarEnvelope: (envelope: Omit<Envelope, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  atualizarEnvelope: (id: string, updates: Partial<Omit<Envelope, 'id' | 'user_id' | 'created_at'>>) => Promise<void>;
  removerEnvelope: (id: string) => Promise<void>;
  registrarGastoEnvelope: (id: string, valorGasto: number) => Promise<void>;

  // Pagamentos Recorrentes
  adicionarPagamentoRecorrente: (pagamento: Omit<PagamentoRecorrente, 'id' | 'user_id' | 'created_at' | 'proximoPagamento' | 'pago'>) => Promise<void>;
  atualizarPagamentoRecorrente: (id: string, updates: Partial<Omit<PagamentoRecorrente, 'id' | 'user_id' | 'created_at'>>) => Promise<void>;
  removerPagamentoRecorrente: (id: string) => Promise<void>;
  marcarPagamentoComoPago: (id: string, pago: boolean, proximoPagamento?: string) => Promise<void>; // proximoPagamento opcional aqui, calculado na lógica
}

export const useFinancasStore = create<FinancasState>()((set, get) => ({
  categorias: [],
  transacoes: [],
  envelopes: [],
  pagamentosRecorrentes: [],
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchFinancasData: async (userId) => {
    if (!userId) return;
    try {
      const [
        { data: categoriasData, error: categoriasError },
        { data: transacoesData, error: transacoesError },
        { data: envelopesData, error: envelopesError },
        { data: pagamentosData, error: pagamentosError },
      ] = await Promise.all([
        supabase.from('finance_categories').select('*').eq('user_id', userId),
        supabase.from('finance_transactions').select('*').eq('user_id', userId),
        supabase.from('finance_envelopes').select('*').eq('user_id', userId),
        supabase.from('finance_recurring_payments').select('*').eq('user_id', userId),
      ]);

      if (categoriasError) console.error('Error fetching categorias:', categoriasError.message);
      if (transacoesError) console.error('Error fetching transacoes:', transacoesError.message);
      if (envelopesError) console.error('Error fetching envelopes:', envelopesError.message);
      if (pagamentosError) console.error('Error fetching pagamentos:', pagamentosError.message);

      set({
        categorias: categoriasData || [],
        transacoes: transacoesData || [],
        envelopes: envelopesData || [],
        pagamentosRecorrentes: pagamentosData || [],
      });
    } catch (error) {
      console.error('Error fetching financas data:', error);
    }
  },

  // Categorias
  adicionarCategoria: async (categoria) => {
    const user = get().currentUser;
    if (!user) throw new Error('User not authenticated');
    const { data, error } = await supabase.from('finance_categories').insert([{ ...categoria, user_id: user.id }]).select();
    if (error) throw error;
    if (data) set((state) => ({ categorias: [...state.categorias, ...data] }));
  },
  atualizarCategoria: async (id, updates) => {
    const { data, error } = await supabase.from('finance_categories').update(updates).eq('id', id).select();
    if (error) throw error;
    if (data) set((state) => ({ categorias: state.categorias.map((c) => (c.id === id ? data[0] : c)) }));
  },
  removerCategoria: async (id) => {
    // Antes de remover a categoria, considerar o que fazer com transações e pagamentos associados.
    // Opção 1: Deleção em cascata no DB (configurar no Supabase).
    // Opção 2: Setar categoriaId para null ou para uma categoria 'Padrão'.
    // Opção 3: Impedir a remoção se houver itens associados (requer verificações prévias).
    // Por simplicidade aqui, apenas removemos a categoria. O DB deve ter ON DELETE SET NULL ou CASCADE.
    const { error } = await supabase.from('finance_categories').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({ 
      categorias: state.categorias.filter((c) => c.id !== id),
      // Atualizar localmente transações e pagamentos se a FK não for ON DELETE CASCADE
      // transacoes: state.transacoes.map(t => t.categoriaId === id ? { ...t, categoriaId: null } : t),
      // pagamentosRecorrentes: state.pagamentosRecorrentes.map(p => p.categoriaId === id ? { ...p, categoriaId: null } : p),
    }));
  },

  // Transações
  adicionarTransacao: async (transacao) => {
    const user = get().currentUser;
    if (!user) throw new Error('User not authenticated');
    const { data, error } = await supabase.from('finance_transactions').insert([{ ...transacao, user_id: user.id }]).select();
    if (error) throw error;
    if (data) set((state) => ({ transacoes: [...state.transacoes, ...data] }));
  },
  removerTransacao: async (id) => {
    const { error } = await supabase.from('finance_transactions').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({ transacoes: state.transacoes.filter((t) => t.id !== id) }));
  },

  // Envelopes
  adicionarEnvelope: async (envelope) => {
    const user = get().currentUser;
    if (!user) throw new Error('User not authenticated');
    const { data, error } = await supabase.from('finance_envelopes').insert([{ ...envelope, user_id: user.id, valorUtilizado: 0 }]).select();
    if (error) throw error;
    if (data) set((state) => ({ envelopes: [...state.envelopes, ...data] }));
  },
  atualizarEnvelope: async (id, updates) => {
    const { data, error } = await supabase.from('finance_envelopes').update(updates).eq('id', id).select();
    if (error) throw error;
    if (data) set((state) => ({ envelopes: state.envelopes.map((e) => (e.id === id ? data[0] : e)) }));
  },
  removerEnvelope: async (id) => {
    const { error } = await supabase.from('finance_envelopes').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({ envelopes: state.envelopes.filter((e) => e.id !== id) }));
  },
  registrarGastoEnvelope: async (id, valorGasto) => {
    const envelope = get().envelopes.find(e => e.id === id);
    if (!envelope) throw new Error('Envelope not found');
    const novoValorUtilizado = (envelope.valorUtilizado || 0) + valorGasto;
    const { data, error } = await supabase.from('finance_envelopes').update({ valorUtilizado: novoValorUtilizado }).eq('id', id).select();
    if (error) throw error;
    if (data) set((state) => ({ envelopes: state.envelopes.map((e) => (e.id === id ? data[0] : e)) }));
  },

  // Pagamentos Recorrentes
  adicionarPagamentoRecorrente: async (pagamento) => {
    const user = get().currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const hoje = new Date();
    const diaVencimento = parseInt(pagamento.dataVencimento);
    let proximoPagamentoDate = new Date(hoje.getFullYear(), hoje.getMonth(), diaVencimento);
    if (proximoPagamentoDate.getDate() < hoje.getDate() && proximoPagamentoDate.getMonth() === hoje.getMonth()) {
      proximoPagamentoDate.setMonth(proximoPagamentoDate.getMonth() + 1);
    }
    const proximoPagamentoStr = proximoPagamentoDate.toISOString().split('T')[0];

    const { data, error } = await supabase.from('finance_recurring_payments').insert([{ ...pagamento, user_id: user.id, proximoPagamento: proximoPagamentoStr, pago: false }]).select();
    if (error) throw error;
    if (data) set((state) => ({ pagamentosRecorrentes: [...state.pagamentosRecorrentes, ...data] }));
  },
  atualizarPagamentoRecorrente: async (id, updates) => {
    const { data, error } = await supabase.from('finance_recurring_payments').update(updates).eq('id', id).select();
    if (error) throw error;
    if (data) set((state) => ({ pagamentosRecorrentes: state.pagamentosRecorrentes.map((p) => (p.id === id ? data[0] : p)) }));
  },
  removerPagamentoRecorrente: async (id) => {
    const { error } = await supabase.from('finance_recurring_payments').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({ pagamentosRecorrentes: state.pagamentosRecorrentes.filter((p) => p.id !== id) }));
  },
  marcarPagamentoComoPago: async (id, pago) => {
    const pagamentoAtual = get().pagamentosRecorrentes.find(p => p.id === id);
    if (!pagamentoAtual) throw new Error('Pagamento recorrente não encontrado.');

    let proximoPagamentoStr = pagamentoAtual.proximoPagamento;
    if (pago) {
        const dataAtual = new Date();
        const diaVencimento = parseInt(pagamentoAtual.dataVencimento);
        let proximoMes = dataAtual.getMonth() + 1;
        let proximoAno = dataAtual.getFullYear();

        // Se o dia de vencimento já passou no mês atual, ou se estamos no mesmo dia mas o pagamento é para o próximo ciclo
        if ( (dataAtual.getDate() >= diaVencimento && proximoMes -1 === dataAtual.getMonth()) || proximoMes -1 > dataAtual.getMonth() ) {
            // Se o próximo mês calculado ultrapassa Dezembro
            if (proximoMes > 11) {
                proximoMes = 0; // Janeiro
                proximoAno++;
            }
        } else if (dataAtual.getDate() < diaVencimento && proximoMes -1 === dataAtual.getMonth()){
            // Se o dia de vencimento ainda não chegou no mês atual, mantém o mês atual para o próximo pagamento
            proximoMes = dataAtual.getMonth(); 
        }

        const proximoPagamentoDate = new Date(proximoAno, proximoMes, diaVencimento);
        proximoPagamentoStr = proximoPagamentoDate.toISOString().split('T')[0];
    }

    const { data, error } = await supabase.from('finance_recurring_payments').update({ pago, proximoPagamento: proximoPagamentoStr }).eq('id', id).select();
    if (error) throw error;
    if (data) set((state) => ({ pagamentosRecorrentes: state.pagamentosRecorrentes.map((p) => (p.id === id ? data[0] : p)) }));
  },
}));

// As Realtime subscriptions para estas tabelas devem ser configuradas no StoreInitializer.tsx
// Exemplo para 'finance_categories':
// setupSubscription('finance_categories', (payload) => {
//   const { eventType, new: newRecord, old: oldRecord } = payload;
//   if (eventType === 'INSERT') useFinancasStore.setState((state) => ({ categorias: [...state.categorias, newRecord as any] }));
//   if (eventType === 'UPDATE') useFinancasStore.setState((state) => ({ categorias: state.categorias.map((c) => (c.id === newRecord.id ? (newRecord as any) : c)) }));
//   if (eventType === 'DELETE') useFinancasStore.setState((state) => ({ categorias: state.categorias.filter((c) => c.id !== oldRecord.id) }));
// });

