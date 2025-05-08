import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que não precisam de autenticação
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/reset-password',
  '/update-password',
  '/registration-success',
  '/auth/callback'
];

// Middleware para verificar autenticação
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Verificar se a rota atual é pública
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(`${route}/`));
  
  // Se for uma rota da API, pular a verificação
  if (path.startsWith('/api/')) {
    return res;
  }
  
  // Para rotas públicas, não é necessário verificar autenticação
  if (isPublicRoute) {
    return res;
  }
  
  // Verificar se o usuário está autenticado
  const { data: { session } } = await supabase.auth.getSession();
  
  // Se não estiver autenticado, redirecionar para a página de login
  if (!session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

// Definir padrões de rotas onde o middleware será executado
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (arquivos estáticos do Next.js)
     * - _next/image (otimização de imagens do Next.js)
     * - favicon.ico (ícone da página)
     * - public files (arquivos públicos na pasta public)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 