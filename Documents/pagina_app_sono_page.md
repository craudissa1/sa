# Descrição da Página: app/sono/page.tsx

Esta página é dedicada à gestão do sono do usuário, oferecendo ferramentas para registrar, visualizar e configurar lembretes relacionados ao sono.

**Funcionalidades Principais:**

*   **Navegação por Abas:** A interface é dividida em três abas principais:
    *   **Registrar Sono:** Permite ao usuário registrar seus horários de dormir e acordar, e possivelmente outras informações relevantes sobre a qualidade do sono (componente `RegistroSono`).
    *   **Visualizar Sono:** Apresenta uma visualização dos padrões de sono do usuário, provavelmente em um formato semanal ou gráfico (componente `VisualizadorSemanal`).
    *   **Lembretes:** Permite ao usuário configurar lembretes para ajudar a estabelecer uma rotina de sono (componente `ConfiguracaoLembretes`).
*   **Informações Educacionais:**
    *   Inclui uma seção com informações sobre a importância do sono de qualidade, especialmente para pessoas neurodivergentes.
    *   Oferece dicas para melhorar os hábitos de sono (manter horários regulares, criar rotina relaxante, reduzir luz azul, evitar cafeína).

**Componentes Utilizados (Exemplos):**

*   `RegistroSono`: Formulário ou interface para registrar dados de sono.
*   `VisualizadorSemanal`: Componente para exibir graficamente os dados de sono.
*   `ConfiguracaoLembretes`: Interface para configurar alertas e lembretes de sono.
*   Botões de navegação para alternar entre as abas "Registrar Sono", "Visualizar Sono" e "Lembretes".
*   Um ícone SVG customizado para representar a seção de sono.

**Dados e Lógica:**

*   Gerencia o estado `abaSelecionada` para controlar qual das três seções de funcionalidade (`registro`, `visualizador`, `lembretes`) está ativa e sendo exibida.
*   A lógica específica de cada funcionalidade (registro, visualização, configuração de lembretes) reside nos respectivos componentes importados e, possivelmente, em um `sonoStore` associado.
*   A seção de informações educacionais é estática e visa fornecer contexto e dicas úteis ao usuário.