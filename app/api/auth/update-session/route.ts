import { createServerClient, CookieOptions } from '@supabase/ssr';
import { CookieMethodsServer } from '@/types/supabase-ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Esta API é chamada quando o estado da autenticação muda para atualizar a sessão no lado do servidor
