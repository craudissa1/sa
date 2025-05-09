# Descrição da Página: app/perfil/page.tsx

Esta página permite ao usuário visualizar e gerenciar suas informações pessoais, metas diárias, preferências visuais e realizar operações de exportação/importação de dados.

**Funcionalidades Principais:**

*   **Informações Pessoais:** Exibe e permite a edição das informações pessoais do usuário (componente `InformacoesPessoais`).
*   **Metas Diárias:** Permite ao usuário definir e acompanhar suas metas diárias (componente `MetasDiarias`).
*   **Preferências Visuais:** Oferece opções para o usuário personalizar a aparência da aplicação, como:
    *   Alto Contraste
    *   Redução de Estímulos
    *   Texto Grande
    (componente `PreferenciasVisuais`). As classes CSS correspondentes (`alto-contraste`, `reducao-estimulos`, `texto-grande`) são aplicadas dinamicamente ao elemento `<html>` com base nas seleções.
*   **Exportar/Importar Dados:** Fornece funcionalidade para exportar os dados do usuário e importar dados previamente exportados (componente `ExportarImportarDados`).
*   **Redefinir Configurações:** Um botão "Redefinir" permite ao usuário restaurar todas as suas preferências, metas e configurações para os valores padrão. Uma modal de confirmação (`resetConfirmOpen`) é exibida para evitar redefinições acidentais.

**Componentes Utilizados (Exemplos):**

*   `InformacoesPessoais`: Formulário ou seção para dados pessoais.
*   `MetasDiarias`: Interface para gerenciamento de metas diárias.
*   `PreferenciasVisuais`: Controles para as opções de acessibilidade visual.
*   `ExportarImportarDados`: Interface para exportação e importação de dados.
*   Ícones `User` e `RefreshCw` da biblioteca `lucide-react`.
*   Modal de confirmação para a ação de redefinir.

**Dados e Lógica:**

*   Utiliza o `usePerfilStore` para acessar e modificar os dados do perfil do usuário (`perfilStore.perfil`, `perfilStore.resetarPerfilLocal()`).
*   Um `useEffect` hook é responsável por aplicar as classes de preferência visual ao `document.documentElement` quando a página carrega e também por removê-las quando o componente é desmontado (cleanup).
*   Gerencia o estado `resetConfirmOpen` para controlar a visibilidade do modal de confirmação de redefinição.
*   A função `confirmarReset` chama `perfilStore.resetarPerfilLocal()` para efetivar a redefinição e fecha o modal.
*   Se `perfilStore.perfil` for nulo inicialmente, um objeto de perfil padrão com `preferenciasVisuais` básicas é usado para evitar erros.