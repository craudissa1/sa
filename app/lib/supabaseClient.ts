import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekdygbctzcrzrqqxfszz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZHlnYmN0emNyenJxcXhmc3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NDY5MTQsImV4cCI6MjA2MjEyMjkxNH0.fYu9IWemd3jadizoaCajJTGyHB3KgKhUOEfLxpdACJE';

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL. Check your .env.local file.');
}

// Configurar o cliente Supabase com opções avançadas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,  // Manter sessão entre recargas da página
    autoRefreshToken: true, // Renovar token automaticamente
    detectSessionInUrl: false, // Não detectar sessão na URL (ajuda a prevenir problemas com sessões cruzadas)
    storageKey: 'supabase.auth.token', // Chave para armazenar a sessão
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') return null;
        return window.localStorage.getItem(key);
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(key);
      }
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Taxa de eventos por segundo
    }
  },
  global: {
    fetch: fetch
  }
});
