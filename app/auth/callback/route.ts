import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/types/supabase';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirect') || '/dashboard';

  // Se não tiver código, vamos verificar se isso pode ser um redirecionamento com hash fragment
  if (!code) {
    // Redirecionamos para uma página client que vai processar o hash fragment
    const callbackUrl = new URL('/auth/process-token', requestUrl.origin);
    callbackUrl.searchParams.set('redirect', redirectTo);
    return NextResponse.redirect(callbackUrl);
  }

  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Trocar o código por uma sessão
  await supabase.auth.exchangeCodeForSession(code);

  // Verificar se o usuário já possui um perfil
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    // Se não existe perfil, criar um
    if (!profile) {
      const { error } = await supabase.from('profiles').insert([
        {
          id: session.user.id,
          nome_completo: session.user.user_metadata.full_name || '',
          idioma: 'pt-BR',
          tema_visual: 'system',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error('Erro ao criar perfil:', error);
      }
    }
  }

  // Determinar a URL base para redirecionamento
  const hostname = requestUrl.hostname;
  let baseUrl;

  // Se estiver em um domínio do Netlify com ID de deploy (contendo --)
  if (hostname.includes('--')) {
    const mainDomain = hostname.split('--')[1];
    baseUrl = `${requestUrl.protocol}//${mainDomain}`;
  } else {
    baseUrl = `${requestUrl.protocol}//${hostname}`;
  }

  // Redirecionar para a página solicitada ou dashboard
  return NextResponse.redirect(`${baseUrl}${redirectTo}`);
}

export const dynamic = 'force-dynamic';
