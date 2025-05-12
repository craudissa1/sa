import { createBrowserClient, CookieOptions } from '@supabase/ssr';
import type { SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.');
}

let supabaseInstance: SupabaseClient<Database> | null = null;

// Função modificada para usar inicialização preguiçosa
function getSupabaseClient(): SupabaseClient<Database> {
  // Verificar se está no lado do cliente
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseClient deve ser usado apenas no lado do cliente');
  }

  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`));
          return cookie ? cookie.split('=')[1] : undefined;
        },
        set(name: string, value: string, options: CookieOptions) {
          let cookie = `${name}=${value}`;
          if (options.path) cookie += `; path=${options.path}`;
          if (options.maxAge) cookie += `; max-age=${options.maxAge}`;
          if (options.domain) cookie += `; domain=${options.domain}`;
          if (options.secure) cookie += '; secure';
          document.cookie = cookie;
        },
        remove(name: string, options: CookieOptions) {
          document.cookie = `${name}=; max-age=0${options.path ? `; path=${options.path}` : ''}`;
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        debug: true,
      },
      global: {
        headers: {
          'X-Client-Info': 'stayback-web-app',
        },
      },
    }
  ) as SupabaseClient<Database>;

  return supabaseInstance;
}

// Criamos um proxy que só inicializa o cliente quando for realmente usado
const supabaseProxy = new Proxy({} as SupabaseClient<Database>, {
  get: (target, prop) => {
    try {
      // Tenta obter o cliente Supabase apenas quando uma propriedade for acessada
      const client = getSupabaseClient();
      return client[prop as keyof SupabaseClient<Database>];
    } catch (error) {
      // Se estiver no servidor durante o build, lança erro
      if (error instanceof Error && error.message.includes('lado do cliente')) {
        throw new Error(`Tentativa de acessar Supabase no servidor: ${String(prop)}`);
      }
      throw error;
    }
  },
});

export const supabase = supabaseProxy;
