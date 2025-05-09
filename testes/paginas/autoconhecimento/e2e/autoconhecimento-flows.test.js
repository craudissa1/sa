/**
 * Testes E2E para os fluxos da página de autoconhecimento
 * Utilizando ferramentas Supabase MCP para ambiente isolado
 */

const { 
  setupTestEnvironment, 
  applyTestMigration, 
  executeSQL, 
  cleanupTestEnvironment 
} = require('../../../e2e/config/supabase-mcp-config');

const {
  setupAutoconhecimentoTestEnv,
  criarNotaTeste,
  atualizarNotaTeste,
  configurarModoRefugio,
  obterNotasSecao,
  limparDadosAutoconhecimentoTeste,
  autoconhecimentoTestSchema,
  testUser
} = require('../setup-autoconhecimento');

// Função auxiliar para login
async function loginTestUser(page, supabase) {
  // Simula login de usuário para testes
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', testUser.email);
  await page.fill('[data-testid="password-input"]', testUser.password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/');
  
  // Obter ID do usuário logado
  const { data } = await supabase.auth.getUser();
  return data.user;
}

describe('Testes E2E da Página de Autoconhecimento', () => {
  let testEnv;
  let browser;
  let page;
  let supabase;
  let testUserId;
  
  // Setup global: criar ambiente isolado para testes
  beforeAll(async () => {
    // Configurar ambiente MCP isolado para testes
    testEnv = await setupAutoconhecimentoTestEnv();
    
    // Inicializar navegador e página para testes
    browser = await playwright.chromium.launch();
    const context = await browser.newContext();
    page = await context.newPage();
    
    // Inicializar Supabase com chaves do ambiente de teste
    const { createClient } = require('@supabase/supabase-js');
    const { data: projectUrl } = await mcp4_get_project_url({ project_id: testEnv.projectId });
    const { data: anonKey } = await mcp4_get_anon_key({ project_id: testEnv.projectId });
    
    supabase = createClient(projectUrl, anonKey);
    
    // Registrar usuário de teste se não existir
    try {
      const { data, error } = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
        options: {
          data: {
            full_name: testUser.nome_completo
          }
        }
      });
      
      if (!error) {
        testUserId = data.user.id;
      } else {
        // Tentar login se usuário já existir
        const { data: loginData } = await supabase.auth.signInWithPassword({
          email: testUser.email,
          password: testUser.password
        });
        testUserId = loginData.user.id;
      }
      
      console.log(`👤 Usuário de teste configurado: ${testUserId}`);
    } catch (error) {
      console.error('❌ Erro ao configurar usuário de teste:', error);
    }
  });
  
  // Cleanup após todos os testes
  afterAll(async () => {
    // Fechar navegador
    if (browser) {
      await browser.close();
    }
    
    // Limpar dados de teste
    if (testEnv && testEnv.success && testUserId) {
      await limparDadosAutoconhecimentoTeste(testEnv.projectId, testUserId);
    }
    
    // Limpar ambiente MCP
    if (testEnv && testEnv.success) {
      await cleanupTestEnvironment({
        projectId: testEnv.projectId,
        branchId: testEnv.branchId,
        isBranch: testEnv.isBranch
      });
      
      console.log('🧹 Ambiente de teste limpo com sucesso');
    }
  });
  
  // Teste: Navegação entre abas
  test('Deve permitir navegar entre as três seções', async () => {
    // Pular teste se ambiente não estiver configurado
    if (!testEnv || !testEnv.success) {
      console.warn('⚠️ Ambiente de teste não configurado. Pulando teste.');
      return;
    }
    
    // 1. Fazer login com usuário de teste
    await loginTestUser(page, supabase);
    
    // 2. Visitar a página de autoconhecimento
    await page.goto('/autoconhecimento');
    
    // 3. Verificar navegação para "Quem sou"
    await page.click('[data-testid="tab-quem-sou"]');
    let sectionHeader = await page.waitForSelector('[data-testid="section-header"]');
    expect(await sectionHeader.textContent()).toContain('Quem sou');
    
    // 4. Verificar navegação para "Meus porquês"
    await page.click('[data-testid="tab-meus-porques"]');
    sectionHeader = await page.waitForSelector('[data-testid="section-header"]');
    expect(await sectionHeader.textContent()).toContain('Meus porquês');
    
    // 5. Verificar navegação para "Meus padrões"
    await page.click('[data-testid="tab-meus-padroes"]');
    sectionHeader = await page.waitForSelector('[data-testid="section-header"]');
    expect(await sectionHeader.textContent()).toContain('Meus padrões');
    
    // 6. Verificar persistência da aba selecionada após recarregar
    await page.reload();
    sectionHeader = await page.waitForSelector('[data-testid="section-header"]');
    expect(await sectionHeader.textContent()).toContain('Meus padrões');
  });
  
  // Teste: Criação de notas
  test('Deve permitir criar novas notas', async () => {
    // Pular teste se ambiente não estiver configurado
    if (!testEnv || !testEnv.success) {
      console.warn('⚠️ Ambiente de teste não configurado. Pulando teste.');
      return;
    }
    
    // 1. Fazer login com usuário de teste
    await loginTestUser(page, supabase);
    
    // 2. Visitar a página de autoconhecimento
    await page.goto('/autoconhecimento');
    
    // 3. Selecionar a seção "Quem sou"
    await page.click('[data-testid="tab-quem-sou"]');
    
    // 4. Clicar no botão de criar nova nota
    await page.click('[data-testid="nova-nota-btn"]');
    
    // 5. Preencher campos da nota
    const tituloNota = `Teste automatizado ${Date.now()}`;
    const conteudoNota = 'Conteúdo da nota de teste criada durante o teste E2E';
    
    await page.fill('[data-testid="nota-titulo"]', tituloNota);
    await page.fill('[data-testid="nota-conteudo"]', conteudoNota);
    
    // 6. Salvar a nota
    await page.click('[data-testid="salvar-nota-btn"]');
    
    // 7. Verificar persistência no banco usando MCP
    const result = await executeSQL(
      testEnv.projectId,
      `SELECT * FROM notes WHERE user_id = '${testUserId}' AND section = 'quem_sou' ORDER BY created_at DESC LIMIT 1`
    );
    
    // 8. Validar resultados
    expect(result.success).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].title).toBe(tituloNota);
    expect(result.data[0].content).toBe(conteudoNota);
    
    // 9. Verificar exibição na UI
    await page.reload();
    const notaElement = await page.waitForSelector(`[data-testid="nota-item"]:has-text("${tituloNota}")`);
    expect(notaElement).toBeTruthy();
  });
  
  // Teste: Edição de notas
  test('Deve permitir editar notas existentes', async () => {
    // Pular teste se ambiente não estiver configurado
    if (!testEnv || !testEnv.success) {
      console.warn('⚠️ Ambiente de teste não configurado. Pulando teste.');
      return;
    }
    
    // 1. Criar nota de teste diretamente no banco
    const notaResult = await criarNotaTeste(testEnv.projectId, testUserId, {
      section: 'meus_porques',
      title: 'Nota para edição',
      content: 'Conteúdo original da nota'
    });
    
    expect(notaResult.success).toBe(true);
    const notaId = notaResult.data[0].id;
    
    // 2. Fazer login com usuário de teste
    await loginTestUser(page, supabase);
    
    // 3. Visitar a página de autoconhecimento
    await page.goto('/autoconhecimento');
    
    // 4. Selecionar a seção "Meus porquês"
    await page.click('[data-testid="tab-meus-porques"]');
    
    // 5. Clicar na nota para editar
    await page.click(`[data-testid="nota-item"]:has-text("Nota para edição")`);
    
    // 6. Editar campos da nota
    const novoTitulo = 'Nota editada';
    const novoConteudo = 'Conteúdo atualizado da nota';
    
    await page.fill('[data-testid="nota-titulo"]', novoTitulo);
    await page.fill('[data-testid="nota-conteudo"]', novoConteudo);
    
    // 7. Salvar as alterações
    await page.click('[data-testid="salvar-nota-btn"]');
    
    // 8. Verificar persistência no banco usando MCP
    const result = await executeSQL(
      testEnv.projectId,
      `SELECT * FROM notes WHERE id = '${notaId}'`
    );
    
    // 9. Validar resultados
    expect(result.success).toBe(true);
    expect(result.data.length).toBe(1);
    expect(result.data[0].title).toBe(novoTitulo);
    expect(result.data[0].content).toBe(novoConteudo);
    
    // 10. Verificar exibição na UI
    await page.reload();
    const notaElement = await page.waitForSelector(`[data-testid="nota-item"]:has-text("${novoTitulo}")`);
    expect(notaElement).toBeTruthy();
  });
  
  // Teste: Modo Refúgio
  test('Deve permitir ativar e desativar o modo refúgio', async () => {
    // Pular teste se ambiente não estiver configurado
    if (!testEnv || !testEnv.success) {
      console.warn('⚠️ Ambiente de teste não configurado. Pulando teste.');
      return;
    }
    
    // 1. Fazer login com usuário de teste
    await loginTestUser(page, supabase);
    
    // 2. Visitar a página de autoconhecimento
    await page.goto('/autoconhecimento');
    
    // 3. Verificar estado inicial (modo refúgio desativado)
    const initialModeElement = await page.waitForSelector('[data-testid="modo-refugio-status"]');
    expect(await initialModeElement.textContent()).toContain('Desativado');
    
    // 4. Ativar modo refúgio
    await page.click('[data-testid="modo-refugio-toggle"]');
    
    // 5. Verificar persistência no banco usando MCP
    let result = await executeSQL(
      testEnv.projectId,
      `SELECT * FROM user_preferences WHERE user_id = '${testUserId}'`
    );
    
    // 6. Validar resultados
    expect(result.success).toBe(true);
    expect(result.data.length).toBe(1);
    expect(result.data[0].refugio_mode).toBe(true);
    
    // 7. Verificar exibição na UI após ativação
    const activeModeElement = await page.waitForSelector('[data-testid="modo-refugio-status"]');
    expect(await activeModeElement.textContent()).toContain('Ativado');
    
    // 8. Verificar mudanças na interface
    const simplifiedUI = await page.isVisible('[data-testid="interface-simplificada"]');
    expect(simplifiedUI).toBe(true);
    
    // 9. Desativar modo refúgio
    await page.click('[data-testid="modo-refugio-toggle"]');
    
    // 10. Verificar persistência após desativação
    result = await executeSQL(
      testEnv.projectId,
      `SELECT * FROM user_preferences WHERE user_id = '${testUserId}'`
    );
    
    expect(result.success).toBe(true);
    expect(result.data.length).toBe(1);
    expect(result.data[0].refugio_mode).toBe(false);
    
    // 11. Verificar exibição na UI após desativação
    const inactiveModeElement = await page.waitForSelector('[data-testid="modo-refugio-status"]');
    expect(await inactiveModeElement.textContent()).toContain('Desativado');
  });
});
