import { createServerClient, CookieOptions } from '@supabase/ssr';
import { CookieMethodsServer } from '@/types/supabase-ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Definir os tipos para os eventos do webhook
type WebhookPayload = {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: any;
  schema: string;
  old_record: any | null;
};

/**
 * Esta rota é chamada pelo Supabase para webhooks
 * Pode ser usada para executar ações quando eventos específicos ocorrem no banco de dados
 * Por exemplo: enviar emails, criar registros em outras tabelas, etc.
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar a chave de API para segurança
    const authHeader = request.headers.get('x-api-key');
    const webhookKey = process.env.SUPABASE_WEBHOOK_KEY;
    
    // Se a chave não corresponder, retornar erro
    if (authHeader !== webhookKey) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Processar o corpo do webhook
    const payload: WebhookPayload = await request.json();
    
    // Cliente do Supabase para operações autenticadas como servidor
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
    
    // Processar diferentes tipos de eventos
    switch (payload.table) {
      case 'profiles':
        // Quando um perfil de usuário é criado ou atualizado
        if (payload.type === 'INSERT' || payload.type === 'UPDATE') {
          // Por exemplo, atualizar configurações padrão, enviar email de boas-vindas, etc.
          console.log(`Perfil de usuário ${payload.record.id} ${payload.type === 'INSERT' ? 'criado' : 'atualizado'}`);
        }
        break;
        
      case 'tasks':
        // Quando uma tarefa é criada
        if (payload.type === 'INSERT') {
          // Por exemplo, enviar notificação para o usuário
          console.log(`Nova tarefa criada para o usuário ${payload.record.user_id}`);
        }
        break;
        
      // Adicione mais casos para outras tabelas conforme necessário
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 