import { createServerClient, CookieOptions } from '@supabase/ssr';
import { CookieMethodsServer } from '@/types/supabase-ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Esta API é chamada quando o estado da autenticação muda para atualizar a sessão no lado do servidor
export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.json();
  const { event, session } = formData;

  // Criar cliente Supabase para o servidor
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options })
        },
      } satisfies CookieMethodsServer,
    }
  );

  // Manter a sessão consistente entre o cliente e o servidor
  if (session) {
    // Definir cookies da sessão
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  }

  // Processar eventos de autenticação
  if (event === 'SIGNED_OUT') {
    // Limpar cookies da sessão ao fazer logout
    cookies().delete('supabase-auth-token');
  }

  return NextResponse.json({ status: 'ok' });
}
