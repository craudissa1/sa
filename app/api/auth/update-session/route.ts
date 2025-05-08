import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Esta API é chamada quando o estado da autenticação muda para atualizar a sessão no lado do servidor
export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.json();
  const { event, session } = formData;

  // Criar cliente Supabase para o servidor
  const supabase = createRouteHandlerClient({ cookies });

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
