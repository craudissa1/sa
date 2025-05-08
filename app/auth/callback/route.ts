// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // URL atual (callback)
  const requestUrl = new URL(request.url);
  // Código de autenticação que o Supabase adiciona à URL quando redireciona para cá
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // Criar cliente do Supabase que funciona em server components
    const supabase = createRouteHandlerClient({ cookies });
    
    // Trocar o código por uma sessão
    await supabase.auth.exchangeCodeForSession(code);
    
    // Verificar se o usuário já possui um perfil
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.session.user.id)
        .single();
      
      // Se não existe perfil, criar um
      if (!profile) {
        const { error } = await supabase.from('user_profiles').insert([
          {
            user_id: session.session.user.id,
            name: session.session.user.user_metadata.full_name || '',
            email: session.session.user.email,
            created_at: new Date().toISOString(),
          },
        ]);
        
        if (error) {
          console.error('Erro ao criar perfil:', error);
        }
      }
    }
  }
  
  // Redirecionar para o dashboard após login bem-sucedido
  return NextResponse.redirect(new URL('/dashboard', request.url));
}

export const dynamic = 'force-dynamic';

