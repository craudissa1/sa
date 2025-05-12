import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Lista de rotas públicas que não exigem autenticação
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/reset-password',
  '/update-password',
  '/registration-success',
  '/auth/callback'
];

export async function middleware(request: NextRequest) {
  // Criar cliente Supabase usando a nova API
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({
            name,
            value, 
            ...options
          });
        },
        remove: (name, options) => {
          res.cookies.set({
            name,
            value: '',
            ...options
          });
        },
      },
    }
  );
  
  // Atualizar sessão se existir um cookie
  const { data: { session } } = await supabase.auth.getSession();
  
  // Obter o caminho atual
  const path = request.nextUrl.pathname;
  
  // Verificar se a URL contém parâmetros de autenticação
  // Importante: o Next.js server middleware não tem acesso ao fragment (parte após #),
  // então verifiquemos se há parâmetros na URL que indicam processo de autenticação
  const hasAuthParams = request.nextUrl.searchParams.has('code') || 
                      request.nextUrl.searchParams.has('error') || 
                      request.nextUrl.searchParams.has('access_token');
  
  // Verificar se é uma rota de callback do Supabase ou tem parâmetros de autenticação
  if (path.startsWith('/auth/callback') || hasAuthParams) {
    // Deixar o route handler processar o código de autenticação
    // Isso é crucial para que o processamento do token aconteça corretamente
    return res;
  }
  
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(`${route}/`));
  
  // Verificar se o usuário está autenticado
  const isAuthenticated = !!session;
  
  // Adicionar cabeçalhos de segurança e controle de cache
  res.headers.set('X-Client-Side-Only', 'true');
  res.headers.set('Cache-Control', 'no-store, max-age=0');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Verificar redirecionamento baseado na autenticação (exceto para rotas de callback)
  if (!isAuthenticated && !isPublicRoute) {
    // Redirecionar para login se o usuário não estiver autenticado e tentar acessar rota protegida
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }
  
  if (isAuthenticated && (path === '/login' || path === '/register')) {
    // Redirecionar para dashboard se o usuário já estiver autenticado e tentar acessar login/registro
    const redirectPath = request.nextUrl.searchParams.get('redirect') || '/dashboard';
    
    // Garantir que o redirecionamento seja para uma rota interna válida para evitar Open Redirect
    const redirectURL = redirectPath.startsWith('/') 
      ? new URL(redirectPath, request.url) 
      : new URL('/dashboard', request.url);
    
    return NextResponse.redirect(redirectURL);
  }
  
  return res;
}

// Definir padrões de rotas onde o middleware será executado
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (assets, JS bundles)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}; 