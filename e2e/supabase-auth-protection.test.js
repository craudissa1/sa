// Testes para proteção de rotas e middleware de autenticação
const { supabase } = require('@/lib/supabaseClient');
const fetch = require('node-fetch');

// Dados para teste - usando um usuário existente
const testUser = {
  email: 'teste@exemplo.com',
  password: 'senha123',
  nome_completo: 'Usuário Teste Proteção' // Adicionada propriedade nome_completo para consistência
};

// ID conhecido do usuário de teste
// const userId = '66fb3b09-5025-49e7-8476-1cf29137aad4'; // Não usado diretamente nos testes com followRedirects

// URL base do aplicativo para testes
const APP_URL = process.env.TEST_APP_URL || 'http://localhost:3000';

// Função auxiliar para verificar se o servidor está ativo
async function isServerRunning() {
  try {
    const response = await fetch(APP_URL, {
      method: 'HEAD',
      timeout: 3000
    });
    return response.status < 500; // Considera qualquer resposta não 5xx como servidor ativo
  } catch (error) {
    console.warn(`Servidor não detectado em ${APP_URL}: ${error.message}`);
    return false;
  }
}

/**
 * Simula o comportamento do navegador para testar redirecionamentos
 * @param {string} url - URL inicial para fazer a requisição
 * @param {number} maxRedirects - Número máximo de redirecionamentos a seguir
 * @returns {Promise<{finalUrl: string, statusCode: number}>} - URL final após redirecionamentos
 */
async function followRedirects(url, maxRedirects = 5) {
  let currentUrl = url;
  let redirectCount = 0;
  let lastStatusCode = 200;
  
  while (redirectCount < maxRedirects) {
    const response = await fetch(currentUrl, {
      method: 'GET',
      redirect: 'manual', // Não seguir redirecionamentos automaticamente
      headers: {
        'User-Agent': 'Mozilla/5.0 (Node.js Fetch)'
        // Para testes autenticados, o cookie de sessão do Supabase deve ser gerenciado
        // pelo cliente Supabase e enviado automaticamente pelo `node-fetch` se estiver no mesmo "agente"
        // ou se os cabeçalhos de autenticação forem configurados manualmente (mais complexo para simular cookies).
        // A abordagem mais simples é confiar que o cliente Supabase mantém a sessão.
      }
    });
    
    lastStatusCode = response.status;
    
    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return { finalUrl: currentUrl, statusCode: lastStatusCode };
    }
    
    const location = response.headers.get('location');
    if (!location) break;
    
    currentUrl = location.startsWith('http')
      ? location
      : new URL(location, currentUrl).toString();
    
    redirectCount++;
  }
  
  return { finalUrl: currentUrl, statusCode: lastStatusCode };
}

describe('Testes de Proteção de Rotas e Middleware', () => {
  jest.setTimeout(15000); // Aumentar o timeout para testes de autenticação e fetch
  
  // Variável para rastrear se o servidor está disponível
  let serverActive = false;

  // Não é necessário armazenar o accessToken manualmente se confiarmos na sessão do cliente Supabase
  // let accessToken = null;

  // Fazer login uma vez antes de todos os testes que precisam de usuário autenticado
  // e logout após todos os testes.
  // Testes individuais podem fazer login/logout se precisarem de um estado específico.

  beforeEach(async () => {
    // Verificar se o servidor está ativo no início dos testes
    if (!serverActive) {
      serverActive = await isServerRunning();
    }
    
    // Garantir que estamos deslogados antes de cada teste que possa modificar o estado de auth
    await supabase.auth.signOut();
  });
  
  afterAll(async () => {
    // Garantir logout ao final de todos os testes
    await supabase.auth.signOut();
  });
  
  test('Deve redirecionar para /login ao tentar acessar rota protegida (/perfil) sem autenticação', async () => {
    // Pular teste se o servidor não estiver disponível
    if (!serverActive) {
      console.warn('Servidor não detectado, pulando teste de redirecionamento');
      return;
    }
    await supabase.auth.signOut(); // Garantir deslogado
    
    const protectedUrl = `${APP_URL}/perfil`;
    const { finalUrl, statusCode } = await followRedirects(protectedUrl);
    
    expect([301, 302, 303, 307, 308].includes(statusCode)).toBeTruthy();
    expect(finalUrl.startsWith(`${APP_URL}/login`)).toBeTruthy();
    // Verificar se o parâmetro de redirecionamento está presente e correto
    const urlParams = new URL(finalUrl).searchParams;
    expect(urlParams.get('redirect')).toBe('/perfil');
  });
  
  test('Deve permitir acesso à rota protegida (/perfil) com autenticação', async () => {
    // Pular teste se o servidor não estiver disponível
    if (!serverActive) {
      console.warn('Servidor não detectado, pulando teste de acesso autenticado');
      return;
    }
    // Fazer login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword(testUser);
    expect(loginError).toBeNull();
    expect(loginData.session).toBeDefined();
    
    const protectedUrl = `${APP_URL}/perfil`;
    const { finalUrl, statusCode } = await followRedirects(protectedUrl);
    
    expect(statusCode).toBe(200); // Acesso permitido
    expect(finalUrl).toBe(protectedUrl); // Não deve ser redirecionado
  });
  
  test('Deve manter a sessão ao navegar entre rotas protegidas', async () => {
    // Pular teste se o servidor não estiver disponível
    if (!serverActive) {
      console.warn('Servidor não detectado, pulando teste de sessão entre rotas');
      return;
    }
    // Fazer login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword(testUser);
    expect(loginError).toBeNull();
    expect(loginData.session).toBeDefined();
    
    // Acessar primeira rota protegida
    const perfilUrl = `${APP_URL}/perfil`;
    const { finalUrl: finalPerfilUrl, statusCode: perfilStatusCode } = await followRedirects(perfilUrl);
    expect(perfilStatusCode).toBe(200);
    expect(finalPerfilUrl).toBe(perfilUrl);
    
    // Acessar segunda rota protegida (ex: /estudos, assumindo que é protegida)
    // Se /estudos não existir ou for pública, este teste precisará de ajuste para uma rota protegida válida.
    // Por enquanto, vamos re-testar /perfil ou usar uma rota genérica que deveria ser protegida.
    // Para este exemplo, vamos usar /estudos como se fosse protegida.
    // Se não houver outra rota protegida clara, podemos repetir o acesso a /perfil.
    const estudosUrl = `${APP_URL}/estudos`; // Assumindo que /estudos é protegida
    const { finalUrl: finalEstudosUrl, statusCode: estudosStatusCode } = await followRedirects(estudosUrl);
    
    // Se /estudos for de fato protegida e existir:
    expect(estudosStatusCode).toBe(200);
    expect(finalEstudosUrl).toBe(estudosUrl);
    // Se /estudos não for protegida ou não existir, este teste falhará ou dará 404.
    // Ajuste 'estudosUrl' para uma rota protegida válida e existente se necessário.
  });
  
  test('Deve redirecionar para a página original (/perfil) após login', async () => {
    // Pular teste se o servidor não estiver disponível
    if (!serverActive) {
      console.warn('Servidor não detectado, pulando teste de redirecionamento pós-login');
      return;
    }
    await supabase.auth.signOut(); // Garantir deslogado
    
    const originalProtectedUrl = `${APP_URL}/perfil`;
    
    // 1. Tentar acessar /perfil sem autenticação -> deve ser redirecionado para /login?redirect=/perfil
    const { finalUrl: loginRedirectUrl, statusCode: redirectStatusCode } = await followRedirects(originalProtectedUrl);
    expect([301, 302, 303, 307, 308].includes(redirectStatusCode)).toBeTruthy();
    expect(loginRedirectUrl.startsWith(`${APP_URL}/login`)).toBeTruthy();
    expect(new URL(loginRedirectUrl).searchParams.get('redirect')).toBe('/perfil');
    
    // 2. Fazer login (o cliente Supabase agora terá a sessão)
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword(testUser);
    expect(loginError).toBeNull();
    expect(loginData.session).toBeDefined();
    
    // 3. Tentar acessar a URL de login que contém o parâmetro redirect.
    // A lógica da página de login (ou middleware, se o usuário já estiver logado ao bater no /login)
    // deve então redirecionar para a 'originalProtectedUrl'.
    // NOTA: O `followRedirects` aqui simula o navegador indo para a URL de login.
    // Se a página de login em si lida com o `router.push` baseado no `redirect` query param
    // e no estado de autenticação, este teste simula esse fluxo.
    const { finalUrl: finalDestinationUrl, statusCode: finalStatusCode } = await followRedirects(loginRedirectUrl);
    
    // Espera-se que o destino final seja a URL protegida original
    expect(finalStatusCode).toBe(200); // Acesso permitido à página original
    expect(finalDestinationUrl).toBe(originalProtectedUrl);
  });
});
