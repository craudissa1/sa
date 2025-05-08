
## 2. Atual 

```
1 | Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1.



Abaixo, uma lista das principais áreas funcionais e esforços de desenvolvimento:

### 4.1. Módulos de Gerenciamento Pessoal
*   **Descrição:** Conjunto de funcionalidades voltadas para o bem-estar e organização pessoal do usuário.
*   **Sub-módulos/Funcionalidades Específicas:**
    *   **Alimentação:** [`LembreteHidratacao.tsx`](app/components/alimentacao/LembreteHidratacao.tsx), [`PlanejadorRefeicoes.tsx`](app/components/alimentacao/PlanejadorRefeicoes.tsx), [`RegistroRefeicoes.tsx`](app/components/alimentacao/RegistroRefeicoes.tsx), [`alimentacaoStore.ts`](app/stores/alimentacaoStore.ts), [`app/alimentacao/page.tsx`](app/alimentacao/page.tsx).
    *   **Autoconhecimento:** [`EditorNotas.tsx`](app/components/autoconhecimento/EditorNotas.tsx), [`ListaNotas.tsx`](app/components/autoconhecimento/ListaNotas.tsx), [`ModoRefugio.tsx`](app/components/autoconhecimento/ModoRefugio.tsx), [`autoconhecimentoStore.ts`](app/stores/autoconhecimentoStore.ts), [`app/autoconhecimento/page.tsx`](app/autoconhecimento/page.tsx).
    *   **Saúde:** [`FatoresHumor.tsx`](app/components/saude/FatoresHumor.tsx), [`HumorCalendar.tsx`](app/components/saude/HumorCalendar.tsx), [`MedicamentosList.tsx`](app/components/saude/MedicamentosList.tsx), [`MonitoramentoHumor.tsx`](app/components/saude/MonitoramentoHumor.tsx), [`RegistroMedicamentos.tsx`](app/components/saude/RegistroMedicamentos.tsx), [`app/saude/page.tsx`](app/saude/page.tsx). (Nota: `ChecklistMedicamentos.tsx` em `inicio` também se relaciona aqui).
    *   **Sono:** [`ConfiguracaoLembretes.tsx`](app/components/sono/ConfiguracaoLembretes.tsx), [`RegistroSono.tsx`](app/components/sono/RegistroSono.tsx), [`VisualizadorSemanal.tsx`](app/components/sono/VisualizadorSemanal.tsx), [`sonoStore.ts`](app/stores/sonoStore.ts), [`app/sono/page.tsx`](app/sono/page.tsx).
    *   **Lazer:** [`AtividadesLazer.tsx`](app/components/lazer/AtividadesLazer.tsx), [`SugestoesDescanso.tsx`](app/components/lazer/SugestoesDescanso.tsx), [`TemporizadorLazer.tsx`](app/components/lazer/TemporizadorLazer.tsx), [`atividadesStore.ts`](app/stores/atividadesStore.ts), [`sugestoesStore.ts`](app/stores/sugestoesStore.ts), [`app/lazer/page.tsx`](app/lazer/page.tsx).
### 4.2. Módulos de Produtividade e Estudos
*   **Descrição:** Funcionalidades destinadas a auxiliar o usuário em seus estudos, preparação para concursos e gerenciamento de foco.
*   **Sub-módulos/Funcionalidades Específicas:**
    *   **Estudos:** [`RegistroEstudos.tsx`](app/components/estudos/RegistroEstudos.tsx), [`TemporizadorPomodoro.tsx`](app/components/estudos/TemporizadorPomodoro.tsx), [`VisualizadorChecklist.tsx`](app/components/estudos/VisualizadorChecklist.tsx), [`VisualizadorMarkdown.tsx`](app/components/estudos/VisualizadorMarkdown.tsx), componentes de Simulado (ex: [`SimuladoLoader.tsx`](app/components/estudos/simulado/SimuladoLoader.tsx)), stores ([`pomodoroStore.ts`](app/stores/pomodoroStore.ts), [`registroEstudosStore.ts`](app/stores/registroEstudosStore.ts), [`simuladoStore.ts`](app/stores/simuladoStore.ts)), páginas ([`app/estudos/page.tsx`](app/estudos/page.tsx), [`app/estudos/materiais/page.tsx`](app/estudos/materiais/page.tsx)), APIs de materiais ([`pages/api/materiais/`](pages/api/materiais/)).
    *   **Concursos:** Componentes em [`app/components/concursos/`](app/components/concursos/), stores ([`concursosStore.ts`](app/stores/concursosStore.ts), [`questoesStore.ts`](app/stores/questoesStore.ts)), página ([`app/concursos/page.tsx`](app/concursos/page.tsx)), API de geração de questões ([`pages/api/gerar-questao.ts`](pages/api/gerar-questao.ts)).
    *   **Hiperfocos:** Componentes em [`app/components/hiperfocos/`](app/components/hiperfocos/), store ([`hiperfocosStore.ts`](app/stores/hiperfocosStore.ts)), página ([`app/hiperfocos/page.tsx`](app/hiperfocos/page.tsx)).

### 4.3. Módulo de Finanças
*   **Descrição:** Funcionalidades para gerenciamento financeiro pessoal.
*   **Componentes/Stores/Páginas:** [`AdicionarDespesa.tsx`](app/components/financas/AdicionarDespesa.tsx), [`CalendarioPagamentos.tsx`](app/components/financas/CalendarioPagamentos.tsx), [`EnvelopesVirtuais.tsx`](app/components/financas/EnvelopesVirtuais.tsx), [`RastreadorGastos.tsx`](app/components/financas/RastreadorGastos.tsx), [`financasStore.ts`](app/stores/financasStore.ts), [`app/financas/page.tsx`](app/financas/page.tsx).


### 4.4. Módulo de Receitas
*   **Descrição:** Funcionalidades para gerenciamento e descoberta de receitas culinárias.
*   **Componentes/Stores/Páginas:** Componentes em [`app/components/receitas/`](app/components/receitas/), store ([`receitasStore.ts`](app/stores/receitasStore.ts)), páginas ([`app/receitas/page.tsx`](app/receitas/page.tsx), [`app/receitas/adicionar/page.tsx`](app/receitas/adicionar/page.tsx), [`app/receitas/lista-compras/page.tsx`](app/receitas/lista-compras/page.tsx)).


### 4.5. Funcionalidades Centrais e Estruturais
*   **Descrição:** Componentes e sistemas que dão suporte à aplicação como um todo.
*   **Sub-módulos/Funcionalidades Específicas:**
    *   **Dashboard/Início:** Componentes em [`app/components/inicio/`](app/components/inicio/) (ex: [`PainelDia.tsx`](app/components/inicio/PainelDia.tsx), [`ListaPrioridades.tsx`](app/components/inicio/ListaPrioridades.tsx)), store ([`prioridadesStore.ts`](app/stores/prioridadesStore.ts)), página principal ([`app/page.tsx`](app/page.tsx)).
    *   **Perfil do Usuário:** Componentes em [`app/components/perfil/`](app/components/perfil/) (ex: [`InformacoesPessoais.tsx`](app/components/perfil/InformacoesPessoais.tsx)), store ([`perfilStore.ts`](app/stores/perfilStore.ts)), página ([`app/perfil/page.tsx`](app/perfil/page.tsx)).
    *   **Interface de Autenticação (UI):** Páginas de login ([`app/auth/login/page.tsx`](app/auth/login/page.tsx)), signup ([`app/auth/signup/page.tsx`](app/auth/signup/page.tsx)), callback ([`app/auth/callback/route.ts`](app/auth/callback/route.ts)) e contexto de autenticação ([`AuthContext.tsx`](app/context/AuthContext.tsx)). Embora o `todo.md` mencione "Supabase Auth", ele não detalha a implementação da UI e o fluxo no frontend.
    *   **Biblioteca de Componentes de UI:** Esforço significativo na criação de componentes reutilizáveis em [`app/components/ui/`](app/components/ui/).
    *   **Gerenciamento de Estado com Zustand:** Implementação de múltiplas stores em [`app/stores/`](app/stores/) para gerenciar o estado global e local da aplicação.
    *   **Exportar/Importar Dados:** Componente [`ExportarImportarDados.tsx`](app/components/ExportarImportarDados.tsx).
    *   **ThemeProvider:** Componente [`ThemeProvider.tsx`](app/components/ThemeProvider.tsx) para temas visuais.
*   **Divergência:** Estes esforços estruturais e funcionalidades centrais, com exceção da menção genérica ao "Supabase Auth".