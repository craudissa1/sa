# Descrição da Página: app/financas/page.tsx

Esta página é dedicada ao gerenciamento financeiro do usuário, oferecendo ferramentas para rastrear gastos, organizar orçamentos e visualizar pagamentos.

**Funcionalidades Principais:**

*   **Rastreador de Gastos:** Exibe um componente para rastrear e visualizar os gastos. Este componente (`RastreadorGastos`) é carregado dinamicamente (client-side only) para evitar problemas com bibliotecas de gráficos (como `recharts`) que dependem de APIs do navegador. Uma mensagem "Carregando gráfico..." é exibida durante o carregamento.
*   **Envelopes Virtuais:** Permite ao usuário organizar seu orçamento utilizando o método de envelopes virtuais (componente `EnvelopesVirtuais`).
*   **Calendário de Pagamentos:** Apresenta um calendário para que o usuário possa visualizar e gerenciar seus pagamentos agendados (componente `CalendarioPagamentos`).
*   **Adicionar Despesa Rápida:** Oferece um formulário ou interface simplificada para adicionar novas despesas rapidamente (componente `AdicionarDespesa`).

**Componentes Utilizados (Exemplos):**

*   `Card`: Para organizar cada seção da página de finanças.
*   `RastreadorGastos`: Componente para visualização e gerenciamento de gastos (carregado dinamicamente).
*   `EnvelopesVirtuais`: Componente para o sistema de orçamento por envelopes.
*   `CalendarioPagamentos`: Componente para exibir e gerenciar o calendário de pagamentos.
*   `AdicionarDespesa`: Componente para o registro rápido de despesas.

**Dados e Lógica:**

*   A página estrutura a apresentação dos diferentes componentes de finanças.
*   A principal lógica específica de cada funcionalidade (rastreamento, envelopes, calendário, adição de despesa) reside nos componentes importados.
*   Utiliza `next/dynamic` para importar o componente `RastreadorGastos` apenas no lado do cliente (`ssr: false`), o que é uma prática comum para componentes que utilizam bibliotecas de gráficos que manipulam o DOM diretamente.