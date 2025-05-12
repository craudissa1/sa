// Arquivo para lidar com requisições de API no ambiente Netlify
// Isso ajuda a resolver problemas de comunicação com o Supabase

const { builder } = require('@netlify/functions');
const { createServerClient } = require('@supabase/ssr');

// Função para adicionar headers CORS
function addCorsHeaders(headers = {}) {
  return {
    ...headers,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Authorization, X-Client-Info',
    'Access-Control-Allow-Credentials': 'true'
  };
}

// Handler principal para processar requisições da API
async function handler(event, context) {
  // Responder imediatamente para requisições OPTIONS (preflight CORS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: addCorsHeaders(),
      body: ''
    };
  }

  try {
    // Obter cookies da requisição
    const cookieHeader = event.headers.cookie || '';
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) acc[key] = value;
      return acc;
    }, {});

    // Criar cliente do Supabase para o servidor
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name) => cookies[name],
          set: (name, value, options) => {
            // No ambiente Netlify não podemos definir cookies diretamente
            // Retornamos os cookies como headers para o cliente definir
            return { name, value, options };
          },
          remove: (name, options) => {
            // Implementação para remover cookies
            return { name, value: '', options: { ...options, maxAge: 0 } };
          },
        },
      }
    );

    // Extrair informações da rota a partir do path
    const path = event.path.replace('/.netlify/functions/api', '');
    
    // Exemplo de como processar diferentes rotas da API
    // Adapte conforme as necessidades específicas da aplicação
    if (path === '/auth/session') {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          statusCode: 401,
          headers: addCorsHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ error: error.message })
        };
      }
      
      return {
        statusCode: 200,
        headers: addCorsHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      };
    }
    
    // Rota padrão para requisições não específicas
    return {
      statusCode: 200,
      headers: addCorsHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        message: 'API funcionando corretamente',
        path: path,
        method: event.httpMethod
      })
    };
    
  } catch (error) {
    console.error('Erro ao processar requisição da API:', error);
    
    return {
      statusCode: 500,
      headers: addCorsHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        error: 'Erro interno no servidor',
        message: error.message
      })
    };
  }
}

// Exportar o handler utilizando o builder do Netlify
exports.handler = builder(handler);
